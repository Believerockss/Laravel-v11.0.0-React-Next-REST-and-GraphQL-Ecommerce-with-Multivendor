import Logo from '@/components/ui/logo';
import cn from 'classnames';
import StaticMenu from './menu/static-menu';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { authorizationAtom } from '@/store/authorization-atom';
import SearchWithSuggestion from '@/components/ui/search/search-with-suggestion';
import Link from '@/components/ui/link';
import GroupsDropdownMenu from './menu/groups-menu';
import LanguageSwitcher from '@/components/ui/language-switcher';
import { drawerAtom } from '@/store/drawer-atom';
import Button from '../ui/button';
import { SearchIcon } from '../icons/search-icon';
import { CloseIcon } from '../icons/close-icon';

const CartCounterIconButton = dynamic(
  () => import('@/components/cart/cart-counter-icon-button'),
  { ssr: false }
);
const AuthorizedMenu = dynamic(() => import('./menu/authorized-menu'), {
  ssr: false,
});
const JoinButton = dynamic(() => import('./menu/join-button'), { ssr: false });

const HeaderMinimal = ({ layout }: { layout: string }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [_, setDrawerView] = useAtom(drawerAtom);
  const [displayMobileHeaderSearch, setDisplayMobileHeaderSearch] = useAtom(
    displayMobileHeaderSearchAtom
  );
  const [isAuthorize] = useAtom(authorizationAtom);
  const isMultilangEnable =
    process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
    !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;

  function handleSidebar(view: string) {
    setDrawerView({ display: true, view });
  }

  return (
    <header className={cn('site-header-with-search lg:h-22')}>
      <div
        className={cn(
          'fixed z-50 flex w-full items-center justify-between border-b border-border-200 bg-light px-5 py-3 shadow-sm transition-transform duration-300 lg:h-22 lg:py-5 lg:px-6 xl:px-8',
          {
            'px-5 lg:!px-7 xl:!px-10': layout === 'compact',
          }
        )}
      >
        <motion.button
          onClick={() => handleSidebar('MAIN_MENU_VIEW')}
          className="group hidden h-full w-6 shrink-0 items-center justify-center focus:text-accent focus:outline-0 ltr:mr-6 rtl:ml-6 lg:flex xl:hidden"
        >
          <span className="sr-only">{t('text-burger-menu')}</span>
          <div className="flex w-full flex-col space-y-1.5">
            <span className="h-0.5 w-1/2 rounded bg-gray-600 transition-all group-hover:w-full" />
            <span className="h-0.5 w-full rounded bg-gray-600 transition-all group-hover:w-3/4" />
            <span className="h-0.5 w-3/4 rounded bg-gray-600 transition-all group-hover:w-full" />
          </div>
        </motion.button>
        <div className="flex w-full items-center ltr:mr-auto rtl:ml-auto lg:w-auto">
          {/* <Logo className="mx-auto lg:mx-0" /> */}
          <Logo
            className={`${
              !isMultilangEnable ? 'mx-auto lg:mx-0' : 'ltr:ml-0 rtl:mr-0'
            }`}
          />

          {/* {isMultilangEnable ? (
            <div className="ltr:ml-auto rtl:mr-auto lg:hidden">
              <LanguageSwitcher />
            </div>
          ) : (
            ''
          )} */}

          <div className="hidden shrink-0 items-center space-x-7 ltr:ml-10 ltr:mr-auto rtl:mr-10 rtl:ml-auto rtl:space-x-reverse lg:flex 2xl:space-x-10">
            <ul className="hidden shrink-0 items-center space-x-7 rtl:space-x-reverse xl:flex 2xl:space-x-10">
              <StaticMenu />
            </ul>
          </div>
        </div>

        {displayMobileHeaderSearch && (
          <div className="absolute top-0 z-20 flex h-full w-full items-center justify-center space-x-4 border-b-accent-300 bg-light px-5 py-1.5 backdrop-blur ltr:left-0 rtl:right-0 rtl:space-x-reverse lg:border lg:bg-opacity-30">
            <SearchWithSuggestion
              label={t('text-search-label')}
              variant="minimal"
              className="lg:max-w-3xl"
              inputClassName="lg:border-accent-400"
              seeMore={true}
            />
            <Button
              variant="custom"
              onClick={() => setDisplayMobileHeaderSearch((prev) => !prev)}
              className="hidden border border-accent-400 bg-gray-100 !px-4 text-accent lg:inline-flex"
            >
              <CloseIcon className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* {layout === 'compact' && (
          <div className="hidden w-full px-8 mx-auto xl:flex xl:w-6/12 xl:px-10 xl:rtl:w-4/12 2xl:rtl:w-5/12">
            <SearchWithSuggestion
              label={t('text-search-label')}
              variant="minimal"
              seeMore={true}
            />
          </div>
        )} */}

        <div className="flex shrink-0 items-center space-x-4 rtl:space-x-reverse sm:space-x-6">
          <div
            className={cn(
              'hidden',
              layout === 'compact' ? 'lg:inline-flex' : 'sm:inline-flex'
            )}
          >
            <GroupsDropdownMenu variant="minimal" />
          </div>
          {layout === 'compact' ? (
            <Button
              variant="custom"
              className="hidden h-[38px] w-[38px] items-center  gap-2 rounded-full border border-border-200 bg-light !p-1 text-sm !font-normal focus:!shadow-none focus:!ring-0 md:text-base lg:!flex"
              onClick={() => setDisplayMobileHeaderSearch((prev) => !prev)}
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          ) : null}

          {isMultilangEnable ? (
            <div className="ms-auto lg:me-5 xl:me-8 2xl:me-10 flex-shrink-0">
              <LanguageSwitcher />
            </div>
          ) : null}
          <CartCounterIconButton />
          <div className="flex items-center lg:space-x-4 rtl:lg:space-x-reverse">
            <div className="hidden lg:inline-flex">
              {isAuthorize ? <AuthorizedMenu /> : <JoinButton />}
            </div>
            <Link
              href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/register`}
              variant="button"
              target="_blank"
            >
              {t('text-become-seller')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderMinimal;
