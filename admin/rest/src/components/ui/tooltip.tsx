import cn from 'classnames';
import { InfoIcon } from '@/components/icons/info-icon';
import { HTMLAttributes } from 'react';
export interface Props extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
  content?: string;
}
const Tooltip: React.FC<Props> = ({ className = 'mb-3', content = '' }) => {
  return (
    <span
      className={cn(
        'custom-tooltip relative',
        className
      )}
      //@ts-ignore
      content={content}
    ><InfoIcon className='w-3.5 h-3.5' /></span>
  );
};

export default Tooltip;
