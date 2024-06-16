// import Image from 'next/image';
import Link from '@/components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@/settings/site.settings';
// import { useSettings } from '@/contexts/settings.context';
import { useAtom } from 'jotai';
import { miniSidebarInitialValue } from '@/utils/constants';
import { useWindowSize } from '@/utils/use-window-size';
import { RESPONSIVE_WIDTH } from '@/utils/constants';
import { LogoSVG } from '@/components/icons/logo';
import LogoText from '@/components/icons/logo-text';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  // @ts-ignore
  ...props
}) => {
  // const { logo, siteTitle } = useSettings();
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { width } = useWindowSize();
  return (
    // <Link
    //   href={siteSettings.logo.href}
    //   className={cn('inline-flex', className)}
    //   {...props}
    // >
    //   <span
    //     className="relative overflow-hidden"
    //     style={{
    //       width: siteSettings.logo.width,
    //       height: siteSettings.logo.height,
    //     }}
    //   >
    //     <Image
    //       src={logo?.original ?? siteSettings.logo.url}
    //       alt={siteTitle ?? siteSettings.logo.alt}
    //       fill
    //       sizes="(max-width: 768px) 100vw"
    //       className="object-contain"
    //       loading="eager"
    //     />
    //   </span>
    // </Link>
    <Link
      href={siteSettings?.logo?.href}
      className={cn('inline-flex items-center gap-3', className)}
    >
      <LogoSVG className="h-8 w-8" />
      {miniSidebar && width >= RESPONSIVE_WIDTH ? (
        ''
      ) : (
        <LogoText className="hidden transition-[width] duration-300 sm:inline-flex" />
      )}
    </Link>
  );
};

export default Logo;
