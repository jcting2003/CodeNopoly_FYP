<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up():void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tile_id')->constrained('tiles')->onDelete('cascade');
            $table->string('property_name');
            $table->integer('cost');
            $table->integer('house_cost')->default(0);
            $table->integer('hotel_cost')->default(0);
            $table->integer('rent')->default(0);
            $table->integer('rent_1_house')->default(0);
            $table->integer('rent_2_houses')->default(0);
            $table->integer('rent_3_houses')->default(0);
            $table->integer('rent_4_houses')->default(0);
            $table->integer('rent_hotel')->default(0);
            $table->string('color_group')->nullable();
        });
    }


    public function down():void
    {
        Schema::dropIfExists('properties');
    }
};
