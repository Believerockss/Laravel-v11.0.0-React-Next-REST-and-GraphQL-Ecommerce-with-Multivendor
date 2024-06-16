import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import DrawerWrapper from '@/components/ui/drawer/drawer-wrapper';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { siteSettings } from '@/config/site';
import Link from '@/components/ui/link';

export default function MobileMainMenu() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [_, closeSidebar] = useAtom(drawerAtom);
  const { headerLinks } = siteSettings;

  // function handleClick(path: string) {
  //   router.push(path);
  //   closeSidebar({ display: false, view: '' });
  // }

  return (
    <DrawerWrapper>
      <ul className="grow">
        {headerLinks?.map(({ href, label }) => (
          <li key={`${href}${label}`}>
            <Link
              href={href}
              className="flex cursor-pointer items-center py-3 px-5 text-sm font-semibold capitalize text-heading transition duration-200 hover:text-accent md:px-6"
              title={t(label)}
              onClick={() => closeSidebar({ display: false, view: '' })}
            >
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </DrawerWrapper>
  );
}
