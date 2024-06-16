import { TermsAndConditions } from '@/types';

const TermsAndConditionsDetails = ({
  termsAndConditions,
}: {
  termsAndConditions: TermsAndConditions;
}) => {
  return (
    <div className="rounded bg-white px-8 py-10 shadow">
      {termsAndConditions?.title ? (
        <h3 className="mb-4 text-[22px] font-bold">
          {termsAndConditions?.title}
        </h3>
      ) : (
        ''
      )}

      {termsAndConditions?.description ? (
        <p className="text-[15px] leading-[1.75em] text-[#5A5A5A]">
          {termsAndConditions?.description}
        </p>
      ) : (
        ''
      )}
    </div>
  );
};

export default TermsAndConditionsDetails;
