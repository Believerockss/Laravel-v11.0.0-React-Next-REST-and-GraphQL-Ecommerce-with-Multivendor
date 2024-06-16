<?php

namespace Marvel\Console;

use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Marvel\Database\Models\Settings;
use Spatie\Permission\Models\Permission;
use Marvel\Enums\Permission as UserPermission;
use Marvel\Enums\Role as UserRole;
use Spatie\Permission\Models\Role;
use Marvel\Database\Seeders\MarvelSeeder;
use PDO;
use PDOException;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Output\ConsoleOutput;

class InstallCommand extends Command
{
    private array $appData;
    protected $signature = 'marvel:install';

    protected $description = 'Installing Marvel Dependencies';

    public function handle()
    {
        $shouldGetLicenseKeyFromUser = $this->shouldGetLicenseKey();
        if ($shouldGetLicenseKeyFromUser) {
            $this->getLicenseKey();
            $description = $this->appData['description'] ?? '';
            $this->components->info("Thank you for using " . APP_NOTICE_DOMAIN. ". $description");
        } else {
            $config = getConfig();
            $this->appData['last_checking_time'] = $config['last_checking_time'] ?? Carbon::now();
            $this->appData['trust'] = $config['trust'] ?? true;
        }

        $this->info('Installing Marvel Dependencies...');
        if ($this->confirm('Do you want to migrate Tables? If you have already run this command or migrated tables then be aware, it will erase all of your data.')) {

            $this->info('Migrating Tables Now....');

            $this->call('migrate:fresh');

            $this->info('Tables Migration completed.');

            if ($this->confirm('Do you want to seed dummy data?')) {
                $this->call('marvel:seed');
                $this->call('db:seed', [
                    '--class' => MarvelSeeder::class
                ]);
            }

            $this->info('Importing required settings...');

            $this->call(
                'db:seed',
                [
                    '--class' => '\\Marvel\\Database\\Seeders\\SettingsSeeder',
                ]

            );

            $this->info('Settings import is completed.');
        } else {
            if ($this->confirm('Do you want to seed dummy Settings data? If "yes", then please follow next steps carefully.')) {
                $this->call('marvel:settings_seed');
            }
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::firstOrCreate(['name' => UserPermission::SUPER_ADMIN]);
        Permission::firstOrCreate(['name' => UserPermission::CUSTOMER]);
        Permission::firstOrCreate(['name' => UserPermission::STORE_OWNER]);
        Permission::firstOrCreate(['name' => UserPermission::STAFF]);

        $superAdminPermissions = [UserPermission::SUPER_ADMIN, UserPermission::STORE_OWNER, UserPermission::CUSTOMER];
        $storeOwnerPermissions = [UserPermission::STORE_OWNER, UserPermission::CUSTOMER];
        $staffPermissions = [UserPermission::STAFF, UserPermission::CUSTOMER];
        $customerPermissions = [UserPermission::CUSTOMER];

        Role::firstOrCreate(['name' => UserRole::SUPER_ADMIN])->syncPermissions($superAdminPermissions);
        Role::firstOrCreate(['name' => UserRole::STORE_OWNER])->syncPermissions($storeOwnerPermissions);
        Role::firstOrCreate(['name' => UserRole::STAFF])->syncPermissions($staffPermissions);
        Role::firstOrCreate(['name' => UserRole::CUSTOMER])->syncPermissions($customerPermissions);

        $this->call('marvel:create-admin'); // creating Admin

        $this->call('marvel:copy-files');

        $this->modifySettingsData();

        $this->info('Everything is successful. Now clearing all cached...');

        $this->call('optimize:clear');

        $this->info('Thank You.');
    }


    private function createDatabase(): void
    {
        $databaseName = config('database.connections.mysql.database');
        $servername = config('database.connections.mysql.host');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');

        try {
            $conn = new PDO("mysql:host=$servername", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Check if the database exists
            $query = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$databaseName'";
            $stmt = $conn->query($query);
            $databaseExists = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$databaseExists) {
                // Create the database
                $createDatabaseQuery = "CREATE DATABASE $databaseName";
                $conn->exec($createDatabaseQuery);
                $this->info("Database $databaseName created successfully.");
            }
            // else {
            //     $this->info("Database $databaseName already exists.");
            // }
        } catch (PDOException $e) {
            $this->info("Connection failed: " . $e->getMessage());
        }
    }

    private function getLicenseKey($count = 0)
    {
        $message = 'Please Enter a valid License Key! Please visit us at https://redq.io for a valid license key.';
        if ($count < 1) {
            $message = 'Please Enter Your License Key.';
        }
        $licenseKey = $this->ask($message);
        $isValid = $this->licenseKeyValidator($licenseKey);
        if (!$isValid) {
            ++$count;
            $description = $this->appData['description'] ?? '';
            $this->components->error("Invalid Licensing Key. $description");
            $this->getLicenseKey($count);
        }
        return $isValid;
    }

    private function licenseKeyValidator(string $licenseKey): bool
    {

        try {
            $apiData = getConfigFromApi($licenseKey);
            $isValidated = $apiData["trust"];
            $this->appData = [
                ...$apiData,
                'license_key'        => $apiData['license_key'],
                'trust'       => $apiData['trust'],
                'last_checking_time' => Carbon::now(),
            ];

            setConfig($this->appData);
            if (!$isValidated) {
                return false;
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }



    private function shouldGetLicenseKey()
    {
        $isFileExists = getConfig();

        $env = config("app.env");
        if ($env == "production") {
            return true;
        } elseif ($env == "local" && empty($isFileExists['trust'])) {
            return true;
        } elseif ($env == "development" && empty($isFileExists['trust'])) {
            return true;
        }
        return false;
    }

    private function modifySettingsData(): void
    {

        $language = isset(request()['language']) ? request()['language'] : DEFAULT_LANGUAGE;
        Cache::flush();
        $settings = Settings::getData($language);
        $settings->update([
            'options' => [
                ...$settings->options,
                'app_settings' => [
                    'last_checking_time' => $this->appData['last_checking_time'],
                    'trust'       => $this->appData['trust'],
                ]
            ]
        ]);
    }
}
