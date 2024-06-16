<?php

namespace Marvel\Traits;

use Illuminate\Support\Facades\Cache;
use Marvel\Enums\Permission;
use Marvel\Database\Models\User;

trait UsersTrait
{
    public function getAdminUsers()
    {
        $admins = '';
        if (Cache::has('cached_admin')) {
            $admins = Cache::get('cached_admin');
        } else {
            $admins = Cache::remember('cached_admin', 900, function () {
                return User::with('profile')
                    ->where('is_active', true)
                    ->whereHas('permissions', function ($query) {
                        $query->where('name', Permission::SUPER_ADMIN);
                    })->get();
            });
        }

        return $admins;
    }
}
