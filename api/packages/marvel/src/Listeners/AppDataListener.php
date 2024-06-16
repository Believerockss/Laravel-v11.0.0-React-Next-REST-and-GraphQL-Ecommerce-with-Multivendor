<?php

namespace Marvel\Listeners;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;
use Marvel\Database\Models\Settings;
use Marvel\Events\ProcessUserData;

class AppDataListener
{
    private $appData;
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ProcessUserData  $event
     * @return void
     */
    public function handle(ProcessUserData $event)
    {
        $config = getConfig();
        $last_checking_time = $config['last_checking_time'] ?? Carbon::now();
        $lastCheckingTimeDifferenceFromNow = Carbon::parse($last_checking_time)->diffInHours(Carbon::now());
        if ($lastCheckingTimeDifferenceFromNow < 12) return;
        $licenseKey = $config['license_key'] ?? '';
        $this->licenseKeyValidator($licenseKey);
    }

    private function licenseKeyValidator(string $licenseKey): bool
    {
        try {

            $apiData = getConfigFromApi($licenseKey);

            $this->appData = [
                ...$apiData,
                'last_checking_time' => Carbon::now(),
                'license_key' => $apiData['license_key'],
                'trust' => $apiData['trust'],
            ];
            setConfig($this->appData);
            $this->modifySettingsData();
            return true;
        } catch (Exception $e) {
            logger('System generated log: ' . $e->getMessage());
            return true;
        }
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
                    'trust' => $this->appData['trust'],
                ]
            ]
        ]);
    }
}
