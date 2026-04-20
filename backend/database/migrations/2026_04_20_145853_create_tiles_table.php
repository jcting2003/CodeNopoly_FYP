<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up():void
    {
        Schema::create('tiles', function (Blueprint $table) {
            $table->id();
            $table->integer('tile_number')->unique();
            $table->string('tile_name');
            $table->string('nfc_value')->unique();
            $table->string('tile_type')->default('question');
            $table->string('difficulty')->nullable();
            $table->timestamps();
        });
    }

    public function down():void
    {
        Schema::dropIfExists('tiles');
    }
};
