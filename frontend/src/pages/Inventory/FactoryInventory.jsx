import React, { useEffect, useRef, useState } from 'react';
import { Tag, Row, Col, Select } from 'antd';
import { useHistory } from 'react-router-dom';

import { DashboardLayout } from '@/layout';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import SummaryCard from '@/modules/DashboardModule/components/SummaryCard';
import CustomerPreviewCard from '@/modules/DashboardModule/components/CustomerPreviewCard';
import {
  CHART_DUMMY,
  FACTORY_LIST,
  PRODUCTS1,
  PRODUCTS2,
  PRODUCTS3,
  PRODUCT_LIST,
  SUBPRODUCT_LIST,
} from '@/utils/dummy.data';
import { Chart } from 'chart.js/auto';
import { dateToLocale } from '@/utils/helpers';
import RecentTable from '@/components/RecentTable';

export function formatCurrency(value) {
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const renderMoney = (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const dataTableColumns = [
  {
    title: 'Date',
    dataIndex: 'date',
    render: (date) => dateToLocale(date),
  },
  {
    title: 'Invoice',
    dataIndex: ['code'],
    // dataIndex: ['client', 'company'],
  },
  {
    title: 'Kurs',
    dataIndex: ['exchangeRate'],
    // dataIndex: ['client', 'company'],
  },
  {
    title: 'Value',
    dataIndex: 'total',

    render: (total) => renderMoney(total),
  },
  {
    title: 'Income USD',
    dataIndex: ['subTotal'],
    // dataIndex: ['client', 'company'],
    render: (total) => renderMoney(total),
  },
  {
    title: 'Balance',
    render: (data) => {
      const result = data.total - data.subTotal;
      return result >= 0 ? renderMoney(result) : `(${renderMoney(result)})`;
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status) => {
      let color = status === 'close' ? 'volcano' : 'green';

      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
];

export default function FactoryInventory() {
  const { result: invoiceResult, isLoading: invoiceLoading } = useFetch(() =>
    request.summary({ entity: 'invoice' })
  );

  const { result: quoteResult, isLoading: quoteLoading } = useFetch(() =>
    request.summary({ entity: 'quote' })
  );

  const { result: offerResult, isLoading: offerLoading } = useFetch(() =>
    request.summary({ entity: 'offer' })
  );

  const { result: paymentResult, isLoading: paymentLoading } = useFetch(() =>
    request.summary({ entity: 'payment/invoice' })
  );

  const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
    request.summary({ entity: 'client' })
  );
  const [productsFilter, setProductsFilter] = useState([]);
  const [subProductsFilter, setSubProductsFilter] = useState([]);
  const [factoriesFilter, setFactoriesFilter] = useState([]);

  const history = useHistory();
  const queryParams = new URLSearchParams(history.location.search);
  const factoryParam = queryParams.get('f');
  const chartRef = useRef();

  useEffect(() => {
    initChart();
  }, [productsFilter, subProductsFilter]);

  function initChart() {
    const ctx = document.getElementById('inventory-chart');
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const datasetsOptions = {
      borderWidth: 1,
      cubicInterpolationMode: 'monotone',
    };
    let dataSource = JSON.parse(JSON.stringify(CHART_DUMMY));

    if (productsFilter.length)
      dataSource = dataSource.filter((dt) => productsFilter.includes(dt.name.toUpperCase()));

    if (subProductsFilter.length)
      dataSource = dataSource.map((dt) => {
        dt.changes = dt.changes.map((dtc) => {
          dtc.total = Math.max(
            0,
            dtc.total - subProductsFilter.length * Math.round(Math.random() * 30)
          );
          return dtc;
        });
        return dt;
      });

    let datasets = dataSource.map((cd) => ({
      label: cd.name,
      data: cd.changes.map((cdc) => cdc.total),
      ...datasetsOptions,
    }));

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: CHART_DUMMY[0].changes.map((cd) => dateToLocale(cd.date)),
        datasets: datasets,
      },
      interaction: {
        intersect: false,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
      plugins: {},
    });
    chartRef.current = chart;
  }

  return (
    <DashboardLayout>
      <h2>{factoryParam} Performance</h2>
      <div
        className="shadow"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '1rem',
          backgroundColor: '#f0f5ff',
          border: 'solid 1px #d6e4ff',
        }}
      >
        <div>
          <h4 style={{ marginBottom: 4, textTransform: 'capitalize' }}>Products</h4>
          <Select
            loading={false}
            showSearch
            allowClear
            mode="multiple"
            placeholder={'Filter by Products'}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            notFoundContent={false ? '... Searching' : 'Not Found'}
            value={productsFilter}
            onSearch={() => {}}
            onChange={(newValue) => {
              setProductsFilter(newValue);
            }}
            style={{ width: '240px' }}
          >
            {PRODUCT_LIST.map((pl) => (
              <Select.Option key={pl} value={pl}>
                {pl}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div>
          <h4 style={{ marginBottom: 4, textTransform: 'capitalize' }}>Sub Products</h4>
          <Select
            loading={false}
            showSearch
            allowClear
            mode="multiple"
            placeholder={'Filter by Sub Products'}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            notFoundContent={false ? '... Searching' : 'Not Found'}
            value={subProductsFilter}
            onSearch={() => {}}
            onChange={(newValue) => {
              setSubProductsFilter(newValue);
            }}
            style={{ width: '240px' }}
          >
            {SUBPRODUCT_LIST.map((pl) => (
              <Select.Option key={pl} value={pl}>
                {pl}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space30"></div>

      <Row gutter={[24, 24]}>
        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
          <div className="whiteBox shadow" style={{ minHeight: '380px', height: '100%' }}>
            <Row className="pad10" gutter={[0, 0]}>
              <canvas id="inventory-chart"></canvas>
            </Row>
          </div>
        </Col>
        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
          <CustomerPreviewCard isLoading={clientLoading} activeCustomer={40} newCustomer={40} />
        </Col>
      </Row>

      <div className="space30"></div>

      <Row gutter={[24, 24]}>
        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Recent Invoices</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
