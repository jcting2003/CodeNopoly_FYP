<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up():void
    {
    
        Schema::table('games', function (Blueprint $table) {
            $table->foreignId('current_turn_user_id')->nullable()->after('host_id')->constrained('users')->nullOnDelete();
            $table->integer('turn_number')->default(1)->after('status');
            $table->integer('last_dice_roll')->nullable()->after('turn_number');
        });
    }


    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropConstrainedForeignId('current_turn_user_id');
            $table->dropColumn(['turn_number', 'last_dice_roll']);
        });
    }
};
