import Input from '@/components/ui/input';
import { useFieldArray, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import {
  useCreateTypeMutation,
  useUpdateTypeMutation,
} from '@/graphql/type.graphql';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { getErrorMessage } from '@/utils/form-error';
import { getIcon } from '@/utils/get-icon';
import Label from '@/components/ui/label';

import * as typeIcons from '@/components/icons/type';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';

import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { groupValidationSchema } from './group-validation-schema';
import FileInput from '@/components/ui/file-input';
import Title from '@/components/ui/title';
import TextArea from '@/components/ui/text-area';
import Alert from '@/components/ui/alert';
import Checkbox from '@/components/ui/checkbox/checkbox';
import RadioCard from '@/components/ui/radio-card/radio-card';
// import { EditIcon } from '@/components/icons/edit';
//@ts-ignore
import { split, join } from 'lodash';
import { useState } from 'react';
import {
  AttachmentInput,
  Type,
  TypeSettingsInput,
} from '__generated__/__types__';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import { formatSlug } from '@/utils/use-slug';
import SlugEditButton from '@/components/ui/slug-edit-button';
import StickyFooterPanel from '../ui/sticky-footer-panel';

const typeIcon = [
  {
    value: 'FruitsVegetable',
    label: 'Fruits and Vegetable',
  },
  {
    value: 'FacialCare',
    label: 'Facial Care',
  },
  {
    value: 'Handbag',
    label: 'Hand Bag',
  },
  {
    value: 'DressIcon',
    label: 'Dress Icon',
  },
  {
    value: 'FurnitureIcon',
    label: 'Furniture Icon',
  },
  {
    value: 'BookIcon',
    label: 'Book Icon',
  },
  {
    value: 'MedicineIcon',
    label: 'Medicine Icon',
  },
  {
    value: 'Restaurant',
    label: 'Restaurant',
  },
  {
    value: 'Bakery',
    label: 'Bakery',
  },
  {
    value: 'BabyCare',
    label: 'Baby Care',
  },
  {
    value: 'Gadgets',
    label: 'Gadgets',
  },
  {
    value: 'Plant',
    label: 'Plant',
  },
  {
    value: 'HomeAppliance',
    label: 'Home Appliance',
  },
  {
    value: 'MicroGreens',
    label: 'Micro Greens',
  },
];

const layoutTypes = [
  {
    label: 'Classic',
    value: 'classic',
    img: '/image/layout-classic.png',
  },
  {
    label: 'Compact',
    value: 'compact',
    img: '/image/layout-compact.png',
  },
  {
    label: 'Minimal',
    value: 'minimal',
    img: '/image/layout-minimal.png',
  },
  {
    label: 'Modern',
    value: 'modern',
    img: '/image/layout-modern.png',
  },
  {
    label: 'Standard',
    value: 'standard',
    img: '/image/layout-standard.png',
  },
];
const productCards = [
  {
    label: 'Helium',
    value: 'helium',
    img: '/image/card-helium.png',
  },
  {
    label: 'Neon',
    value: 'neon',
    img: '/image/card-neon.png',
  },
  {
    label: 'Argon',
    value: 'argon',
    img: '/image/card-argon.png',
  },
  {
    label: 'Krypton',
    value: 'krypton',
    img: '/image/card-krypton.png',
  },
  {
    label: 'Xenon',
    value: 'xenon',
    img: '/image/card-xenon.png',
  },
  {
    label: 'Radon',
    value: 'radon',
    img: '/image/card-radon.png',
  },
];

export const updatedIcons = typeIcon.map((item: any) => {
  item.label = (
    <div className="flex items-center space-s-5">
      <span className="flex h-5 w-5 items-center justify-center">
        {getIcon({
          iconList: typeIcons,
          iconName: item.value,
          className: 'max-h-full max-w-full',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};

type FormValues = {
  name: string;
  slug?: string | null;
  icon?: any;
  promotional_sliders: AttachmentInput[];
  banners: BannerInput[];
  settings: TypeSettingsInput;
};

type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateGroupForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const generateRedirectUrl = router.query.shop
    ? `/${router.query.shop}${Routes.type.list}`
    : Routes.type.list;
  const {
    register,
    control,
    handleSubmit,
    watch,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(groupValidationSchema),
    // @ts-ignore
    defaultValues: {
      ...initialValues,
      settings: {
        ...initialValues?.settings,
        layoutType: initialValues?.settings?.layoutType
          ? initialValues?.settings?.layoutType
          : layoutTypes[0].value,
        productCard: initialValues?.settings?.productCard
          ? initialValues?.settings?.productCard
          : productCards[0].value,
      },
      icon: initialValues?.icon
        ? typeIcon.find(
            (singleIcon) => singleIcon.value === initialValues?.icon!
          )
        : '',
    },
  });
  const slugAutoSuggest = formatSlug(watch('name'));
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'banners',
  });
  const layoutType = watch('settings.layoutType');
  const [createType, { loading: creating }] = useCreateTypeMutation();
  const [updateType, { loading: updating }] = useUpdateTypeMutation({
    onCompleted: async ({ updateType }) => {
      if (updateType) {
        if (initialValues?.slug !== updateType?.slug) {
          await router.push(
            `${generateRedirectUrl}/${updateType?.slug}/edit`,
            undefined,
            {
              locale: Config.defaultLanguage,
            }
          );
        }
      }

      toast.success(t('common:successfully-updated'));
    },
  });
  const onSubmit = async (values: FormValues) => {
    try {
      const inputData = {
        language: router.locale!,
        name: values.name!,
        slug: values.slug!,
        icon: values.icon?.value,
        settings: {
          isHome: values?.settings?.isHome,
          productCard: values?.settings?.productCard,
          layoutType: values?.settings?.layoutType,
        },
        promotional_sliders: values.promotional_sliders?.map(
          ({ thumbnail, original, id }: any) => ({
            thumbnail,
            original,
            id,
          })
        ),
        banners: values?.banners?.map(({ title, description, image }) => ({
          title,
          description,
          image: {
            id: image?.id,
            thumbnail: image?.thumbnail,
            original: image?.original,
          },
        })),
      };

      if (
        !initialValues ||
        !initialValues?.translated_languages?.includes(router?.locale!)
      ) {
        await createType({
          variables: {
            input: {
              ...inputData,
              ...(initialValues?.slug && { slug: initialValues.slug }),
            },
          },
        });

        // await router.push(Routes.type.list, undefined, {
        //   locale: Config.defaultLanguage,
        // });

        await router.push(generateRedirectUrl, undefined, {
          locale: Config.defaultLanguage,
        });

        toast.success(t('common:create-success'));
      } else {
        const { data } = await updateType({
          variables: {
            input: {
              id: initialValues.id!,
              ...inputData,
            },
          },
        });

        if (data) {
          toast.success(t('common:successfully-updated'));
        }
      }
    } catch (error) {
      getErrorMessage(error);
    }
  };
  // @ts-ignore
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:item-description')}
          details={`${
            initialValues
              ? t('form:item-description-update')
              : t('form:item-description-add')
          } ${t('form:group-description-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />

          {isSlugEditable ? (
            <div className="relative mb-5">
              <Input
                label={`${t('form:input-label-slug')}`}
                {...register('slug')}
                error={t(errors.slug?.message!)}
                variant="outline"
                disabled={isSlugDisable}
              />
              <SlugEditButton onClick={() => setIsSlugDisable(false)} />
            </div>
          ) : (
            <Input
              label={`${t('form:input-label-slug')}`}
              {...register('slug')}
              value={slugAutoSuggest}
              variant="outline"
              className="mb-5"
              disabled
            />
          )}

          <div className="mb-5">
            <Label>{t('form:input-label-select-icon')}</Label>
            <SelectInput
              name="icon"
              control={control}
              options={updatedIcons}
              isClearable={true}
            />
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:group-settings')}
          details={t('form:group-settings-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Checkbox
            {...register('settings.isHome')}
            error={t(errors.settings?.isHome?.message!)}
            label={t('form:input-label-is-home')}
            className="mb-5"
          />
          <div className="mb-10">
            <Label className="mb-5">{t('form:input-label-layout-type')}</Label>

            <div className="grid grid-cols-3 gap-5">
              {layoutTypes?.map((layout, index) => {
                return (
                  <RadioCard
                    key={index}
                    {...register('settings.layoutType')}
                    label={t(layout.label)}
                    value={layout.value}
                    src={layout.img}
                    id={layout?.value}
                  />
                );
              })}
            </div>
          </div>
          <div className="mb-5">
            <Label className="mb-5">
              {t('form:input-label-product-card-type')}
            </Label>

            <div className="grid grid-cols-3 gap-5">
              {productCards?.map((productCard, index) => {
                return (
                  <RadioCard
                    key={`product-card-${index}`}
                    {...register('settings.productCard')}
                    label={t(productCard.label)}
                    value={productCard.value}
                    src={productCard.img}
                    id={`product-card-${index}`}
                  />
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {layoutType === 'classic' ? (
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:promotional-slider')}
            details={t('form:promotional-slider-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="promotional_sliders" control={control} />
          </Card>
        </div>
      ) : null}
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:text-banner')}
          details={t('form:banner-slider-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            {fields.map((item: any & { id: string }, index: number) => (
              <div
                className="border-b border-dashed border-border-200 py-5 first:pt-0 last:border-0 md:py-8"
                key={item.id}
              >
                <div className="mb-5 flex items-center justify-between">
                  <Title className="mb-0">
                    {t('common:text-banner')} {index + 1}
                  </Title>
                  <button
                    onClick={() => {
                      remove(index);
                    }}
                    type="button"
                    className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none"
                  >
                    {t('form:button-label-remove')}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <Input
                    label={t('form:input-title')}
                    variant="outline"
                    {...register(`banners.${index}.title` as const)}
                    defaultValue={item?.title!} // make sure to set up defaultValue
                    error={t(errors.banners?.[index]?.title?.message!)}
                  />

                  <TextArea
                    label={t('form:input-description')}
                    variant="outline"
                    {...register(`banners.${index}.description` as const)}
                    defaultValue={item.description!}
                    // make sure to set up defaultValue
                  />
                </div>

                <div className="mt-5 w-full">
                  <Title>{t('form:input-banner')}</Title>
                  <FileInput
                    name={`banners.${index}.image`}
                    control={control}
                    multiple={false}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={() => append({ title: '', description: '', image: {} })}
            className="w-full sm:w-auto"
          >
            {t('form:button-label-add-banner')}
          </Button>
          {/* @ts-ignore */}
          {errors?.banners?.message ? (
            <Alert
              // @ts-ignore
              message={t(errors?.banners?.message)}
              variant="error"
              className="mt-5"
            />
          ) : null}
        </Card>
      </div>

      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="me-4"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button loading={creating || updating}>
            {initialValues
              ? t('form:button-label-update-group')
              : t('form:button-label-add-group')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
