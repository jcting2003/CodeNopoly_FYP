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
            [1, 'Variables Valley', 'NFC_TILE_01', 'question', 'mixed'],
            [2, 'Community Chest', 'NFC_TILE_02', 'community_chest', null],
            [3, 'Syntax Street', 'NFC_TILE_03', 'question', 'mixed'],
            [4, 'Income Tax', 'SPECIAL_TILE_04', 'tax', null],
            [5, 'Debugging Depot', 'NFC_TILE_05', 'question', 'mixed'],
            [6, 'Print Path', 'NFC_TILE_06', 'question', 'mixed'],
            [7, 'Chance', 'NFC_TILE_07', 'chance', null],
            [8, 'Input Avenue', 'NFC_TILE_08', 'question', 'mixed'],
            [9, 'Data Type District', 'NFC_TILE_09', 'question', 'mixed'],
            [10, 'Jail / Visiting', 'SPECIAL_TILE_10', 'jail', null],
            [11, 'Condition Corner', 'NFC_TILE_11', 'question', 'mixed'],
            [12, 'Function Flow Utility', 'NFC_TILE_12', 'question', 'mixed'],
            [13, 'Loop Lane', 'NFC_TILE_13', 'question', 'mixed'],
            [14, 'Range Road', 'NFC_TILE_14', 'question', 'mixed'],
            [15, 'Logic Line', 'NFC_TILE_15', 'question', 'mixed'],
            [16, 'List Lake', 'NFC_TILE_16', 'question', 'mixed'],
            [17, 'Community Chest', 'NFC_TILE_17', 'community_chest', null],
            [18, 'Tuple Town', 'NFC_TILE_18', 'question', 'mixed'],
            [19, 'Dictionary Dock', 'NFC_TILE_19', 'question', 'mixed'],
            [20, 'Free Parking', 'NFC_TILE_20', 'free_parking', null],
            [21, 'Set Station', 'NFC_TILE_21', 'question', 'mixed'],
            [22, 'Chance', 'NFC_TILE_22', 'chance', null],
            [23, 'String Square', 'NFC_TILE_23', 'question', 'mixed'],
            [24, 'Slice Street', 'NFC_TILE_24', 'question', 'mixed'],
            [25, 'Runtime Rail', 'NFC_TILE_25', 'question', 'mixed'],
            [26, 'Function Forest', 'NFC_TILE_26', 'question', 'mixed'],
            [27, 'Parameter Plaza', 'NFC_TILE_27', 'question', 'mixed'],
            [28, 'Water Works Utility', 'NFC_TILE_28', 'question', 'mixed'],
            [29, 'Return Route', 'NFC_TILE_29', 'question', 'mixed'],
            [30, 'Go To Jail', 'SPECIAL_TILE_30', 'go_to_jail', null],
            [31, 'Module Mountain', 'NFC_TILE_31', 'question', 'mixed'],
            [32, 'Exception Estate', 'NFC_TILE_32', 'question', 'mixed'],
            [33, 'Community Chest', 'NFC_TILE_33', 'community_chest', null],
            [34, 'File Handling Harbor', 'NFC_TILE_34', 'question', 'mixed'],
            [35, 'Compiler Crossing', 'NFC_TILE_35', 'question', 'mixed'],
            [36, 'Chance', 'NFC_TILE_36', 'chance', null],
            [37, 'Class City', 'NFC_TILE_37', 'question', 'mixed'],
            [38, 'Luxury Tax', 'SPECIAL_TILE_38', 'tax', null],
            [39, 'Inheritance Heights', 'NFC_TILE_39', 'question', 'mixed'],
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
            [5, 200, 0, 0, 25, 'railroad'],
            [6, 100, 50, 50, 6, 'light_blue'],
            [8, 100, 50, 50, 6, 'light_blue'],
            [9, 120, 50, 50, 8, 'light_blue'],
            [11, 140, 100, 100, 10, 'pink'],
            [12, 150, 0, 0, 0, 'utility'],
            [13, 140, 100, 100, 10, 'pink'],
            [14, 160, 100, 100, 12, 'pink'],
            [15, 200, 0, 0, 25, 'railroad'],
            [16, 180, 100, 100, 14, 'orange'],
            [18, 180, 100, 100, 14, 'orange'],
            [19, 200, 100, 100, 16, 'orange'],
            [21, 220, 150, 150, 18, 'red'],
            [23, 220, 150, 150, 18, 'red'],
            [24, 240, 150, 150, 20, 'red'],
            [25, 200, 0, 0, 25, 'railroad'],
            [26, 260, 150, 150, 22, 'yellow'],
            [27, 260, 150, 150, 22, 'yellow'],
            [28, 150, 0, 0, 0, 'utility'],
            [29, 280, 150, 150, 24, 'yellow'],
            [31, 300, 200, 200, 26, 'green'],
            [32, 300, 200, 200, 26, 'green'],
            [34, 320, 200, 200, 28, 'green'],
            [35, 200, 0, 0, 25, 'railroad'],
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
                    'rent_1_house' => match ($tileNumber) {
                        1 => 10,
                        3 => 20,
                        6, 8 => 30,
                        9 => 40,
                        11, 13 => 50,
                        14 => 60,
                        16, 18 => 70,
                        19 => 80,
                        21, 23 => 90,
                        24 => 100,
                        26, 27 => 110,
                        29 => 120,
                        31, 32 => 130,
                        34 => 150,
                        37 => 175,
                        39 => 200,
                        default => 50,
                    },
                    'rent_2_houses' => match ($tileNumber) {
                        1 => 30,
                        3 => 60,
                        6, 8 => 90,
                        9 => 100,
                        11, 13 => 150,
                        14 => 180,
                        16, 18 => 200,
                        19 => 220,
                        21, 23 => 250,
                        24 => 300,
                        26, 27 => 330,
                        29 => 360,
                        31, 32 => 390,
                        34 => 450,
                        37 => 500,
                        39 => 600,
                        default => 100,
                    },
                    'rent_3_houses' => match ($tileNumber) {
                        1 => 90,
                        3 => 180,
                        6, 8 => 270,
                        9 => 300,
                        11, 13 => 450,
                        14 => 500,
                        16, 18 => 550,
                        19 => 600,
                        21, 23 => 700,
                        24 => 750,
                        26, 27 => 800,
                        29 => 850,
                        31, 32 => 900,
                        34 => 1000,
                        37 => 1100,
                        39 => 1400,
                        default => 200,
                    },
                    'rent_4_houses' => match ($tileNumber) {
                        1 => 160,
                        3 => 320,
                        6, 8 => 400,
                        9 => 450,
                        11, 13 => 625,
                        14 => 700,
                        16, 18 => 750,
                        19 => 800,
                        21, 23 => 875,
                        24 => 925,
                        26, 27 => 975,
                        29 => 1025,
                        31, 32 => 1100,
                        34 => 1200,
                        37 => 1300,
                        39 => 1700,
                        default => 200,
                    },
                    'rent_hotel' => match ($tileNumber) {
                        1 => 250,
                        3 => 450,
                        6, 8 => 550,
                        9 => 600,
                        11, 13 => 750,
                        14 => 900,
                        16, 18 => 950,
                        19 => 1000,
                        21, 23 => 1050,
                        24 => 1100,
                        26, 27 => 1150,
                        29 => 1200,
                        31, 32 => 1275,
                        34 => 1400,
                        37 => 1500,
                        39 => 2000,
                        default => 0,
                    },
                    'color_group' => $group,
                ]
            );
        }

        $cards = [
            ['CC_001', 'community_chest', 'Debugging Help', 'Gain 40 credits.', 'credits_add', 40, null],
            ['CC_002', 'community_chest', 'Peer Support Session', 'Gain 30 credits.', 'credits_add', 30, null],
            ['CC_003', 'community_chest', 'Completed Practice Quiz', 'Gain 50 credits.', 'credits_add', 50, null],
            ['CC_004', 'community_chest', 'Code Review Bonus', 'Gain 60 credits.', 'credits_add', 60, null],
            ['CC_005', 'community_chest', 'Refactored Your Code Successfully', 'Gain 40 credits.', 'credits_add', 40, null],
            ['CC_006', 'community_chest', 'Syntax Mistake Found Early', 'Gain 20 credits.', 'credits_add', 20, null],
            ['CC_007', 'community_chest', 'Asked Lecturer for Help', 'Gain 30 credits.', 'credits_add', 30, null],
            ['CC_008', 'community_chest', 'Version Backup Saved You', 'Gain 50 credits.', 'credits_add', 50, null],
            ['CC_009', 'community_chest', 'Extra Lab Participation', 'Gain 40 credits.', 'credits_add', 40, null],
            ['CC_010', 'community_chest', 'Library Study Session', 'Gain 30 credits.', 'credits_add', 30, null],
            ['CC_011', 'community_chest', 'Late Submission Penalty', 'Lose 20 credits.', 'credits_deduct', 20, null],
            ['CC_012', 'community_chest', "Forgot Semicolon... Wait, Python Doesn't Need It", 'Gain 20 credits.', 'credits_add', 20, null],
            ['CC_013', 'community_chest', 'Internet Connection Issue During Practice', 'Lose 30 credits.', 'credits_deduct', 30, null],
            ['CC_014', 'community_chest', 'Keyboard Shortcut Mastery', 'Gain 25 credits.', 'credits_add', 25, null],
            ['CC_015', 'community_chest', 'Memory Leak Avoided', 'Gain 40 credits.', 'credits_add', 40, null],
            ['CH_001', 'chance', 'Advance to Go', 'Move to GO and collect reward.', 'move_to_go', null, 0],
            ['CH_002', 'chance', 'Advance to Nearest Railroad', 'Move to the nearest railroad.', 'move_to_tile', null, 5],
            ['CH_003', 'chance', 'Advance to Nearest Utility', 'Move to the nearest utility.', 'move_to_tile', null, 12],
            ['CH_004', 'chance', 'Jump to Class City', 'Move to Class City.', 'move_to_tile', null, 37],
            ['CH_005', 'chance', 'Jump to Variables Valley', 'Move to Variables Valley.', 'move_to_tile', null, 1],
            ['CH_006', 'chance', 'Jump to Debugging Depot', 'Move to Debugging Depot.', 'move_to_tile', null, 5],
            ['CH_007', 'chance', 'Unexpected Bug Appears', 'Lose 50 credits.', 'credits_deduct', 50, null],
            ['CH_008', 'chance', 'Runtime Error', 'Lose 40 credits.', 'credits_deduct', 40, null],
            ['CH_009', 'chance', 'Found a Hidden Optimization', 'Gain 80 credits.', 'credits_add', 80, null],
            ['CH_010', 'chance', 'Hackathon Bonus', 'Gain 100 credits.', 'credits_add', 100, null],
            ['CH_011', 'chance', 'Laptop Battery Died', 'Lose 60 credits.', 'credits_deduct', 60, null],
            ['CH_012', 'chance', 'Code Compiled on First Try', 'Gain 70 credits.', 'credits_add', 70, null],
            ['CH_013', 'chance', 'Infinite Loop Trap', 'Move back 3 spaces.', 'move_backward', 3, null],
            ['CH_014', 'chance', 'Exam Week Stress', 'Lose 40 credits.', 'credits_deduct', 40, null],
            ['CH_015', 'chance', 'Open Source Contribution Accepted', 'Gain 90 credits.', 'credits_add', 90, null],
            ['CH_016', 'chance', 'Corrupted File', 'Lose 50 credits.', 'credits_deduct', 50, null],
            ['CH_017', 'chance', 'Lucky Stack Overflow Search', 'Gain 60 credits.', 'credits_add', 60, null],
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

