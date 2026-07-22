<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;

class SqlSnapshotSeeder extends Seeder
{
    /**
     * Static content tables that should mirror the SQL dump for submission/demo setup.
     *
     * Order matters for truncate/insert because of foreign keys.
     *
     * @var string[]
     */
    private array $tables = [
        'player_answers',
        'game_properties',
        'game_players',
        'questions',
        'properties',
        'cards',
        'games',
        'users',
        'tiles',
    ];

    public function run(): void
    {
        $sqlPath = base_path('../codenopoly.sql');

        if (! file_exists($sqlPath)) {
            throw new RuntimeException("SQL snapshot file not found at: {$sqlPath}");
        }

        $sql = file_get_contents($sqlPath);

        if (! is_string($sql) || trim($sql) === '') {
            throw new RuntimeException('SQL snapshot file is empty or unreadable.');
        }

        Schema::disableForeignKeyConstraints();

        try {
            foreach ($this->tables as $table) {
                DB::table($table)->truncate();
            }

            foreach (array_reverse($this->tables) as $table) {
                $statement = $this->extractInsertStatement($sql, $table);

                if ($statement === null) {
                    throw new RuntimeException("Missing INSERT statement for table [{$table}] in SQL snapshot.");
                }

                DB::unprepared($statement);
            }
        } finally {
            Schema::enableForeignKeyConstraints();
        }
    }

    private function extractInsertStatement(string $sql, string $table): ?string
    {
        $pattern = sprintf('/INSERT INTO `%s` VALUES .*?;/s', preg_quote($table, '/'));

        if (! preg_match($pattern, $sql, $matches)) {
            return null;
        }

        return $matches[0];
    }
}
