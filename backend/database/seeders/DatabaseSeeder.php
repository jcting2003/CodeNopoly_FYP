<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (file_exists(base_path('../codenopoly.sql'))) {
            $this->call(SqlSnapshotSeeder::class);
            return;
        }

        $this->call(BoardSeeder::class);

        if (app()->environment('local', 'testing')) {
            $this->call(AdminUserSeeder::class);
        }
    }
}
