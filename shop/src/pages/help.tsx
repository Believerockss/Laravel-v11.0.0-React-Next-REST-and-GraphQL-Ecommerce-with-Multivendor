import Seo from '@/components/seo/seo';
import NotFound from '@/components/ui/not-found';
import { useFAQs } from '@/framework/faqs';
import { useTranslation } from 'next-i18next';
import { getStaticProps } from '@/framework/faq-ssr';
export { getStaticProps };
import { LIMIT_HUNDRED } from '@/lib/constants';
import { getLayoutWithFooter } from '@/components/layouts/layout-with-footer';
import PageBanner from '@/components/banners/page-banner';
import FAQ from '@/components/faq/faq';
import ErrorMessage from '@/components/ui/error-message';

export default function HelpPage() {
  const { t } = useTranslation();
  const { faqs, isLoading, error } = useFAQs({
    faq_type: 'global',
    issued_by: 'Super Admin',
    limit: LIMIT_HUNDRED,
  });

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <Seo title="Help" url="help" />
      <section className="mx-auto h-screen w-full max-w-1920 bg-light pb-16 lg:pb-10 xl:pb-14">
        <PageBanner
          title={t('text-faq-title')}
          breadcrumbTitle={t('text-home')}
        />
        <div className="mx-auto w-full max-w-screen-lg px-4 py-10">
          {!isLoading && !faqs.length ? (
            <div className="min-h-full p-5 md:p-8 lg:p-12 2xl:p-16">
              <NotFound text="text-no-faq" className="h-96" />
            </div>
          ) : (
            <FAQ data={faqs} isLoading={isLoading} />
          )}
        </div>
      </section>
    </>
  );
}

HelpPage.getLayout = getLayoutWithFooter;
