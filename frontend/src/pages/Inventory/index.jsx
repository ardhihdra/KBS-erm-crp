import dayjs from 'dayjs';
import { Tag } from 'antd';
import configPage from './config';
import InventoryDataTableModule from '@/modules/InventoryModule/InventoryDataTableModule';

export default function Inventory() {
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const entityDisplayLabels = ['name', 'supplier.company'];
  const dataTableColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format('DD MMM YYYY');
      },
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      render: (supplier) => supplier?.company || '-',
    },
    {
      title: 'Item',
      dataIndex: 'item',
      render: (item) => item?.name || '-',
    },
    {
      title: 'Total',
      dataIndex: 'total',
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      render: (paymentStatus) => {
        let color =
          paymentStatus === 'unpaid'
            ? 'volcano'
            : paymentStatus === 'paid'
            ? 'green'
            : paymentStatus === 'overdue'
            ? 'red'
            : 'purple';

        return <Tag color={color}>{paymentStatus && paymentStatus.toUpperCase()}</Tag>;
      },
    },
  ];

  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return <InventoryDataTableModule config={config} />;
}
