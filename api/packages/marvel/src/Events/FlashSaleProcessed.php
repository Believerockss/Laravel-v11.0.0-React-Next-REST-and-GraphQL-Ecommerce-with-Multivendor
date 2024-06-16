<?php


namespace Marvel\Events;

use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\FlashSale;
use Marvel\Database\Models\Order;

class FlashSaleProcessed implements ShouldQueue
{

    public $action;

    public $language;

    /**
     * Create a new event instance.
     *
     * @param  $flash_sale
     */
    public function __construct($action, $language)
    {
        $this->action = $action;
        $this->language = $language;
    }
}
