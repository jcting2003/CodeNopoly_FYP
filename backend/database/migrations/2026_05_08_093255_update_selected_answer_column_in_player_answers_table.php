<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('player_answers', function (Blueprint $table) {
            $table->text('selected_answer')->change();
            $table->text('feedback')->nullable()->after('earned_credits');
        });
    }

    public function down(): void
    {
        Schema::table('player_answers', function (Blueprint $table) {
            $table->string('selected_answer')->change();
            $table->dropColumn('feedback');
        });
    }
};
