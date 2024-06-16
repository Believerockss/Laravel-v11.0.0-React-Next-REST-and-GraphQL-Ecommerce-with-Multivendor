import ActionButtons from '@/components/common/action-buttons';
import { NoDataFound } from '@/components/icons/no-data-found';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { AlignType, Table } from '@/components/ui/table';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import {
  FlashSale,
  FlashSalePaginator,
  SortOrder,
} from '__generated__/__types__';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import debounce from 'lodash/debounce';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  flashSale: FlashSalePaginator['data'] | null | undefined;
  onPagination: (current: number) => void;
  refetch: Function;
  paginatorInfo: FlashSalePaginator['paginatorInfo'];
};

const FlashSaleList = ({
  flashSale,
  onPagination,
  refetch,
  paginatorInfo,
}: IProps) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState<SortOrder>(SortOrder.Desc);
  const [column, setColumn] = useState<string>();

  const debouncedHeaderClick = useMemo(
    () =>
      debounce((value) => {
        setColumn(value);
        setOrder(order === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc);
        refetch({
          orderBy: value,
          sortedBy: order,
        });
      }, 500),
    [order]
  );

  const onHeaderClick = (value: string | undefined) => ({
    onClick: () => {
      debouncedHeaderClick(value);
    },
  });

  const columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-id')}
          ascending={order === SortOrder.Asc && column === 'id'}
          isActive={column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: 'left' as AlignType,
      width: 120,
      onHeaderCell: () => onHeaderClick('id'),
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={order === SortOrder.Asc && column === 'title'}
          isActive={column === 'title'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'title',
      key: 'title',
      align: 'left' as AlignType,
      ellipsis: true,
      width: 200,
      onHeaderCell: () => onHeaderClick('title'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-description')}
          ascending={order === SortOrder.Asc && column === 'description'}
          isActive={column === 'description'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'description',
      key: 'description',
      align: 'left' as AlignType,
      width: 500,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('description'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-start-date')}
          ascending={order === SortOrder.Asc && column === 'start_date'}
          isActive={column === 'start_date'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'start_date',
      key: 'start_date',
      align: 'center' as AlignType,
      onHeaderCell: () => onHeaderClick('start_date'),
      render: (start_date: string) => {
        const startDate = new Date(start_date!);
        const month = startDate.getMonth() + 1;
        const year = startDate.getFullYear();
        const date = startDate.getDate();
        const start = month + '/' + date + '/' + year;
        return <span className="whitespace-nowrap">{start}</span>;
      },
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-end-date')}
          ascending={order === SortOrder.Asc && column === 'end_date'}
          isActive={column === 'end_date'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'end_date',
      key: 'end_date',
      align: 'center' as AlignType,
      onHeaderCell: () => onHeaderClick('end_date'),
      render: (end_date: string) => {
        const endDate = new Date(end_date!);
        const month = endDate.getMonth() + 1;
        const year = endDate.getFullYear();
        const date = endDate.getDate();
        const end = month + '/' + date + '/' + year;
        return <span className="whitespace-nowrap">{end}</span>;
      },
    },
    {
      title: t('table:table-item-details'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center' as AlignType,
      width: 150,
      render: (id: string, { slug }: any) => {
        return (
          <ActionButtons
            id={id}
            detailsUrl={Routes?.flashSale?.details(slug)}
          />
        );
      },
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: 'right' as AlignType,
      width: 150,
      render: (slug: string, record: FlashSale) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_FLASH_SALE"
          routes={Routes?.flashSale}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={flashSale as FlashSalePaginator['data']}
          rowKey="id"
          scroll={{ x: 900 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo?.total}
            current={paginatorInfo?.currentPage}
            pageSize={paginatorInfo?.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default FlashSaleList;
