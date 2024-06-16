<?php

namespace Marvel\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\App;
use Marvel\Database\Models\Order;
use niklasravnsborg\LaravelPdf\Facades\Pdf as PDF;

class OrderPlacedSuccessfully extends Notification implements ShouldQueue
{
    use Queueable;

    protected array $invoiceData;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(array $invoiceData)
    {
        $this->invoiceData = $invoiceData;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable)
    {
        App::setLocale($this->invoiceData['language'] ?? DEFAULT_LANGUAGE);
        $invoiceData = $this->invoiceData;
        $pdf = PDF::loadView('pdf.order-invoice', $invoiceData);


        return (new MailMessage)
            ->subject(__('sms.order.orderCreated.customer.subject'))
            ->markdown('emails.order.order-invoice',  $invoiceData)
            ->attachData($pdf->output(), 'invoice.pdf');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
