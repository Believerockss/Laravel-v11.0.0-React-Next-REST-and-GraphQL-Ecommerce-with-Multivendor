import Seo from '@/components/seo/seo';
import { useTermsAndConditions } from '@/framework/terms-and-conditions';
import { LIMIT_HUNDRED } from '@/lib/constants';
import { useTranslation } from 'next-i18next';
import PageBanner from '@/components/banners/page-banner';
import Terms from '@/components/terms/terms';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getLayoutWithFooter } from '@/components/layouts/layout-with-footer';
import ErrorMessage from '@/components/ui/error-message';
import { useRouter } from 'next/router';
import { useShop } from '@/framework/shop';
import NotFound from '@/components/ui/not-found';
import { isEmpty } from 'lodash';
export default function ShopTermsPage() {
  const { t } = useTranslation('terms');
  const {
    query: { slug },
  } = useRouter();
  const { data: shopData } = useShop({ slug: slug as string });
  const shopId = shopData?.id!;
  const {
    termsAndConditions,
    error,
    isLoading: loading,
  } = useTermsAndConditions({
    shop_id: shopId,
    issued_by: shopData?.name,
    limit: LIMIT_HUNDRED,
    is_approved: true,
  });

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <Seo title="Terms" url="terms" />
      <section className="mx-auto w-full max-w-1920 bg-light pb-8 lg:pb-10 xl:pb-14">
        <PageBanner
          title={t('terms-main-title')}
          breadcrumbTitle={t('terms-text-home')}
        />
        {/* End of page header */}
        <div className="3xl:py-18 container mx-auto px-4 py-8 md:py-10 xl:py-12 2xl:py-14">
          {isEmpty(termsAndConditions) ? (
            <div className="max-w-sm mx-auto">
              <NotFound text="No terms and conditions found." />
            </div>
          ) : (
            <Terms isLoading={loading} terms={termsAndConditions} />
          )}
        </div>
      </section>
    </>
  );
}

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'terms'])),
  },
});

ShopTermsPage.getLayout = getLayoutWithFooter;
