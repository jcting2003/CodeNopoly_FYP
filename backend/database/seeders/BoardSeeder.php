<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\Property;
use App\Models\Tile;
use Illuminate\Database\Seeder;

class BoardSeeder extends Seeder
{
    public function run(): void
    {
        $tiles = [
            [0, 'GO', 'NFC_TILE_00', 'go', null],
            [1, 'HTML Avenue', 'NFC_TILE_01', 'property', 'easy'],
            [2, 'Community Chest', 'NFC_TILE_02', 'community_chest', null],
            [3, 'CSS Boulevard', 'NFC_TILE_03', 'property', 'easy'],
            [4, 'Syntax Tax', 'NFC_TILE_04', 'tax', null],
            [5, 'Git Station', 'NFC_TILE_05', 'property', 'easy'],
            [6, 'JavaScript Street', 'NFC_TILE_06', 'property', 'easy'],
            [7, 'Chance', 'NFC_TILE_07', 'chance', null],
            [8, 'Vue Vista', 'NFC_TILE_08', 'property', 'easy'],
            [9, 'TypeScript Terrace', 'NFC_TILE_09', 'property', 'medium'],
            [10, 'Debug Jail', 'NFC_TILE_10', 'jail', null],
            [11, 'PHP Place', 'NFC_TILE_11', 'property', 'medium'],
            [12, 'API Gateway', 'NFC_TILE_12', 'property', 'medium'],
            [13, 'Laravel Lane', 'NFC_TILE_13', 'property', 'medium'],
            [14, 'Composer Court', 'NFC_TILE_14', 'property', 'medium'],
            [15, 'Docker Station', 'NFC_TILE_15', 'property', 'medium'],
            [16, 'MySQL Market', 'NFC_TILE_16', 'property', 'medium'],
            [17, 'Community Chest', 'NFC_TILE_17', 'community_chest', null],
            [18, 'Query Quay', 'NFC_TILE_18', 'property', 'medium'],
            [19, 'Index Island', 'NFC_TILE_19', 'property', 'medium'],
            [20, 'Free Parking', 'NFC_TILE_20', 'free_parking', null],
            [21, 'Python Port', 'NFC_TILE_21', 'property', 'hard'],
            [22, 'Chance', 'NFC_TILE_22', 'chance', null],
            [23, 'OOP Orchard', 'NFC_TILE_23', 'property', 'hard'],
            [24, 'Algorithm Alley', 'NFC_TILE_24', 'property', 'hard'],
            [25, 'CI Station', 'NFC_TILE_25', 'property', 'hard'],
            [26, 'Testing Trail', 'NFC_TILE_26', 'property', 'hard'],
            [27, 'Refactor Road', 'NFC_TILE_27', 'property', 'hard'],
            [28, 'Cloud Compute', 'NFC_TILE_28', 'property', 'hard'],
            [29, 'Security Square', 'NFC_TILE_29', 'property', 'hard'],
            [30, 'Go To Jail', 'NFC_TILE_30', 'go_to_jail', null],
            [31, 'Data Structure Drive', 'NFC_TILE_31', 'property', 'hard'],
            [32, 'Recursion Ridge', 'NFC_TILE_32', 'property', 'hard'],
            [33, 'Community Chest', 'NFC_TILE_33', 'community_chest', null],
            [34, 'Optimization Office', 'NFC_TILE_34', 'property', 'hard'],
            [35, 'Deploy Station', 'NFC_TILE_35', 'property', 'hard'],
            [36, 'Chance', 'NFC_TILE_36', 'chance', null],
            [37, 'Machine Learning Mall', 'NFC_TILE_37', 'property', 'hard'],
            [38, 'Production Tax', 'NFC_TILE_38', 'tax', null],
            [39, 'Architecture Arcade', 'NFC_TILE_39', 'property', 'hard'],
        ];

        foreach ($tiles as [$number, $name, $nfc, $type, $difficulty]) {
            Tile::updateOrCreate(
                ['tile_number' => $number],
                [
                    'tile_name' => $name,
                    'nfc_value' => $nfc,
                    'tile_type' => $type,
                    'difficulty' => $difficulty,
                ]
            );
        }

        $properties = [
            [1, 60, 50, 50, 2, 'brown'],
            [3, 60, 50, 50, 4, 'brown'],
            [5, 200, 100, 100, 25, 'station'],
            [6, 100, 50, 50, 6, 'light_blue'],
            [8, 100, 50, 50, 6, 'light_blue'],
            [9, 120, 50, 50, 8, 'light_blue'],
            [11, 140, 100, 100, 10, 'pink'],
            [12, 150, 100, 100, 12, 'utility'],
            [13, 140, 100, 100, 10, 'pink'],
            [14, 160, 100, 100, 12, 'pink'],
            [15, 200, 100, 100, 25, 'station'],
            [16, 180, 100, 100, 14, 'orange'],
            [18, 180, 100, 100, 14, 'orange'],
            [19, 200, 100, 100, 16, 'orange'],
            [21, 220, 150, 150, 18, 'red'],
            [23, 220, 150, 150, 18, 'red'],
            [24, 240, 150, 150, 20, 'red'],
            [25, 200, 100, 100, 25, 'station'],
            [26, 260, 150, 150, 22, 'yellow'],
            [27, 260, 150, 150, 22, 'yellow'],
            [28, 150, 100, 100, 12, 'utility'],
            [29, 280, 150, 150, 24, 'yellow'],
            [31, 300, 200, 200, 26, 'green'],
            [32, 300, 200, 200, 26, 'green'],
            [34, 320, 200, 200, 28, 'green'],
            [35, 200, 100, 100, 25, 'station'],
            [37, 350, 200, 200, 35, 'dark_blue'],
            [39, 400, 200, 200, 50, 'dark_blue'],
        ];

        foreach ($properties as [$tileNumber, $cost, $houseCost, $hotelCost, $rent, $group]) {
            $tile = Tile::where('tile_number', $tileNumber)->first();

            if (! $tile) {
                continue;
            }

            Property::updateOrCreate(
                ['tile_id' => $tile->id],
                [
                    'property_name' => $tile->tile_name,
                    'cost' => $cost,
                    'house_cost' => $houseCost,
                    'hotel_cost' => $hotelCost,
                    'rent' => $rent,
                    'rent_1_house' => $rent * 5,
                    'rent_2_houses' => $rent * 15,
                    'rent_3_houses' => $rent * 45,
                    'rent_4_houses' => $rent * 80,
                    'rent_hotel' => $rent * 125,
                    'color_group' => $group,
                ]
            );
        }

        Card::whereIn('card_code', [
            'CHANCE_ADVANCE_GO',
            'CHANCE_FORWARD_3',
            'CHANCE_BACK_3',
            'CHANCE_TO_JAIL',
            'COMMUNITY_BONUS',
            'COMMUNITY_FINE',
            'COMMUNITY_FORWARD_2',
            'COMMUNITY_ADVANCE_GO',
        ])->delete();

        $cards = [
            ['CH_001', 'chance', 'Advance to GO', 'Move to GO and collect credits.', 'move_to_go', null, null],
            ['CH_002', 'chance', 'Sprint Review', 'Move forward 3 spaces.', 'move_forward', 3, null],
            ['CH_003', 'chance', 'Merge Conflict', 'Move backward 3 spaces.', 'move_backward', 3, null],
            ['CH_004', 'chance', 'Critical Bug', 'Go directly to Debug Jail.', 'move_to_tile', null, 10],
            ['CC_001', 'community_chest', 'Open Source Bonus', 'Collect 50 credits.', 'credits_add', 50, null],
            ['CC_002', 'community_chest', 'Build Failure', 'Pay 25 credits.', 'credits_deduct', 25, null],
            ['CC_003', 'community_chest', 'Pair Programming', 'Move forward 2 spaces.', 'move_forward', 2, null],
            ['CC_004', 'community_chest', 'Release Day', 'Move to GO and collect credits.', 'move_to_go', null, null],
        ];

        foreach ($cards as [$code, $type, $title, $description, $effectType, $effectValue, $targetTile]) {
            Card::updateOrCreate(
                ['card_code' => $code],
                [
                    'card_type' => $type,
                    'title' => $title,
                    'description' => $description,
                    'effect_type' => $effectType,
                    'effect_value' => $effectValue,
                    'target_tile_number' => $targetTile,
                    'is_active' => true,
                ]
            );
        }
    }
}

