<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\GamePlayer;
use App\Models\GameProperty;
use App\Models\Property;
use App\Models\User;
use Database\Seeders\BoardSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PropertyLiquidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(BoardSeeder::class);
    }

    public function test_insufficient_rent_sets_pending_rent_and_blocks_end_turn(): void
    {
        [$game, $tenant, $owner, $property] = $this->createBaseGameState(tenantCredits: 1, tenantPosition: 1);

        GameProperty::create([
            'game_id' => $game->id,
            'property_id' => $property->id,
            'owner_user_id' => $owner->id,
            'houses' => 0,
            'has_hotel' => false,
            'purchased_at' => now(),
        ]);

        Sanctum::actingAs($tenant);

        $rentResponse = $this->postJson('/api/properties/pay-rent', [
            'game_id' => $game->id,
            'property_id' => $property->id,
        ]);

        $rentResponse
            ->assertStatus(409)
            ->assertJsonPath('pending_rent.amount', 2);

        $this->assertDatabaseHas('game_players', [
            'game_id' => $game->id,
            'user_id' => $tenant->id,
            'pending_rent_amount' => 2,
            'pending_rent_property_id' => $property->id,
            'pending_rent_owner_id' => $owner->id,
        ]);

        $endTurnResponse = $this->postJson("/api/games/{$game->id}/end-turn")
            ->assertStatus(422);

        $this->assertEquals(2, (int) $endTurnResponse->json('pending_rent.amount'));
    }

    public function test_selling_house_increases_credits_using_resale_value(): void
    {
        [$game, $tenant, $owner, $property] = $this->createBaseGameState(tenantCredits: 10, tenantPosition: 6);

        GameProperty::create([
            'game_id' => $game->id,
            'property_id' => $property->id,
            'owner_user_id' => $tenant->id,
            'houses' => 1,
            'has_hotel' => false,
            'purchased_at' => now(),
        ]);

        Sanctum::actingAs($tenant);

        $response = $this->postJson("/api/games/{$game->id}/properties/{$property->id}/sell-house");

        $response
            ->assertOk()
            ->assertJsonPath('credits_gained', 25)
            ->assertJsonPath('current_credits', 35);

        $this->assertDatabaseHas('game_properties', [
            'game_id' => $game->id,
            'property_id' => $property->id,
            'houses' => 0,
            'has_hotel' => false,
        ]);
    }

    public function test_property_with_upgrades_cannot_be_sold_directly(): void
    {
        [$game, $tenant, $owner, $property] = $this->createBaseGameState(tenantCredits: 10, tenantPosition: 6);

        GameProperty::create([
            'game_id' => $game->id,
            'property_id' => $property->id,
            'owner_user_id' => $tenant->id,
            'houses' => 2,
            'has_hotel' => false,
            'purchased_at' => now(),
        ]);

        Sanctum::actingAs($tenant);

        $this->postJson("/api/games/{$game->id}/properties/{$property->id}/sell")
            ->assertStatus(422)
            ->assertJsonPath('message', 'You must sell all houses and hotels before selling the property');
    }

    public function test_player_can_sell_assets_then_pay_pending_rent(): void
    {
        [$game, $tenant, $owner] = $this->createBaseGameState(tenantCredits: 0, tenantPosition: 1);

        $rentProperty = Property::whereHas('tile', function ($query) {
            $query->where('tile_number', 1);
        })->firstOrFail();
        $ownedProperty = Property::whereHas('tile', function ($query) {
            $query->where('tile_number', 6);
        })->firstOrFail();

        GameProperty::create([
            'game_id' => $game->id,
            'property_id' => $rentProperty->id,
            'owner_user_id' => $owner->id,
            'houses' => 0,
            'has_hotel' => false,
            'purchased_at' => now(),
        ]);

        GameProperty::create([
            'game_id' => $game->id,
            'property_id' => $ownedProperty->id,
            'owner_user_id' => $tenant->id,
            'houses' => 1,
            'has_hotel' => false,
            'purchased_at' => now(),
        ]);

        Sanctum::actingAs($tenant);

        $this->postJson('/api/properties/pay-rent', [
            'game_id' => $game->id,
            'property_id' => $rentProperty->id,
        ])->assertStatus(409);

        $this->postJson("/api/games/{$game->id}/properties/{$ownedProperty->id}/sell-house")
            ->assertOk();

        $this->postJson('/api/properties/pay-rent', [
            'game_id' => $game->id,
            'property_id' => $rentProperty->id,
        ])->assertOk();

        $this->assertDatabaseHas('game_players', [
            'game_id' => $game->id,
            'user_id' => $tenant->id,
            'pending_rent_amount' => null,
        ]);
    }

    public function test_declaring_bankruptcy_releases_properties_and_skips_future_turns(): void
    {
        [$game, $tenant, $owner, $property] = $this->createBaseGameState(tenantCredits: 0, tenantPosition: 1);

        GameProperty::create([
            'game_id' => $game->id,
            'property_id' => $property->id,
            'owner_user_id' => $tenant->id,
            'houses' => 0,
            'has_hotel' => false,
            'purchased_at' => now(),
        ]);

        Sanctum::actingAs($tenant);

        $response = $this->postJson("/api/games/{$game->id}/declare-bankruptcy")
            ->assertOk();

        $this->assertEquals($owner->id, (int) $response->json('current_turn_user_id'));

        $this->assertDatabaseHas('game_players', [
            'game_id' => $game->id,
            'user_id' => $tenant->id,
            'is_bankrupt' => true,
            'credits' => 0,
        ]);

        $this->assertDatabaseHas('game_properties', [
            'game_id' => $game->id,
            'property_id' => $property->id,
            'owner_user_id' => null,
            'houses' => 0,
            'has_hotel' => false,
        ]);
    }

    private function createBaseGameState(int $tenantCredits, int $tenantPosition): array
    {
        $tenant = User::factory()->create();
        $owner = User::factory()->create();

        $game = Game::create([
            'host_id' => $owner->id,
            'game_code' => 'ABC123',
            'status' => 'started',
            'current_turn_user_id' => $tenant->id,
            'turn_number' => 1,
            'last_dice_roll' => 4,
            'started_at' => now(),
        ]);

        GamePlayer::create([
            'game_id' => $game->id,
            'user_id' => $tenant->id,
            'credits' => $tenantCredits,
            'total_credits' => 100,
            'position' => $tenantPosition,
            'joined_at' => now(),
        ]);

        GamePlayer::create([
            'game_id' => $game->id,
            'user_id' => $owner->id,
            'credits' => 100,
            'total_credits' => 100,
            'position' => 0,
            'joined_at' => now()->addSecond(),
        ]);

        $property = Property::whereHas('tile', function ($query) use ($tenantPosition) {
            $query->where('tile_number', $tenantPosition);
        })->firstOrFail();

        return [$game, $tenant, $owner, $property];
    }
}
