import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { addApolloState, initializeApollo } from './client';
import { GroupsDocument } from './gql/groups.graphql';
import { SettingsDocument } from './gql/settings.graphql';
import { FaQsDocument, FaQsQuery } from './gql/faqs.graphql';
import { LIMIT, LIMIT_HUNDRED } from '@/lib/constants';

export const getStaticProps: GetStaticProps = async ({ locale, ...rest }) => {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: SettingsDocument,
    variables: {
      language: locale,
    },
  });
  await apolloClient.query({
    query: GroupsDocument,
    variables: {
      language: locale,
    },
  });
  await apolloClient.query<FaQsQuery>({
    query: FaQsDocument,
    variables: {
      language: locale,
      first: LIMIT_HUNDRED,
      search: 'faq_type:global;issued_by:Super Admin',
    },
  });
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
  });
};
