import { RefundPolicy } from "__generated__/__types__";

const RefundPolicyDetails = ({
  refundPolicy,
}: {
  refundPolicy: RefundPolicy;
}) => {
  return (
    <div className="rounded bg-white px-8 py-10 shadow">
      {refundPolicy?.title ? (
        <h3 className="mb-4 text-[22px] font-bold">
          {refundPolicy?.title}
        </h3>
      ) : (
        ''
      )}

      {refundPolicy?.description ? (
        <p className="text-[15px] leading-[1.75em] text-[#5A5A5A]">
          {refundPolicy?.description}
        </p>
      ) : (
        ''
      )}
    </div>
  );
};

export default RefundPolicyDetails;
