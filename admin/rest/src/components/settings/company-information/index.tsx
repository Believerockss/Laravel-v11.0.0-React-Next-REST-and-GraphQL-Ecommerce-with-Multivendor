import Card from '@/components/common/card';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import * as socialIcons from '@/components/icons/social';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import { Config } from '@/config';
import { useUpdateSettingsMutation } from '@/data/settings';
import {
  ContactDetailsInput,
  Settings,
  ShopSocialInput,
  UserAddress,
} from '@/types';
import { getIcon } from '@/utils/get-icon';
import omit from 'lodash/omit';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { SaveIcon } from '@/components/icons/save';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { socialIcon } from '@/settings/site.settings';
import { companyValidationSchema } from '@/components/settings/company-information/company-validation-schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatAddress } from '@/utils/format-address';
import TextArea from '@/components/ui/text-area';

type CompanyInformationFormValues = {
  siteLink: string;
  copyrightText: string;
  externalText: string;
  externalLink: string;
  contactDetails: ContactDetailsInput;
  google: {
    isEnable: boolean;
    tagManagerId: string;
  };
  facebook: {
    isEnable: boolean;
    appId: string;
    pageId: string;
  };
};

type IProps = {
  settings?: Settings | null;
};

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex items-center text-body space-s-4">
      <span className="flex h-4 w-4 items-center justify-center">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: 'w-4 h-4',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

