<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Marvel\Database\Models\User;
use Illuminate\Support\Facades\Hash;
use Marvel\Enums\Permission as UserPermission;
use Illuminate\Support\Facades\Validator;
use Marvel\Enums\Role as UserRole;




class AdminCreateCommand extends Command
{
    protected $signature = 'marvel:create-admin';

    protected $description = 'Create an admin user.';
    public function handle()
    {
        try {

            if ($this->confirm('Do you want to create an admin?')) {

                $this->info('Provide admin credentials info to create an admin user for you.');
                $name = $this->ask('Enter admin name');
                $email = $this->ask('Enter admin email');
                $password = $this->secret('Enter your admin password');
                $confirmPassword = $this->secret('Enter your password again');

                $this->info('Please wait, Creating an admin profile for you...');
                $validator = Validator::make(
                    [
                        'name' =>  $name,
                        'email' =>  $email,
                        'password' =>  $password,
                        'confirmPassword' =>  $confirmPassword,
                    ],
                    [
                        'name'     => 'required|string',
                        'email'    => 'required|email|unique:users,email',
                        'password' => 'required',
                        'confirmPassword' => 'required|same:password',
                    ]
                );
                if ($validator->fails()) {
                    $this->info('User not created. See error messages below:');
                    foreach ($validator->errors()->all() as $error) {
                        $this->error($error);
                    }
                    return;
                }
                $user = User::create([
                    'name' =>  $name,
                    'email' =>  $email,
                    'password' =>  Hash::make($password),
                ]);
                $user->email_verified_at = now()->timestamp;
                $user->save();
                $user->givePermissionTo(
                    [
                        UserPermission::SUPER_ADMIN,
                        UserPermission::STORE_OWNER,
                        UserPermission::CUSTOMER,
                    ]
                );
                $user->assignRole(UserRole::SUPER_ADMIN);

                $this->info('User Creation Successful!');
            }
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }
}
