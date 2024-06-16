<?php

namespace Marvel\Providers;

use App\Events\QuestionAnswered;
use App\Events\RefundApproved;
use App\Events\ReviewCreated;
use App\Listeners\RatingRemoved;
use Marvel\Listeners\SendQuestionAnsweredNotification;
use App\Listeners\SendReviewNotification;
use Marvel\Listeners\StoreNoticeListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Marvel\Events\FlashSaleProcessed;
use Marvel\Events\MessageSent;
use Marvel\Events\OrderCancelled;
use Marvel\Events\OrderCreated;
use Marvel\Events\OrderDelivered;
use Marvel\Events\OrderProcessed;
use Marvel\Events\OrderReceived;
use Marvel\Events\OrderStatusChanged;
use Marvel\Listeners\ManageProductInventory;
use Marvel\Listeners\MessageParticipantNotification;
use Marvel\Listeners\SendMessageNotification;
use Marvel\Events\StoreNoticeEvent;
use Marvel\Events\PaymentFailed;
use Marvel\Events\PaymentMethods;
use Marvel\Events\PaymentSuccess;
use Marvel\Events\ProcessUserData;
use Marvel\Events\ProductReviewApproved;
use Marvel\Events\ProductReviewRejected;
use Marvel\Events\RefundRequested;
use Marvel\Events\RefundUpdate;
use Marvel\Listeners\AppDataListener;
use Marvel\Listeners\CheckAndSetDefaultCard;
use Marvel\Listeners\FlashSaleProductProcess;
use Marvel\Listeners\ProductInventoryDecrement;
use Marvel\Listeners\ProductInventoryRestore;
use Marvel\Listeners\ProductReviewApprovedListener;
use Marvel\Listeners\ProductReviewRejectedListener;
use Marvel\Listeners\Refund\SendRefundUpdateNotification;
use Marvel\Listeners\SendOrderCreationNotification;
use Marvel\Listeners\SendOrderCancelledNotification;
use Marvel\Listeners\SendOrderDeliveredNotification;
use Marvel\Listeners\SendOrderReceivedNotification;
use Marvel\Listeners\SendOrderStatusChangedNotification;
use Marvel\Listeners\SendPaymentFailedNotification;
use Marvel\Listeners\SendPaymentSuccessNotification;
use Marvel\Listeners\SendRefundRequestedNotification;
use Marvel\Listeners\StoredMessagedNotifyLogsListener;
use Marvel\Listeners\StoredOrderNotifyLogsListener;
use Marvel\Listeners\StoredStoreNoticeNotifyLogsListener;

class EventServiceProvider extends ServiceProvider
{

    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        QuestionAnswered::class => [
            SendQuestionAnsweredNotification::class
        ],
        ReviewCreated::class => [
            SendReviewNotification::class
        ],
        OrderCreated::class => [
            SendOrderCreationNotification::class,
            StoredOrderNotifyLogsListener::class
        ],
        OrderReceived::class => [
            SendOrderReceivedNotification::class
        ],
        OrderProcessed::class => [
            ProductInventoryDecrement::class,
        ],
        OrderCancelled::class => [
            ProductInventoryRestore::class,
            SendOrderCancelledNotification::class
        ],
        RefundApproved::class => [
            RatingRemoved::class
        ],
        MessageSent::class => [
            MessageParticipantNotification::class,
            SendMessageNotification::class,
            StoredMessagedNotifyLogsListener::class
        ],
        PaymentSuccess::class => [
            SendPaymentSuccessNotification::class
        ],
        PaymentFailed::class => [
            SendPaymentFailedNotification::class
        ],
        PaymentMethods::class => [
            CheckAndSetDefaultCard::class
        ],
        ProductReviewApproved::class => [
            ProductReviewApprovedListener::class,
        ],
        ProductReviewRejected::class => [
            ProductReviewRejectedListener::class,
        ],
        StoreNoticeEvent::class => [
            StoreNoticeListener::class,
            StoredStoreNoticeNotifyLogsListener::class
        ],
        OrderDelivered::class => [
            SendOrderDeliveredNotification::class
        ],
        OrderStatusChanged::class => [
            SendOrderStatusChangedNotification::class
        ],
        RefundRequested::class => [
            SendRefundRequestedNotification::class
        ],
        RefundUpdate::class => [
            SendRefundUpdateNotification::class
        ],
        FlashSaleProcessed::class => [
            FlashSaleProductProcess::class
        ],
        ProcessUserData::class => [
            AppDataListener::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
