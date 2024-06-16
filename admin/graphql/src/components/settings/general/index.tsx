import Card from '@/components/common/card';
import { SaveIcon } from '@/components/icons/save';
import { AI } from '@/components/settings/ai';
import { generalSettingsValidationSchema } from '@/components/settings/general/general-validation-schema';
import {
  chatbotAutoSuggestion,
  chatbotAutoSuggestion1,
} from '@/components/settings/openAIPromptSample';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { useModalAction } from '@/components/ui/modal/modal.context';
import SelectInput from '@/components/ui/select-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import SwitchInput from '@/components/ui/switch-input';
// import { Config } from '@/config';
import { useSettings } from '@/contexts/settings.context';
import { useUpdateSettingsMutation } from '@/graphql/settings.graphql';
import { siteSettings } from '@/settings/site.settings';
import { ItemProps } from '@/types/custom-types';
import { prepareSettingsInputData } from '@/utils/prepare-settings-input';
// import { ApolloCache } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ServerInfo,
  Settings,
  SettingsOptionsInput,
  Shipping,
  Tax,
} from '__generated__/__types__';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type FormValues = {
  siteTitle: string;
  siteSubtitle: string;
  minimumOrderAmount: number;
  logo: any;
  collapseLogo: any;
  useOtp: boolean;
  useAi: boolean;
  defaultAi: any;
  useMustVerifyEmail: boolean;
  freeShipping: boolean;
  freeShippingAmount: number;
  taxClass: Tax;
  shippingClass: Shipping;
  signupPoints: number;
  maximumQuestionLimit: number;
  currencyToWalletRatio: number;
  guestCheckout: boolean;
  server_info: ServerInfo;
};

type IProps = {
  settings: Settings | undefined | null;
  taxClasses: Tax[] | undefined | null;
  shippingClasses: Shipping[] | undefined | null;
};

