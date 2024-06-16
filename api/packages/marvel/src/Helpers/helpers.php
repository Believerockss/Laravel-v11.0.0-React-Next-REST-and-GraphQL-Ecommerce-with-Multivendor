<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Marvel\Database\Models\User;
use Marvel\Enums\Permission;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

if (!function_exists('gateway_path')) {
    /**
     * Get the path to the base of the install.
     *
     * @param  string  $path
     * @return string
     */
    function gateway_path($path = '')
    {
        return __DIR__ . '/';
    }

    if (!function_exists('globalSlugify')) {

        /**
         * It takes a string, a model,  a key, and a divider, and returns a slugified string with a number
         * appended to it if the slug already exists in the database.
         * 
         * Here's a more detailed explanation:
         * 
         * The function takes three parameters:
         * 
         * - ``: The string to be slugified.
         * - ``: The model to check against. Model must pass as Product::class
         * - ``: The key to check The column name of the slug in the database.
         * - ``: The divider to use between the slug and the number.
         * 
         * The function first slugifies the string and then checks the database to see if the slug
         * already exists. If it doesn't, it returns the slug. If it does, it returns the slug with a
         * number appended to it.
         * 
         * Here's an example of how to use the function:
         * 
         * @param string slugText The text you want to slugify
         * @param string model The model you want to check against.
         * @param string key The column name of the slug in the database.
         * @param string divider The divider to use when appending the slug count to the slug.
         * 
         * @return string slug is being returned.
         */
        function globalSlugify(string $slugText, string $model, string $key = '', string $divider = '-', ?int $update = null): string
        {
            try {
                if ($update) {
                    $query = $model::where('id', '!=', $update);
                } else {
                    $query = $model::query();
                }
                $cleanString      = preg_replace("/[~`{}.'\"\!\@\#\$\%\^\&\*\(\)\_\=\+\/\?\>\<\,\[\]\:\;\|\\\]/", "", $slugText);
                $cleanString = preg_replace("/[\/_|+ -]+/", '-', $slugText);
                $slug = strtolower($cleanString);
                if ($key) {
                    $slugCount = $query->where($key, $slug)->count();
                } else {
                    $slugCount = $query->where('slug', $slug)->count();
                }
                $randomString = Str::random(3);

                if (empty($slugCount)) {
                    $slug = is_numeric($slug) ? "{$slug}{$divider}{$randomString}" : $slug;
                    return $slug;
                }
                return "{$slug}{$divider}{$randomString}";
            } catch (\Throwable $th) {
                throw $th;
            }
        }
    }

    if (!function_exists('server_environment_info')) {
        function server_environment_info()
        {
            return [
                "upload_max_filesize" => parseAttachmentUploadSize(ini_get('upload_max_filesize')) / 1024,
                "memory_limit" => ini_get('memory_limit'),
                "max_execution_time" => ini_get('max_execution_time'),
                "max_input_time" => ini_get('max_input_time'),
                "post_max_size" => parseAttachmentUploadSize(ini_get('post_max_size')) / 1024,
            ];
        }
    }

    if (!function_exists('parseAttachmentUploadSize')) {
        function parseAttachmentUploadSize($size)
        {
            $unit = preg_replace('/[^bkmgtpezy]/i', '', $size); // Remove the non-unit characters from the size.
            $size = preg_replace('/[^0-9\.]/', '', $size); // Remove the non-numeric characters from the size.
            if ($unit) {
                // Find the position of the unit in the ordered string which is the power of magnitude to multiply a kilobyte by.
                return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
            } else {
                return round($size);
            }
        }
    }

    if (!function_exists('formatAPIResourcePaginate')) {
        function formatAPIResourcePaginate($data)
        {
            return response()->json([
                "data"           => $data['data'] ?? [],
                "current_page"   => $data['meta']['current_page'] ?? 0,
                "from"           => $data['meta']['from'] ?? 0,
                "to"             => $data['meta']['to'] ?? 0,
                "last_page"      => $data['meta']['last_page'] ?? 0,
                "path"           => $data['meta']['path'] ?? "",
                "per_page"       => $data['meta']['per_page'] ?? 0,
                "total"          => $data['meta']['total'] ?? 0,
                "next_page_url"  => $data['links']['next'] ?? "",
                "prev_page_url"  => $data['links']['prev'] ?? "",
                "last_page_url"  => $data['links']['last'] ?? "",
                "first_page_url" => $data['links']['first'] ?? "",
            ]);
        }
    }
    if (!function_exists('formatLicenseAPIResourcePaginate')) {
        function formatLicenseAPIResourcePaginate($data)
        {
            return [
                "data"           => $data['data'] ?? [],
                "current_page"   => $data['meta']['current_page'] ?? 0,
                "from"           => $data['meta']['from'] ?? 0,
                "to"             => $data['meta']['to'] ?? 0,
                "last_page"      => $data['meta']['last_page'] ?? 0,
                "path"           => $data['meta']['path'] ?? "",
                "per_page"       => $data['meta']['per_page'] ?? 0,
                "total"          => $data['meta']['total'] ?? 0,
                "next_page_url"  => $data['links']['next'] ?? "",
                "prev_page_url"  => $data['links']['prev'] ?? "",
                "last_page_url"  => $data['links']['last'] ?? "",
                "first_page_url" => $data['links']['first'] ?? "",
            ];
        }
    }
    if (!function_exists("Role")) {

        function Role(User $user): string
        {
            if ($user->hasPermissionTo(Permission::SUPER_ADMIN)) {
                return Permission::SUPER_ADMIN;
            } else if ($user->hasPermissionTo(Permission::STORE_OWNER) && !$user->hasPermissionTo(Permission::SUPER_ADMIN)) {
                return Permission::STORE_OWNER;
            } else if ($user->hasPermissionTo(Permission::STAFF)) {
                return Permission::STAFF;
            } else {
                return Permission::CUSTOMER;
            }
        }
    }



    if (!function_exists("setConfig")) {
        function setConfig($config)
        {
            try {
                if (empty(env('APP_KEY'))) {
                    Artisan::call('key:generate');
                }
                $json_data = json_encode($config, JSON_PRETTY_PRINT);
                $encryptedData = Crypt::encrypt($json_data);
                $file_path = storage_path('app/shop/shop.config.json');
                file_put_contents($file_path, $encryptedData);
            } catch (Exception $e) {
            }
        }
    }
    if (!function_exists("getConfig")) {
        function getConfig(): array | bool
        {
            try {
                $folderPath =  storage_path('app/shop/');
                if (!File::exists($folderPath)) {
                    File::makeDirectory($folderPath, 0777, true, true);
                }
                $fileName = $folderPath . "shop.config.json";
                if (file_exists($fileName)) {
                    $json_data = file_get_contents($fileName);
                    $data = Crypt::decrypt($json_data);
                    $json_data_to_array = json_decode($data, true);
                    return $json_data_to_array;
                }
                return false;
            } catch (Exception $e) {
                return false;
            }
        }
    }
    if (!function_exists("getConfigFromApi")) {

        function getConfigFromApi(string $code)
        {
            $url = "https://customer.redq.io/api/sale/verify";

            $code = trim($code);

            if (!preg_match("/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i", $code)) {
                return false;
            }
            $response = Http::post($url, [
                "k" => $code,
                "i" => 31475730,
                "n" => "Pickbazar- Laravel Multivendor Ecommerce with React, Next Js, GraphQL & REST API",
                "v" => config('shop.version'),
                "u" => url('/'),
            ]);

            $responseBody = $response->json(); // converted response to array

            $is_validated = isset($responseBody['isValid']) ? $responseBody['isValid']      : false;
            $domains      = isset($responseBody['domains']) ? $responseBody['domains']      : [];
            $body         = !empty($responseBody) && is_array($responseBody) ? $responseBody : [];
            return [
                ...$body,
                'license_key' => $code,
                'trust'       => $is_validated,
                'domains'     => $domains,
                'status'      => $response->status()
            ];
        }


        // function getConfigFromApi(string $code)
        // {
        //     $url = "https://rnb.redq.io/wp-json/redqteam/v1/elv";

        //     $code = trim($code);

        //     if (!preg_match("/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i", $code)) {
        //         return false;
        //     }
        //     $response = Http::get($url, [
        //         'item_id'       => config('shop.marvel_id'),
        //         'purchase_code' => $code,
        //         'site_url'      => url('/'),
        //         'runtime'       => 'yes',
        //     ]);

        //     $responseBody = $response->json(); // converted response to array

        //     $purchase_count = isset($responseBody['purchase_count']) ? $responseBody['purchase_count'] : null;
        //     $response_license_key = isset($responseBody['license_key']) ? $responseBody['license_key'] : null;
        //     $item = isset($responseBody['item']) ? $responseBody['item'] : null;
        //     $is_validated = ($item == 'valid' || $purchase_count == 1 || $response_license_key == $code);
        //     return [
        //         'license_key' => $responseBody['license_key'] ?? $code,
        //         'trust' => $is_validated,
        //         'body'   => $responseBody,
        //         'status' => $response->status()
        //     ];
        // }
    }
}
