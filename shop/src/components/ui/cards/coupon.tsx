import { useRef, useState, useEffect } from 'react';
import { Image } from '@/components/ui/image';
import cn from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'next-i18next';
import { couponPlaceholder } from '@/lib/placeholders';

type CouponCardProps = {
  coupon?: any;
  className?: string;
};

const CouponCard: React.FC<CouponCardProps> = ({ coupon, className }) => {
  const { t } = useTranslation('common');
  const { code, image, is_valid } = coupon;
  const [copyText, setCopyText] = useState({
    value: code,
    copied: false,
  });

  useEffect(() => {
    let timeout: any;
    if (copyText.copied) {
      timeout = setTimeout(() => {
        setCopyText((prev) => ({
          ...prev,
          copied: false,
        }));
      }, 3500);
    }
    return () => clearTimeout(timeout);
  }, [copyText.copied]);

  return (
    <div className={cn('coupon-card', className)}>
      <div className="relative flex overflow-hidden rounded bg-gray-200">
        <Image
          src={image?.thumbnail ?? couponPlaceholder}
          alt={code}
          width="572"
          height="429"
        />
      </div>
      <div className="rounded-be mx-auto grid w-11/12 auto-cols-fr grid-flow-col items-center rounded-bl bg-light px-5 py-4 shadow-sm">
        {is_valid ? (
          <>
            <span className="font-semibold uppercase text-heading focus:outline-none">
              {copyText.value}
            </span>

            {!copyText.copied && (
              <CopyToClipboard
                text={copyText.value}
                onCopy={() =>
                  setCopyText((prev) => ({
                    ...prev,
                    copied: true,
                  }))
                }
              >
                <button className="text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-hover focus:text-accent-hover focus:outline-0 ltr:text-right rtl:text-left">
                  <span>{t('text-copy')}</span>
                </button>
              </CopyToClipboard>
            )}

            {copyText.copied && (
              <div className="text-sm font-semibold text-accent ltr:text-right rtl:text-left">
                {t('text-copied')}
              </div>
            )}
          </>
        ) : (
          <span className="block text-center text-sm text-red-500">
            {t('text-expired')}
          </span>
        )}
      </div>
    </div>
  );
};

export default CouponCard;
