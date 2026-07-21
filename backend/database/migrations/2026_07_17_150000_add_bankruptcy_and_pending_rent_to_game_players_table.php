<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('game_players', function (Blueprint $table) {
            $table->boolean('is_bankrupt')
                ->default(false)
                ->after('skip_turns');
            $table->timestamp('bankrupt_at')
                ->nullable()
                ->after('is_bankrupt');
            $table->unsignedInteger('pending_rent_amount')
                ->nullable()
                ->after('bankrupt_at');
            $table->unsignedBigInteger('pending_rent_property_id')
                ->nullable()
                ->after('pending_rent_amount');
            $table->unsignedBigInteger('pending_rent_owner_id')
                ->nullable()
                ->after('pending_rent_property_id');
        });
    }

    public function down(): void
    {
        Schema::table('game_players', function (Blueprint $table) {
            $table->dropColumn([
                'is_bankrupt',
                'bankrupt_at',
                'pending_rent_amount',
                'pending_rent_property_id',
                'pending_rent_owner_id',
            ]);
        });
    }
};
