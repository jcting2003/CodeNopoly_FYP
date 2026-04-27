<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('game_players', function (Blueprint $table) {
            $table->unsignedBigInteger('last_property_bought_turn')->nullable()->after('last_house_bought_property_id');
            $table->unsignedBigInteger('last_property_bought_property_id')->nullable()->after('last_property_bought_turn');
        });
    }

    public function down(): void
    {
        Schema::table('game_players', function (Blueprint $table) {
            $table->dropColumn([
                'last_property_bought_turn',
                'last_property_bought_property_id',
            ]);
        });
    }
};