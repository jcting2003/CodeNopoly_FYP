<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up():void
    {
        Schema::create('player_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained('games')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            $table->string('selected_answer');
            $table->boolean('is_correct');
            $table->integer('earned_credits')->default(0);
            $table->timestamp('answered_at')->nullable();
            $table->timestamps();
        });
    }


    public function down():void
    {
        Schema::dropIfExists('player_answers');
    }
};
