import Banner from '@/components/banners/banner';
import Categories from '@/components/categories/categories';
import { Element } from 'react-scroll';
import ProductGridHome from '@/components/products/grids/home';
import FilterBar from './filter-bar';
import type { HomePageProps } from '@/types';

export default function Modern({ variables }: HomePageProps) {
  return (
    <div className="flex flex-1 bg-gray-100">
      <div className="sticky top-32 hidden h-full bg-gray-100 lg:w-[380px] xl:top-24 xl:block 2xl:top-22">
        <Categories layout="modern" variables={variables.categories} />
      </div>
      <main className="block w-full lg:pt-20 xl:mt-8 xl:overflow-hidden ltr:xl:pl-0 ltr:xl:pr-5 rtl:xl:pr-0 rtl:xl:pl-5 2xl:mt-6">
        <div className="border border-border-200">
          <Banner layout="modern" variables={variables.types} />
        </div>
        <FilterBar variables={variables.categories} />
        <Element name="grid" className="px-4 xl:px-0">
          <ProductGridHome
            className="pt-6 pb-20 lg:py-6"
            variables={variables.products}
          />
        </Element>
      </main>
    </div>
  );
}
