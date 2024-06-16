import type {
  FaqsQueryOptions
} from '@/types';
import { NetworkStatus } from '@apollo/client';
import { useRouter } from 'next/router';
import { useFaQsQuery } from './gql/faqs.graphql';
import { LIMIT, LIMIT_HUNDRED } from '@/lib/constants';

export function useFAQs(options?: Partial<FaqsQueryOptions>) {
  const { query, locale } = useRouter();
  const {
    data,
    loading: isLoading,
    error,
    fetchMore,
    networkStatus,
  } = useFaQsQuery({
    variables: {
      language: locale,
      first: LIMIT_HUNDRED,
      search: 'faq_type:global;issued_by:Super Admin',
  },
    notifyOnNetworkStatusChange: true,
  });
  function handleLoadMore() {
    if (data?.faqs?.paginatorInfo.hasMorePages) {
      fetchMore({
        variables: {
          page: data?.faqs?.paginatorInfo?.currentPage + 1,
        },
      });
    }
  }
  return {
    faqs: data?.faqs?.data ?? [],
    paginatorInfo: data?.faqs?.paginatorInfo,
    isLoading,
    error,
    isLoadingMore: networkStatus === NetworkStatus.fetchMore,
    loadMore: handleLoadMore,
    hasMore: Boolean(data?.faqs?.paginatorInfo?.hasMorePages),
  };
}