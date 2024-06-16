import Card from '@/components/common/card';
import { CURRENCY } from '@/components/settings/payment/currency';
import { PAYMENT_GATEWAY } from '@/components/settings/payment/payment-gateway';
import WebHookURL from '@/components/settings/payment/webhook-url';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import ValidationError from '@/components/ui/form-validation-error';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Loader from '@/components/ui/loader/loader';
import PaymentSelect from '@/components/ui/payment-select';
import SelectInput from '@/components/ui/select-input';
import SwitchInput from '@/components/ui/switch-input';
import { Config } from '@/config';
import { useUpdateSettingsMutation } from '@/data/settings';
import { SettingCurrencyOptions, Settings } from '@/types';
import { formatPrice } from '@/utils/use-price';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty, split } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Badge from '@/components/ui/badge/badge';
import { COUNTRY_LOCALE } from '@/components/settings/payment/country-locale';
import { paymentValidationSchema } from '@/components/settings/payment/payment-validation-schema';
import { SaveIcon } from '@/components/icons/save';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

type PaymentFormValues = {
  currency: any;
  currencyOptions?: SettingCurrencyOptions;
  useCashOnDelivery: boolean;
  defaultPaymentGateway: paymentGatewayOption;
  useEnableGateway: boolean;
  paymentGateway: paymentGatewayOption[];
};

type paymentGatewayOption = {
  name: string;
  title: string;
};

type IProps = {
  settings?: Settings | null;
};

