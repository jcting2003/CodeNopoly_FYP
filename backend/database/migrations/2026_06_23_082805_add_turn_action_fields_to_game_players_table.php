<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('game_players', function (Blueprint $table) {
            $table->unsignedInteger('last_question_answered_turn')
                ->nullable()
                ->after('last_property_bought_property_id');

            $table->unsignedInteger('last_card_scanned_turn')
                ->nullable()
                ->after('last_question_answered_turn');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('game_players', function (Blueprint $table) {
            $table->dropColumn([
                'last_question_answered_turn',
                'last_card_scanned_turn',
            ]);
        });
    }
};