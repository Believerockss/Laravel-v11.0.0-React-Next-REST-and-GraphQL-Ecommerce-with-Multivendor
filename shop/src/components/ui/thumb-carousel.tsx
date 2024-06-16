import { ChevronLeft } from '@/components/icons/chevron-left';
import { ChevronRight } from '@/components/icons/chevron-right';
import {
  Swiper,
  SwiperSlide,
  SwiperOptions,
  Navigation,
  Thumbs,
  FreeMode,
} from '@/components/ui/slider';
import { Image } from '@/components/ui/image';
import { useRef, useState } from 'react';
import { productPlaceholder } from '@/lib/placeholders';
import { useIsRTL } from '@/lib/locals';
import classNames from 'classnames';
import { PlayIcon } from '../icons/play-icon';

interface Props {
  gallery: any[];
  video?: any;
  hideThumbs?: boolean;
  aspectRatio?: 'auto' | 'square';
}
// product gallery breakpoints
const galleryCarouselBreakpoints = {
  320: {
    slidesPerView: 2,
  },
  480: {
    slidesPerView: 3,
  },
  640: {
    slidesPerView: 3,
  },
  800: {
    slidesPerView: 4,
  },
};
const swiperParams: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 0,
};
export const ThumbsCarousel: React.FC<Props> = ({
  gallery,
  video,
  hideThumbs = false,
  aspectRatio = 'square',
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const { isRTL } = useIsRTL();
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div className="relative">
        <Swiper
          id="productGallery"
          modules={[Navigation, Thumbs, FreeMode]}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          navigation={{
            prevEl: prevRef.current!, // Assert non-null
            nextEl: nextRef.current!, // Assert non-null
          }}
          {...swiperParams}
        >
          {gallery?.map((item: any) => (
            <SwiperSlide
              key={`product-gallery-${item.id}`}
              className="!flex items-center justify-center selection:bg-transparent"
            >
              <Image
                src={item?.original ?? productPlaceholder}
                alt={`Product gallery ${item.id}`}
                width={aspectRatio === 'square' ? 450 : 420}
                height={aspectRatio === 'square' ? 450 : 560}
              />
            </SwiperSlide>
          ))}
          {video?.length
            ? video.map((item: any, index: number) => (
                <SwiperSlide key={`product-video-${index}`}>
                  {item.url.includes('iframe') ? (
                    <div
                      className="product-video-iframe"
                      dangerouslySetInnerHTML={{ __html: item.url }}
                    />
                  ) : (
                    <div className="product-video-iframe">
                      <video controls src={item.url} />
                    </div>
                  )}
                </SwiperSlide>
              ))
            : null}
        </Swiper>
        <div
          ref={prevRef}
          className="product-gallery-prev absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-xl transition-all duration-200 hover:bg-gray-100 ltr:-left-4 rtl:-right-4 md:-mt-5 md:h-9 md:w-9 ltr:md:-left-5 rtl:md:-right-5"
        >
          {isRTL ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </div>
        <div
          ref={nextRef}
          className="product-gallery-next absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-xl transition-all duration-200 hover:bg-gray-100 ltr:-right-4 rtl:-left-4 md:-mt-5 md:h-9 md:w-9 ltr:md:-right-5 rtl:md:-left-5"
        >
          {isRTL ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </div>
      {/* End of product main slider */}
      <div
        className={classNames(
          'relative mx-auto mt-5 max-w-md lg:mt-8 lg:pb-2',
          { hidden: hideThumbs }
        )}
      >
        <Swiper
          id="productGalleryThumbs"
          onSwiper={setThumbsSwiper}
          spaceBetween={20}
          watchSlidesProgress={true}
          freeMode={true}
          modules={[Navigation, Thumbs, FreeMode]}
          observer={true}
          observeParents={true}
          breakpoints={galleryCarouselBreakpoints}
        >
          {gallery?.map((item: any) => (
            <SwiperSlide
              key={`product-thumb-gallery-${item.id}`}
              className="!flex cursor-pointer items-center justify-center overflow-hidden rounded border border-border-200 border-opacity-75 hover:opacity-75"
            >
              <div className="relative h-20 w-20">
                <Image
                  src={item?.thumbnail ?? productPlaceholder}
                  alt={`Product thumb gallery ${item.id}`}
                  fill
                  className="object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
          {video?.length
            ? video.map((item: any, index: number) => (
                <SwiperSlide
                  key={`product-video-${index}`}
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded border border-border-200 border-opacity-75 hover:opacity-75"
                >
                  {/* <Image
                    src={productPlaceholder}
                    alt={`Product Video ${item.id}`}
                    width={80}
                    height={80}
                  /> */}
                  <div className="h-20 w-20" />
                  <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-400 text-white">
                    <PlayIcon className="h-4 w-4" />
                  </div>
                </SwiperSlide>
              ))
            : null}
        </Swiper>
      </div>
    </div>
  );
};
