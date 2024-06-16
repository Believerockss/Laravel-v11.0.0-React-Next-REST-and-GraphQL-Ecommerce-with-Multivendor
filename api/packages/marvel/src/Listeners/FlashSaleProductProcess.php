<?php

namespace Marvel\Listeners;

use Exception;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\FlashSale;
use Marvel\Database\Models\Product;
use Marvel\Database\Models\Variation;
use Marvel\Enums\ProductType;
use Marvel\Events\FlashSaleProcessed;


class FlashSaleProductProcess implements ShouldQueue
{
    public function handle(FlashSaleProcessed $event)
    {
        $flash_sales_action = $event->action;
        $language = $event->language;
        $current_date = date("Y-m-d");

        if ($flash_sales_action === 'index') {
            $flash_sales = FlashSale::where('language', $language)->withTrashed()->get();
            if (isset($flash_sales)) {
                foreach ($flash_sales as $key => $flash_sale) {


                    if (!isset($flash_sale->deleted_at)) {
                        $this->processFlashSaleProducts($flash_sale);
                    }

                    // process for time over item.
                    $end_date = Carbon::parse($flash_sale->end_date)->toDateString();

                    if ($current_date > $end_date) {
                        $this->processFlashSaleAfterExpired($flash_sale);
                    }

                    // process for soft deleted item
                    if (isset($flash_sale->deleted_at)) {
                        $this->processSoftDeletedFlashSales($flash_sale);
                    }
                }
            }
        }
    }


    /**
     * processFlashSaleProducts
     *
     * @param  mixed $flash_sale
     * @return void
     */
    public function processFlashSaleProducts($flash_sale)
    {
        $current_date = date("Y-m-d");
        $start_date = Carbon::parse($flash_sale->start_date)->toDateString();

        if (isset($flash_sale['sale_builder']['product_ids'])) {
            $product_ids = $flash_sale['sale_builder']['product_ids'];

            foreach ($product_ids as $key => $product_id) {
                $product = Product::where('id', '=', $product_id)->with(['variation_options'])->first();

                if ($current_date === $start_date) {
                    switch ($flash_sale->type) {
                        case 'percentage':
                            if ($product->product_type === ProductType::VARIABLE) {
                                foreach ($product->variation_options as $key => $variation) {
                                    $sale_price = $variation->price - ($variation->price * ($flash_sale->rate / 100));
                                    Variation::where('id', $variation->id)->update(['sale_price' => $sale_price]);
                                }
                            }

                            if ($product->product_type === ProductType::SIMPLE) {
                                $product->sale_price = $product->price - ($product->price * ($flash_sale->rate / 100));
                            }

                            break;

                        case 'fixed_rate':
                            if ($product->product_type === ProductType::VARIABLE) {
                                foreach ($product->variation_options as $key => $variation) {
                                    $sale_price = $variation->price - $flash_sale->rate;
                                    $sale_price = $sale_price <= 0 ? null : $sale_price;
                                    Variation::where('id', $variation->id)->update(['sale_price' => $sale_price]);
                                }
                            }

                            if ($product->product_type === ProductType::SIMPLE) {
                                $sale_price = $product->price - $flash_sale->rate <= 0 ? null : $product->price - $flash_sale->rate;
                                $product->sale_price = $sale_price;
                            }

                            break;
                    }
                }

                $product->in_flash_sale = true;
                $product->save();
            }
        }
    }


    /**
     * processFlashSaleAfterExpired
     *
     * @param  mixed $flash_sale
     * @return void
     */
    public function processFlashSaleAfterExpired($flash_sale)
    {
        $flash_sale->delete();
        $flash_sale->products()->detach($flash_sale['sale_builder']['product_ids']);
        $this->unsetProductFromFlashSale($flash_sale);
    }


    /**
     * processSoftDeletedFlashSales
     *
     * @param  mixed $flash_sale
     * @return void
     */
    public function processSoftDeletedFlashSales($flash_sale)
    {
        $flash_sale->sale_status = false;
        $flash_sale->products()->detach($flash_sale['sale_builder']['product_ids']);
        $flash_sale->save();
        $this->unsetProductFromFlashSale($flash_sale);
    }


    /**
     * unsetProductFromFlashSale
     *
     * @param  mixed $flash_sale
     * @return void
     */
    public function unsetProductFromFlashSale($flash_sale)
    {
        if (isset($flash_sale['sale_builder']['product_ids'])) {
            $product_ids = $flash_sale['sale_builder']['product_ids'];

            foreach ($product_ids as $key => $product_id) {
                $product = Product::where('id', '=', $product_id)->with(['variation_options'])->first();

                if ($product->product_type === ProductType::VARIABLE) {
                    foreach ($product->variation_options as $key => $variation) {
                        Variation::where('id', $variation->id)->update(['sale_price' => null]);
                    }
                }

                if ($product->product_type === ProductType::SIMPLE) {
                    $product->sale_price = null;
                }

                $product->in_flash_sale = false;
                $product->save();
            }
        }
    }
}