export default function GeneralSettingsForm({
  settings,
  taxClasses,
  shippingClasses,
}: IProps) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [updateSettingsMutation, { loading }] = useUpdateSettingsMutation();
  const { options: settingOptions } = settings ?? {};
  // @ts-ignore
  const [serverInfo, SetSeverInfo] = useState(settingOptions?.server_info!);
  const { updateSettings } = useSettings();

  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: yupResolver(generalSettingsValidationSchema),
    defaultValues: {
      ...settingOptions,
      server_info: serverInfo,
      logo: settingOptions?.logo ?? '',
      collapseLogo: settingOptions?.collapseLogo ?? '',
      useEnableGateway: settingOptions?.useEnableGateway ?? true,
      guestCheckout: settingOptions?.guestCheckout ?? true,
      defaultAi: settingOptions?.defaultAi
        ? AI.find((item) => item.value == settingOptions?.defaultAi)
        : 'openai',
      // @ts-ignore
      taxClass: !!taxClasses?.length
        ? taxClasses?.find((tax: Tax) => tax.id == settingOptions?.taxClass)
        : '',
      // @ts-ignore
      shippingClass: !!shippingClasses?.length
        ? shippingClasses?.find(
            (shipping: Shipping) => shipping.id == settingOptions?.shippingClass
          )
        : '',
    },
  });

  const { openModal } = useModalAction();

  const generateName = watch('siteTitle');
  const autoSuggestionList = useMemo(() => {
    return chatbotAutoSuggestion({ name: generateName ?? '' });
  }, [generateName]);

  // @ts-ignore
  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'seo.metaDescription',
      suggestion: autoSuggestionList as ItemProps[],
    });
  }, [generateName]);

  const autoSuggestionList1 = useMemo(() => {
    return chatbotAutoSuggestion1({ name: generateName ?? '' });
  }, [generateName]);

  // @ts-ignore
  const handleGenerateDescription1 = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'seo.ogDescription',
      suggestion: autoSuggestionList1 as ItemProps[],
    });
  }, [generateName]);

  const enableFreeShipping = watch('freeShipping');

  // const isNotDefaultSettingsPage = Config.defaultLanguage !== locale;

  async function onSubmit(values: FormValues) {
    const inputValues = {
      ...values,
      signupPoints: Number(values.signupPoints),
      currencyToWalletRatio: Number(values.currencyToWalletRatio),
      minimumOrderAmount: Number(values.minimumOrderAmount),
      freeShippingAmount: Number(values.freeShippingAmount),
      defaultAi: values?.defaultAi?.value,
      guestCheckout: values?.guestCheckout,
      taxClass: values?.taxClass?.id,
      shippingClass: values?.shippingClass?.id,
      logo: values?.logo,
      collapseLogo: values?.collapseLogo,
    };

    const settingsOptionsInput: SettingsOptionsInput = prepareSettingsInputData(
      { ...settingOptions, ...inputValues! }
    );

    const updatedData = await updateSettingsMutation({
      variables: {
        input: {
          language: locale!,
          // @ts-ignore
          options: {
            ...settingsOptionsInput,
          },
        },
      },
    });

    if (updatedData) {
      updateSettings(updatedData?.data?.updateSettings?.options!);
      toast.success(t('common:successfully-updated'));
    }
  }

  let useAi = watch('useAi');

  const upload_max_filesize =
    Number(settingOptions?.server_info?.upload_max_filesize) / 1024;

  const logoInformation = (
    <span>
      {t('form:logo-help-text')} <br />
      {t('form:logo-dimension-help-text')} &nbsp;
      <span className="font-bold">
        {siteSettings.logo.width}x{siteSettings.logo.height} {t('common:pixel')}
      </span>
      <br />
      {t('form:size-help-text')} &nbsp;
      <span className="font-bold">{upload_max_filesize} MB </span>
    </span>
  );
  const collapseLogoInformation = (
    <span>
      {t('form:logo-collapse-help-text')} <br />
      {t('form:logo-dimension-help-text')} &nbsp;
      <span className="font-bold">
        {siteSettings.collapseLogo.width}x{siteSettings.collapseLogo.height}{' '}
        {t('common:pixel')}
      </span>
      <br />
      {t('form:size-help-text')} &nbsp;
      <span className="font-bold">{upload_max_filesize} MB </span>
    </span>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-logo')}
          details={logoInformation}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="logo-field-area w-full sm:w-8/12 md:w-2/3">
          <FileInput name="logo" control={control} multiple={false} />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-collapse-logo')}
          details={collapseLogoInformation}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="logo-field-area w-full sm:w-8/12 md:w-2/3">
          <FileInput name="collapseLogo" control={control} multiple={false} />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:site-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-site-title')}
            {...register('siteTitle')}
            error={t(errors.siteTitle?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-site-subtitle')}
            {...register('siteSubtitle')}
            error={t(errors.siteSubtitle?.message!)}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={`${t('form:input-label-signup-points')}`}
            {...register('signupPoints')}
            type="number"
            error={t(errors.signupPoints?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isNotDefaultSettingsPage}
          />

          <Input
            label={`${t('form:input-label-min-order-amount')}`}
            {...register('minimumOrderAmount')}
            type="number"
            error={t(errors.minimumOrderAmount?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isNotDefaultSettingsPage}
          />
          <Input
            label={`${t('form:input-label-wallet-currency-ratio')}`}
            {...register('currencyToWalletRatio')}
            type="number"
            error={t(errors.currencyToWalletRatio?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isNotDefaultSettingsPage}
          />

          <Input
            label={`${t('form:input-label-maximum-question-limit')}`}
            {...register('maximumQuestionLimit')}
            type="number"
            error={t(errors.maximumQuestionLimit?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isNotDefaultSettingsPage}
          />

          <div className="mb-5">
            <Label>{t('form:input-label-tax-class')}</Label>
            <SelectInput
              name="taxClass"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={taxClasses!}
              // disabled={isNotDefaultSettingsPage}
            />
          </div>

          <div className="mb-5">
            <Label>{t('form:input-label-shipping-class')}</Label>
            <SelectInput
              name="shippingClass"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={shippingClasses!}
              // disabled={isNotDefaultSettingsPage}
            />
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="useOtp"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="!mb-0.5">
                {t('form:input-label-enable-otp')}
              </Label>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="useMustVerifyEmail"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="!mb-0.5 ">
                {t('form:input-label-use-must-verify-email')}
              </Label>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="guestCheckout"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="!mb-0.5 ">
                {t('form:input-label-enable-guest-checkout')}
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            <SwitchInput
              name="freeShipping"
              control={control}
              checked={enableFreeShipping}
              // disabled={isNotDefaultSettingsPage}
            />
            <Label className="!mb-0.5 ">
              {t('form:input-label-enable-free-shipping')}
            </Label>
          </div>

          {enableFreeShipping && (
            <Input
              label={t('form:free-shipping-input-label-amount')}
              {...register('freeShippingAmount')}
              error={t(errors.freeShippingAmount?.message!)}
              variant="outline"
              type="number"
              className="mt-5"
              // disabled={isNotDefaultSettingsPage}
            />
          )}

          <div className="mt-5 mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="useAi"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="!mb-0.5 ">
                {t('form:input-label-enable-open-ai')}
              </Label>
            </div>
          </div>
          {useAi ? (
            <div className="mb-5">
              <Label>{t('form:input-label-select-ai')}</Label>
              <SelectInput
                name="defaultAi"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.value}
                options={AI}
                // disabled={isNotDefaultSettingsPage}
              />
            </div>
          ) : (
            ''
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
