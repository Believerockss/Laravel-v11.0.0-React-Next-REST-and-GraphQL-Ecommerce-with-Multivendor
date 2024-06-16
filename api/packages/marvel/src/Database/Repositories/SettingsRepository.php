<?php


namespace Marvel\Database\Repositories;

use Carbon\Carbon;
use Exception;
use Marvel\Database\Models\Settings;

class SettingsRepository extends BaseRepository
{
    /**
     * Configure the Model
     **/
    public function model()
    {
        return Settings::class;
    }

    public function getApplicationSettings(): array
    {
        $config = getConfig();

        $appData = $this->getAppSettingsData($config['license_key']);

        return [
            'app_settings' => $appData,
        ];
    }

    private function getAppSettingsData(string $licenseKey): array
    {
        try {
            $config = getConfig();
            $apiData = $config;
            $last_checking_time = $config['last_checking_time'] ?? Carbon::now();
            $lastCheckingTimeDifferenceFromNow = Carbon::parse($last_checking_time)->diffInMinutes(Carbon::now());
            
            if ($lastCheckingTimeDifferenceFromNow > 20) {
                $apiData = getConfigFromApi($licenseKey);
            };
            $isValidated = $apiData["trust"] ?? true;

            $appData = [
                ...$apiData,
                'last_checking_time' => Carbon::now(),
                'license_key' => $apiData['license_key'],
                'trust' => $apiData['trust'],
            ];
            setConfig($appData);
            return [
                'last_checking_time' => Carbon::now(),
                'trust' => $isValidated,
            ];
        } catch (Exception $e) {
        }
    }
}
