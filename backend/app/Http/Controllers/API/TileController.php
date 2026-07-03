<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tile;

class TileController extends Controller
{
    public function index()
    {
        return response()->json([
            'tiles' => Tile::orderBy('tile_number')
                ->get()
                ->map(fn (Tile $tile) => $this->formatTile($tile))
                ->values(),
        ]);
    }

    public function showByNumber(int $tileNumber)
    {
        $tile = Tile::where('tile_number', $tileNumber)->first();

        if (! $tile) {
            return response()->json([
                'message' => 'Tile not found',
            ], 404);
        }

        return response()->json([
            'tile' => $this->formatTile($tile),
        ]);
    }

    protected function formatTile(Tile $tile): array
    {
        return [
            'id' => $tile->id,
            'tile_number' => $tile->tile_number,
            'tile_name' => $tile->tile_name,
            'nfc_value' => $tile->nfc_value,
            'tile_type' => $tile->tile_type,
            'difficulty' => $tile->difficulty,
        ];
    }
}
