<?php

namespace Marvel\Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;


class SettingsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // run your app seeder
        DB::table('settings')->insert([
            'options' => json_encode([
                "seo" => [
                    'ogImage' => null,
                    'ogTitle' => null,
                    'metaTags' => null,
                    'metaTitle' => null,
                    'canonicalUrl' => null,
                    'ogDescription' => null,
                    'twitterHandle' => null,
                    'metaDescription' => null,
                    'twitterCardType' => null
                ],
                "logo" => [
                    'thumbnail' => 'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/2295/conversions/Logo-new-thumbnail.jpg',
                    'original' => 'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/2295/Logo-new.png',
                    'id' => 2298,
                    'file_name' => 'Logo-new.png'
                ],
                "collapseLogo" => [
                    'thumbnail' => 'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/2283/conversions/Pickbazar-thumbnail.jpg',
                    'original' => 'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/2283/Pickbazar.png',
                    'id' => 2286,
                    'file_name' => 'Pickbazar.png'
                ],
                "useOtp" => false,
                "currency" => "USD",
                "taxClass" => "1",
                "siteTitle" => "Pickbazar",
                "deliveryTime" => [
                    [
                        "title" => "Express Delivery",
                        "description" => "90 min express delivery"
                    ],
                    [
                        "title" => "Morning",
                        "description" => "8.00 AM - 11.00 AM"
                    ],
                    [
                        "title" => "Noon",
                        "description" => "11.00 AM - 2.00 PM"
                    ],
                    [
                        "title" => "Afternoon",
                        "description" => "2.00 PM - 5.00 PM"
                    ],
                    [
                        "title" => "Evening",
                        "description" => "5.00 PM - 8.00 PM"
                    ]
                ],
                "freeShipping" => false,
                "signupPoints" => 100,
                "siteSubtitle" => "Your next ecommerce",
                "useGoogleMap" => false,
                "shippingClass" => "1",
                "contactDetails" => [
                    "contact" => "+129290122122",
                    "socials" => [
                        [
                            "url" => "https://www.facebook.com",
                            "icon" => "FacebookIcon"
                        ],
                        [
                            "url" => "https://twitter.com/home",
                            "icon" => "TwitterIcon"
                        ],
                        [
                            "url" => "https://www.instagram.com",
                            "icon" => "InstagramIcon"
                        ]
                    ],
                    "website" => "https://redq.io",
                    "emailAddress" => "demo@demo.com",
                    "location" => [
                        "lat" => 42.9585979,
                        "lng" => -76.9087202,
                        "zip" => null,
                        "city" => null,
                        "state" => "NY",
                        "country" => "United States",
                        "formattedAddress" => "NY State Thruway, New York, USA"
                    ]
                ],
                "paymentGateway" => [
                    [
                        "name" => "stripe",
                        "title" => "Stripe"
                    ]
                ],
                "currencyOptions" => [
                    "formation" => "en-US",
                    "fractions" => 2
                ],
                "isProductReview" => false,
                "useEnableGateway" => false,
                "useCashOnDelivery" => true,
                "freeShippingAmount" => 0,
                "minimumOrderAmount" => 0,
                "useMustVerifyEmail" => false,
                "maximumQuestionLimit" => 5,
                "currencyToWalletRatio" => 3,
                "defaultPaymentGateway" => "stripe",
                "StripeCardOnly" => false,
                "guestCheckout" => true,
                "server_info" => server_environment_info(),
                "useAi"         => false,
                "defaultAi" => "openai",
                "maxShopDistance" => 1000,
                "siteLink" =>  "https://pickbazar.redq.io",
                "copyrightText" =>  "Copyright © REDQ. All rights reserved worldwide.",
                "externalText" =>  "REDQ",
                "externalLink" =>  "https://redq.io",
                ...$this->getSmsEmailEvents(),
            ]),
            "language" => DEFAULT_LANGUAGE ?? "en",
            "created_at" => Carbon::now(),
            "updated_at" => Carbon::now(),
        ]);
    }

    /**
     * The function returns an array of SMS and email events with their corresponding recipients and
     * event types.
     *
     * @return array An array containing events for SMS and email notifications for different user
     * roles (admin, vendor, and customer) related to order status changes, refunds, payments, creating
     * questions, creating reviews, and answering questions.
     */
    private function getSmsEmailEvents(): array
    {
        return [
            "smsEvent" => [
                "admin" => [
                    "statusChangeOrder" => false,
                    "refundOrder" => false,
                    "paymentOrder" => false
                ],
                "vendor" => [
                    "statusChangeOrder" => false,
                    "paymentOrder" => false,
                    "refundOrder" => false
                ],
                "customer" => [
                    "statusChangeOrder" => false,
                    "refundOrder" => false,
                    "paymentOrder" => false
                ]
            ],
            "emailEvent" => [
                "admin" => [
                    "statusChangeOrder" => false,
                    "refundOrder" => false,
                    "paymentOrder" => false
                ],
                "vendor" => [
                    "createQuestion" => false,
                    "statusChangeOrder" => false,
                    "refundOrder" => false,
                    "paymentOrder" => false,
                    "createReview" => false
                ],
                "customer" => [
                    "statusChangeOrder" => false,
                    "refundOrder" => false,
                    "paymentOrder" => false,
                    "answerQuestion" => false
                ]
            ],
            "pushNotification" => [
                "all" => [
                    "order" => false,
                    "message" => false,
                    "storeNotice" => false
                ],
            ],
        ];
    }
}
