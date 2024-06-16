import { StoreNoticeQueryOptions } from '@/types';
import { useRouter } from 'next/router';
import { useStoreNoticesQuery } from './gql/store-notice.graphql';

export const useStoreNotices = ({ shop_id }: StoreNoticeQueryOptions) => {
  const { locale } = useRouter();
  const { data, loading, error } = useStoreNoticesQuery({
    variables: {
      shop_id: shop_id,
      language: locale,
      first: 10,
      orderBy: 'effective_from',
      sortedBy: 'ASC',
      page: 1,
    },
    notifyOnNetworkStatusChange: true,
  });

  return {
    storeNotices: data?.storeNotices?.data ?? [],
    error,
    loading,
  };
};
