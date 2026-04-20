<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up():void
    {
        Schema::create('game_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained('games')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('credits')->default(100);
            $table->integer('total_credits')->default(100);
            $table->timestamp('joined_at')->nullable();
            $table->timestamps();

            $table->unique(['game_id', 'user_id']);
        });
    }

    public function down():void
    {
        Schema::dropIfExists('game_players');
    }
};
