<?php

namespace Marvel\Console;

use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Marvel\Database\Models\Settings;

class SettingsDataImporter extends Command
{
    private array $appData;
    protected $signature = 'marvel:settings_seed';

    protected $description = 'Import Settings Data';

    public function handle()
    {
        $shouldGetLicenseKeyFromUser = $this->shouldGetLicenseKey();
        if ($shouldGetLicenseKeyFromUser) {
            $this->getLicenseKey();
            $customerName = $this->appData['body']['customer'] ?? '';
            $this->components->info("Thank you {$customerName} for using " . APP_NOTICE_DOMAIN);
        } else {
            $config = getConfig();
            $this->appData['last_checking_time'] = $config['last_checking_time'] ?? Carbon::now();
            $this->appData['trust'] = $config['trust'] ?? true;
        }
        if (DB::table('settings')->where('id', 1)->exists()) {

            if ($this->confirm('Already data exists. Do you want to refresh it with dummy settings?')) {

                $this->info('Seeding necessary settings....');

                DB::table('settings')->truncate();

                $this->info('Importing dummy settings...');

                $this->call('db:seed', [
                    '--class' => '\\Marvel\\Database\\Seeders\\SettingsSeeder'
                ]);

                $this->modifySettingsData();
                $this->info('Settings were imported successfully');
            } else {
                $this->info('Previous settings was kept. Thanks!');
            }
        }
    }

    private function getLicenseKey($count = 0)
    {
        if ($count < 1) {
            $licenseKey = $this->ask('Please Enter Your License Key...');
        } else {
            $licenseKey = $this->ask('Please Enter a valid License Key...');
        }
        $isValid = $this->licenseKeyValidator($licenseKey);
        if (!$isValid) {
            ++$count;
            $this->components->error("Invalid Licensing Key");
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

        Cache::flush();
        $settings = Settings::getData();
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
