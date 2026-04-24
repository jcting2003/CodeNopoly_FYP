<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('game_players', function (Blueprint $table) {
            $table->unsignedBigInteger('last_rent_paid_turn')->nullable()->after('position');
            $table->unsignedBigInteger('last_rent_paid_property_id')->nullable()->after('last_rent_paid_turn');
        });
    }

    public function down(): void
    {
        Schema::table('game_players', function (Blueprint $table) {
            $table->dropColumn(['last_rent_paid_turn', 'last_rent_paid_property_id']);
        });
    }
};