<?php

namespace Marvel\Exports;

use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Marvel\Database\Models\Settings;
use Marvel\Traits\Helper;

class OrderExport implements FromCollection, WithHeadings
{
    use Helper;

    private $shop_id;
    private $repository;

    /**
     * Init class
     *
     * @param object $repository
     * @param int $shop_id
     */
    public function __construct($repository, $shop_id)
    {
        $this->shop_id    = $shop_id;
        $this->repository = $repository;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $results = [];

        if (!empty($this->shop_id)) {
            $orders = $this->repository->where('shop_id', $this->shop_id)->get();
        } else {
            $orders = $this->repository->where('parent_id', NULL)->get();
            // $orders = $this->repository->where('parent_id', '<>', NULL)->get();
        }


        if (empty($orders)) {
            return collect($results);
        }

        $settings = Settings::getData(request()['language'] ?? DEFAULT_LANGUAGE);
        $currency = $settings->options['currency'] ?? DEFAULT_CURRENCY;

        foreach ($orders as $order) {

            $results[] = [
                'id'                 => '#' . $order->id . ' ' . ($order?->customer?->name ?? $order?->customer_name),
                'customer_email'     => $order?->customer?->email ?? "Guest User",
                'created_at'         => (new Carbon($order->created_at))->format('Y-m-d'),
                'delivery_time'      => $order?->delivery_time,
                'status'             => $order?->order_status,
                'tracking_number'    => $order?->tracking_number,
                'shop'               => $order?->shop?->name,
                'coupon_id'          => $order?->coupon_id,
                'amount'             => @money($order?->amount, $currency),
                'discount'           => @money($order?->discount, $currency),
                'paid_amount'        => @money($order?->paid_total, $currency),
                'total'              => @money($order?->total, $currency),
                'sales_tax'          => @money($order?->sales_tax, $currency),
                'delivery_fee'       => @money($order?->delivery_fee, $currency),
                'payment_id'         => $order?->payment_id,
                'payment_gateway'    => $order?->payment_gateway,
                'billing_address'    => $this->formatAddress($order?->billing_address),
                'shipping_address'   => $this->formatAddress($order?->shipping_address),
                'customer_contact'   => $order?->customer_contact,
                'customer_name'      => $order?->customer_name,
                'logistics_provider' => $order?->logistics_provider
            ];
        }

        return collect($results);
    }

    /**
     * File header
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'Order Id',
            'Email',
            'Order Date',
            'Delivery Time',
            'Order Status',
            'Tracking No.',
            'Shop',
            'Coupon ID',
            'Amount',
            'Discount',
            'Paid',
            'Total',
            'Sales Tax',
            'Delivery Fee',
            'Payment Id',
            'Payment Gateway',
            'Billing Address',
            'Shipping Address',
            'Customer Contact',
            'Logistics Provider'
        ];
    }
}
