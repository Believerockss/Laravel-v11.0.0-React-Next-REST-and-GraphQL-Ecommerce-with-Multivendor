import cn from 'classnames';
import { Image } from '@/components/ui/image';
import { useTranslation } from 'next-i18next';
import { formatAddress } from '@/lib/format-address';
import isEmpty from 'lodash/isEmpty';
import ReadMore from '@/components/ui/truncate';
import { useModalAction } from '@/components/ui/modal/modal.context';
import Scrollbar from '@/components/ui/scrollbar';
import { getIcon } from '@/lib/get-icon';
import { productPlaceholder } from '@/lib/placeholders';
import * as socialIcons from '@/components/icons/social';
import type { Shop } from '@/types';
import { useSettings } from '@/framework/settings';

type ShopSidebarProps = {
  shop: Shop | any;
  className?: string;
  cardClassName?: string;
};

const ShopSidebar: React.FC<ShopSidebarProps> = ({
  shop,
  className,
  cardClassName,
}) => {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();
  const { settings } = useSettings();

  function handleMoreInfoModal() {
    return openModal('SHOP_INFO', { shop });
  }
  return (
    <>
      <div
        className={cn(
          'sticky top-[110px] z-10 flex w-full items-center border-b border-gray-300 bg-light py-4 px-6 lg:hidden',
          cardClassName
        )}
      >
        <div className="relative mx-auto h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-200 ltr:mr-4 rtl:ml-4">
          <Image
            alt={t('logo')}
            src={shop?.logo?.original! ?? productPlaceholder}
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>

        <div className="w-full">
          <h3 className="text-base font-semibold text-heading">{shop?.name}</h3>

          <button
            className="text-sm font-semibold text-accent transition hover:text-accent-hover"
            onClick={handleMoreInfoModal}
          >
            {t('text-more-info')}
          </button>
        </div>
      </div>

      <aside
        className={cn(
          'hidden h-full w-full bg-light md:rounded lg:block lg:w-80 2xl:w-96',
          className
        )}
      >
        <div className="max-h-full overflow-hidden">
          <Scrollbar className={cn('w-full', 'scrollbar_height')}>
            <div className="flex w-full flex-col items-center border-b border-gray-200 p-7">
              <div className="relative mx-auto mb-8 h-44 w-44 overflow-hidden rounded-lg border border-gray-100 bg-gray-200">
                <Image
                  alt={t('logo')}
                  src={shop?.logo?.original! ?? productPlaceholder}
                  fill
                  sizes="(max-width: 768px) 100vw"
                  className="object-cover"
                />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-heading">
                {shop?.name}
              </h3>

              {shop?.description && (
                <p className="mb-2 text-center text-sm leading-relaxed text-body">
                  <ReadMore character={70}>{shop?.description}</ReadMore>
                </p>
              )}

              <div className="mt-3 flex items-center justify-start">
                {shop?.settings?.socials?.map((item: any, index: number) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    className={`text-muted transition-colors duration-300 focus:outline-none ltr:mr-6 ltr:last:mr-0 rtl:ml-6 rtl:last:ml-0 hover:${item.hoverClass}`}
                    rel="noreferrer"
                  >
                    {getIcon({
                      iconList: socialIcons,
                      iconName: item.icon,
                      className: 'w-4 h-4',
                    })}
                  </a>
                ))}
              </div>
            </div>

            <div className="p-7">
              <div className="mb-7 flex flex-col last:mb-0">
                <span className="mb-2 text-sm font-semibold text-heading">
                  {t('text-address')}
                </span>
                <span className="text-sm text-body">
                  {!isEmpty(formatAddress(shop?.address))
                    ? formatAddress(shop?.address)
                    : t('common:text-no-address')}
                </span>
              </div>

              <div className="mb-7 flex flex-col last:mb-0">
                <span className="mb-2 text-sm font-semibold text-heading">
                  {t('text-phone')}
                </span>
                <span className="text-sm text-body">
                  {shop?.settings?.contact
                    ? shop?.settings?.contact
                    : t('text-no-contact')}
                </span>
              </div>

              {shop?.settings?.website && (
                <div className="mb-7 flex flex-col last:mb-0">
                  <span className="mb-2 text-sm font-semibold text-heading">
                    {t('text-website')}
                  </span>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-body">
                      {shop.settings.website}
                    </span>
                    <a
                      href={shop.settings.website}
                      target="_blank"
                      className="text-sm font-semibold text-accent hover:text-accent-hover focus:text-accent-hover focus:outline-none"
                      rel="noreferrer"
                    >
                      {t('text-visit-site')}
                    </a>
                  </div>
                </div>
              )}

              <div className="mb-7 flex items-center justify-between last:mb-0">
                <span className="mb-2 text-sm font-semibold text-heading">
                  Contact shop owner
                </span>

                <a
                  href={`/shops/${shop?.slug}/contact`}
                  target="_blank"
                  className="text-sm font-semibold text-accent hover:text-accent-hover focus:text-accent-hover focus:outline-none"
                  rel="noreferrer"
                >
                  Visit
                </a>
              </div>

              <div className="mb-7 flex items-center justify-between last:mb-0">
                <span className="mb-2 text-sm font-semibold text-heading">
                  Shop FAQs
                </span>

                <a
                  href={`/shops/${shop?.slug}/faqs`}
                  target="_blank"
                  className="text-sm font-semibold text-accent hover:text-accent-hover focus:text-accent-hover focus:outline-none"
                  rel="noreferrer"
                >
                  Visit
                </a>
              </div>

              {settings?.enableTerms ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-heading">
                    Shop Terms & Conditions
                  </span>

                  <a
                    href={`/shops/${shop?.slug}/terms`}
                    target="_blank"
                    className="text-sm font-semibold text-accent hover:text-accent-hover focus:text-accent-hover focus:outline-none"
                    rel="noreferrer"
                  >
                    Visit
                  </a>
                </div>
              ) : (
                ''
              )}
            </div>
          </Scrollbar>
        </div>
      </aside>
    </>
  );
};

export default ShopSidebar;