export default function CompanyInfoForm({ settings }: IProps) {
  const { mutate: updateSettingsMutation, isLoading: loading } =
    useUpdateSettingsMutation();
  const { t } = useTranslation();
  const { options } = settings ?? {};
  const isGoogleMapActive = options?.useGoogleMap;
  const { locale } = useRouter();
  // const isNotDefaultSettingsPage = Config.defaultLanguage !== locale;

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanyInformationFormValues>({
    shouldUnregister: true,
    resolver: yupResolver(companyValidationSchema),
    // @ts-ignore
    defaultValues: {
      ...options,
      contactDetails: {
        ...options?.contactDetails,
        socials: options?.contactDetails?.socials
          ? options?.contactDetails?.socials.map((social: any) => ({
              icon: updatedIcons?.find((icon) => icon?.value === social?.icon),
              url: social?.url,
            }))
          : [],
      },
    },
  });

  const {
    fields: socialFields,
    append: socialAppend,
    remove: socialRemove,
  } = useFieldArray({
    control,
    name: 'contactDetails.socials',
  });

  async function onSubmit(values: CompanyInformationFormValues) {
    const contactDetails = {
      ...values?.contactDetails,
      location: isGoogleMapActive
        ? { ...omit(values?.contactDetails?.location, '__typename') }
        : {
            ...values?.contactDetails?.location,
            formattedAddress: formatAddress(
              values?.contactDetails?.location as UserAddress
            ),
          },
      socials: values?.contactDetails?.socials
        ? values?.contactDetails?.socials?.map((social: any) => ({
            icon: social?.icon?.value,
            url: social?.url,
          }))
        : [],
    };

    updateSettingsMutation({
      language: locale,
      //   @ts-ignore
      options: {
        ...options,
        ...values,
        contactDetails,
      },
    });
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8 sm:mt-8 sm:mb-3">
        <Description
          title={t('form:footer-address')}
          details={t('form:footer-address-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          {isGoogleMapActive ? (
            <div className="mb-5">
              <Label>{t('form:input-label-autocomplete')}</Label>
              <Controller
                control={control}
                name="contactDetails.location"
                render={({ field: { onChange } }) => (
                  <GooglePlacesAutocomplete
                    onChange={onChange}
                    data={getValues('contactDetails.location')!}
                    // disabled={isNotDefaultSettingsPage}
                  />
                )}
              />
            </div>
          ) : (
            <div className="mb-5 grid grid-cols-2 gap-4">
              <Input
                label={t('text-city')}
                {...register('contactDetails.location.city')}
                error={t(errors.contactDetails?.location?.city!)}
                variant="outline"
                // disabled={isNotDefaultSettingsPage}
              />
              <Input
                label={t('text-country')}
                {...register('contactDetails.location.country')}
                error={t(errors.contactDetails?.location?.country!)}
                variant="outline"
                // disabled={isNotDefaultSettingsPage}
              />
              <Input
                label={t('text-state')}
                {...register('contactDetails.location.state')}
                error={t(errors.contactDetails?.location?.state!)}
                variant="outline"
                // disabled={isNotDefaultSettingsPage}
              />
              <Input
                label={t('text-zip')}
                {...register('contactDetails.location.zip')}
                error={t(errors.contactDetails?.location?.zip!)}
                variant="outline"
                // disabled={isNotDefaultSettingsPage}
              />
              <TextArea
                label={t('text-street-address')}
                {...register('contactDetails.location.street_address')}
                error={t(errors.contactDetails?.location?.street_address!)}
                variant="outline"
                // disabled={isNotDefaultSettingsPage}
                className="col-span-full"
              />
            </div>
          )}
          <Input
            label={t('form:input-label-contact')}
            {...register('contactDetails.contact')}
            variant="outline"
            className="mb-5"
            error={t(errors.contactDetails?.contact?.message!)}
            // disabled={isNotDefaultSettingsPage}
          />
          <Input
            label={t('form:input-label-website')}
            {...register('contactDetails.website')}
            variant="outline"
            className="mb-5"
            error={t(errors.contactDetails?.website?.message!)}
            // disabled={isNotDefaultSettingsPage}
          />
          <Input
            label={t('form:input-label-email')}
            {...register('contactDetails.emailAddress')}
            variant="outline"
            className="mb-5"
            error={t(errors.contactDetails?.emailAddress?.message!)}
            // disabled={isNotDefaultSettingsPage}
          />
          {/* Social and Icon picker */}
          <div>
            {socialFields?.map(
              (item: ShopSocialInput & { id: string }, index: number) => (
                <div
                  className="border-b border-dashed border-border-200 py-5 first:mt-5 first:border-t last:border-b-0 md:py-8 md:first:mt-10"
                  key={item.id}
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                    <div className="sm:col-span-2">
                      <Label className="whitespace-nowrap">
                        {t('form:input-label-select-platform')}
                      </Label>
                      <SelectInput
                        name={`contactDetails.socials.${index}.icon` as const}
                        control={control}
                        options={updatedIcons}
                        isClearable={true}
                        defaultValue={item?.icon!}
                        // disabled={isNotDefaultSettingsPage}
                      />
                    </div>
                    <Input
                      className="sm:col-span-2"
                      label={t('form:input-label-social-url')}
                      variant="outline"
                      {...register(
                        `contactDetails.socials.${index}.url` as const
                      )}
                      defaultValue={item.url!} // make sure to set up defaultValue
                      // disabled={isNotDefaultSettingsPage}
                      error={t(
                        errors?.contactDetails?.socials?.[index]?.url?.message!
                      )}
                    />
                    {/* {!isNotDefaultSettingsPage && ( */}
                      <button
                        onClick={() => {
                          socialRemove(index);
                        }}
                        type="button"
                        className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                        // disabled={isNotDefaultSettingsPage}
                      >
                        {t('form:button-label-remove')}
                      </button>
                    {/* )} */}
                  </div>
                </div>
              )
            )}
          </div>
          {/* {!isNotDefaultSettingsPage && ( */}
            <Button
              type="button"
              onClick={() => socialAppend({ icon: '', url: '' })}
              className="w-full sm:w-auto"
              // disabled={isNotDefaultSettingsPage}
            >
              {t('form:button-label-add-social')}
            </Button>
          {/* )} */}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8">
        <Description
          title={t('form:form-title-footer-information')}
          details={t('form:site-info-footer-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-site-link')}
            {...register('siteLink')}
            error={t(errors?.siteLink?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-copyright-text')}
            {...register('copyrightText')}
            error={t(errors?.copyrightText?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-external-text')}
            {...register('externalText')}
            error={t(errors?.externalText?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-external-link')}
            {...register('externalLink')}
            error={t(errors?.externalLink?.message!)}
            variant="outline"
            className="mb-5"
          />
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
