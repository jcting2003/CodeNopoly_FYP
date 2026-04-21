<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up():void
    {
        Schema::create('game_properties', function (Blueprint $table) {
            $table->foreignId('game_id')->constrained('games')->onDelete('cascade');
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->foreignId('owner_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('houses')->default(0);
            $table->boolean('has_hotel')->default(false);
            $table->timestamp('purchased_at')->nullable();
            $table->timestamps();

            $table->unique(['game_id', 'property_id']);
        });
    }

    public function down():void
    {
        Schema::dropIfExists('game_properties');
    }
};
