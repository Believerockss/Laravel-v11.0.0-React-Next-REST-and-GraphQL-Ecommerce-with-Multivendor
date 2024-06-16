<?php

namespace Marvel\Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class RefundPolicySeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('refund_policies')->insert([
            [
                "title" => "Vendor Return Policy",
                "slug" => "vendor-return-policy",
                "description" => "Our vendor return policy ensures that you can return products within 30 days of purchase if they are damaged or not as described.",
                "target" => "vendor",
                "language" => "en",
                "status" => "approved",
                "shop_id" => 1,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "title" => "Customer Return Policy",
                "slug" => "customer-return-policy",
                "description" => "Our customer return policy allows you to return products within 14 days of purchase for a full refund, no questions asked.",
                "target" => "customer",
                "language" => "en",
                "status" => "approved",
                "shop_id" => 2,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "title" => "Electronics Return Policy",
                "slug" => "electronics-return-policy",
                "description" => "For electronics, our return policy extends to 60 days. We stand by the quality of our electronic products.",
                "target" => "customer",
                "language" => "en",
                "status" => "approved",
                "shop_id" => 3,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "title" => "Furniture Return Policy",
                "slug" => "furniture-return-policy",
                "description" => "Our furniture return policy allows you to return furniture within 7 days if it doesn't meet your expectations. Customer satisfaction is our priority.",
                "target" => "customer",
                "language" => "en",
                "status" => "approved",
                "shop_id" => 4,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "title" => "Custom Orders Policy",
                "slug" => "custom-orders-policy",
                "description" => "Please note that custom orders are not eligible for returns or refunds. We craft custom items to your specifications.",
                "target" => "customer",
                "language" => "en",
                "status" => "approved",
                "shop_id" => 5,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
        ]);
    }
}
