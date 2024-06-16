import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { useModalAction } from '@/components/ui/modal/modal.context';

type ShortDescriptionProps = {
  content: string;
  character: number;
  buttonText?: string;
  modalTitle?: string;
  className?: string;
};

const ShortDescription: React.FC<ShortDescriptionProps> = ({
  content,
  className,
  character = 90,
  buttonText = 'Read More',
  modalTitle = 'Description',
  ...rest
}) => {
  const { openModal } = useModalAction();
  const openDescriptionModal = () => {
    return openModal('DESCRIPTION_VIEW', {
      content,
      title: modalTitle,
    });
  };
  return (
    <>
      {content ? (
        <div
          {...rest}
          className={twMerge(
            classNames('text-sm leading-[171.429%] text-[#666]', className)
          )}
        >
          {content?.length < character
            ? content
            : content.substring(0, character) + '...'}
          {buttonText && content?.length >= character ? (
            <span
              className="cursor-pointer font-semibold text-accent"
              onClick={openDescriptionModal}
            >
              {buttonText}
            </span>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default ShortDescription;