export default function PaymentSettingsForm({ settings }: IProps) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const { mutate: updateSettingsMutation, isLoading: loading } =
    useUpdateSettingsMutation();
  const { language, options } = settings ?? {};

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    shouldUnregister: true,
    resolver: yupResolver(paymentValidationSchema),
    defaultValues: {
      ...options,
      useEnableGateway: options?.useEnableGateway ?? true,
      currency: options?.currency
        ? CURRENCY.find((item) => item.code == options?.currency)
        : '',
      defaultPaymentGateway: options?.defaultPaymentGateway
        ? PAYMENT_GATEWAY.find(
            (item) => item.name == options?.defaultPaymentGateway
          )
        : PAYMENT_GATEWAY[0],
      currencyOptions: {
        ...options?.currencyOptions,
        // @ts-ignore
        formation: options?.currencyOptions?.formation
          ? COUNTRY_LOCALE.find(
              (item) => item.code == options?.currencyOptions?.formation
            )
          : COUNTRY_LOCALE[0],
      },
      // multi-select on payment gateway
      paymentGateway: options?.paymentGateway
        ? options?.paymentGateway?.map((gateway: any) => ({
            name: gateway?.name,
            title: gateway?.title,
          }))
        : [],
    },
  });

  const currentCurrency = watch('currency');
  const formation = watch('currencyOptions.formation');
  const currentFractions = watch('currencyOptions.fractions') as number;
  // const isNotDefaultSettingsPage = Config.defaultLanguage !== locale;

  async function onSubmit(values: PaymentFormValues) {
    updateSettingsMutation({
      language: locale,
      // @ts-ignore // // FIXME
      options: {
        ...options,
        ...values,
        currency: values.currency?.code,
        defaultPaymentGateway: values.defaultPaymentGateway?.name,
        paymentGateway:
          values?.paymentGateway && values?.paymentGateway!.length
            ? values?.paymentGateway?.map((gateway: any) => ({
                name: gateway.name,
                title: gateway.title,
              }))
            : PAYMENT_GATEWAY.filter((value: any, index: number) => index < 2),
        useEnableGateway: values?.useEnableGateway,
        //@ts-ignore
        currencyOptions: {
          ...values.currencyOptions,
          //@ts-ignore
          formation: values?.currencyOptions?.formation?.code,
        },
      },
    });
  }

  let paymentGateway = watch('paymentGateway');
  let defaultPaymentGateway = watch('defaultPaymentGateway');
  let useEnableGateway = watch('useEnableGateway');
  let checkAvailableDefaultGateway = paymentGateway?.some(
    (item: any) => item?.name === defaultPaymentGateway?.name
  );
  const isStripeActive = paymentGateway?.some(
    (payment) => payment?.name === 'stripe'
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:form-title-payment')}
          details={t('form:payment-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="useCashOnDelivery"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="!mb-0.5">
                {t('form:input-label-cash-on-delivery')}
              </Label>
            </div>
          </div>
          <div className="mb-5">
            <Label>{t('form:input-label-currency')}</Label>
            <SelectInput
              name="currency"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.code}
              options={CURRENCY}
              // disabled={isNotDefaultSettingsPage}
            />
            <ValidationError message={t(errors.currency?.message)} />
          </div>
          <div className="flex items-center gap-x-4">
            <SwitchInput
              control={control}
              // disabled={isNotDefaultSettingsPage}
              {...register('useEnableGateway')}
            />
            <Label className="!mb-0.5">{t('text-enable-gateway')}</Label>
          </div>
          {useEnableGateway ? (
            <>
              <div className="mt-5 mb-5">
                <Label>{t('text-select-payment-gateway')}</Label>
                <PaymentSelect
                  options={PAYMENT_GATEWAY}
                  control={control}
                  name="paymentGateway"
                  defaultItem={
                    checkAvailableDefaultGateway
                      ? defaultPaymentGateway?.name
                      : ''
                  }
                  disable={isEmpty(paymentGateway)}
                />
              </div>

              {isEmpty(paymentGateway) ? (
                <div className="flex px-5 py-4">
                  <Loader
                    simple={false}
                    showText={true}
                    text="form:text-payment-method-preparing"
                    className="mx-auto !h-20 w-6"
                  />
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <Label>{t('text-select-default-payment-gateway')}</Label>
                    <SelectInput
                      name="defaultPaymentGateway"
                      control={control}
                      getOptionLabel={(option: any) => option.title}
                      getOptionValue={(option: any) => option.name}
                      options={paymentGateway ?? []}
                      // disabled={isNotDefaultSettingsPage}
                    />
                  </div>
                  {isStripeActive && (
                    <>
                      <div className="mb-5">
                        <div className="flex items-center gap-x-4">
                          <SwitchInput
                            name="StripeCardOnly"
                            control={control}
                            // disabled={isNotDefaultSettingsPage}
                          />
                          <Label className="!mb-0">
                            {t('Enable Stripe Element')}
                          </Label>
                        </div>
                      </div>
                    </>
                  )}
                  <Label>{t('text-webhook-url')}</Label>
                  <div className="relative flex flex-col overflow-hidden rounded-md border border-solid border-[#D1D5DB]">
                    {paymentGateway?.map((gateway: any, index: any) => {
                      return <WebHookURL gateway={gateway} key={index} />;
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            ''
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:mt-8 sm:mb-3">
        <Description
          title={t('text-currency-options')}
          details={t('form:currency-options-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{`${t('form:input-label-currency-formations')} *`}</Label>
            <SelectInput
              {...register('currencyOptions.formation')}
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.code}
              options={COUNTRY_LOCALE}
              // disabled={isNotDefaultSettingsPage}
            />
          </div>
          <Input
            label={`${t('form:input-label-currency-number-of-decimal')} *`}
            {...register('currencyOptions.fractions')}
            type="number"
            variant="outline"
            placeholder={t('form:input-placeholder-currency-number-of-decimal')}
            error={t(errors.currencyOptions?.fractions?.message!)}
            className="mb-5"
          />
          {formation && (
            <div className="mb-5">
              <Label>
                {`Sample Output: `}
                <Badge
                  text={formatPrice({
                    amount: 987456321.123456789,
                    currencyCode:
                      currentCurrency?.code ?? settings?.options?.currency!,
                    locale: formation?.code! as string,
                    fractions: currentFractions,
                  })}
                  color="bg-accent"
                />
              </Label>
            </div>
          )}
        </Card>
      </div>

      <StickyFooterPanel className="z-0">
        <Button
          loading={loading}
          disabled={loading}
          className="text-sm md:text-base"
        >
          <SaveIcon className="relative top-px h-6 w-6 shrink-0 ltr:mr-2 rtl:pl-2" />
          {t('form:button-label-save-settings')}
        </Button>
      </StickyFooterPanel>
    </form>
  );
}
