import React, { useState } from 'react';
import { Tag, Row, Col, Select } from 'antd';

import { DashboardLayout } from '@/layout';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import RecentTable from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';
import {
  FACTORY_LIST,
  PRODUCTS1,
  PRODUCTS2,
  PRODUCTS3,
  PRODUCT_LIST,
  SUBPRODUCT_LIST,
} from './dummy.data';

const dataTableColumns = [
  {
    title: 'N#',
    dataIndex: 'number',
  },
  {
    title: 'Client',
    dataIndex: ['client', 'company'],
  },

  {
    title: 'Total',
    dataIndex: 'total',

    render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status) => {
      let color = status === 'Draft' ? 'volcano' : 'green';

      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
];

function formatCurrency(value) {
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default function DashboardModule() {
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

  const entityData = [
    {
      result: {
        factory: 'JCL',
        products: PRODUCTS1,
      },
      isLoading: invoiceLoading,
      entity: 'JCL',
    },
    {
      result: {
        factory: 'KBS',
        products: PRODUCTS2,
      },
      isLoading: quoteLoading,
      entity: 'KBS',
    },
    {
      result: {
        factory: 'LBS-L',
        products: PRODUCTS3,
      },
      isLoading: offerLoading,
      entity: 'LBL-L',
    },
    {
      result: {
        factory: 'LBS',
        products: [PRODUCTS2[1], PRODUCTS2[2], PRODUCTS2[3], PRODUCTS3[0]],
      },
      isLoading: paymentLoading,
      entity: 'LBL',
    },
    {
      result: {
        factory: 'KCN',
        products: [PRODUCTS2[3], PRODUCTS2[0], PRODUCTS2[0], PRODUCTS3[1]],
      },
      isLoading: paymentLoading,
      entity: 'KCN',
    },
  ];

  const factoryCards = entityData.map((data, index) => {
    const { result, entity, isLoading } = data;

    if (entity === 'offer') return null;
    if (factoriesFilter.length && !factoriesFilter.includes(entity)) return null;

    if (productsFilter.length) {
      result.products = result.products.filter((rp) =>
        productsFilter.includes(rp.name.toUpperCase())
      );
    }

    if (subProductsFilter.length) {
      result.products = result.products.map((rp) => {
        rp.subProducts = rp.subProducts.filter((rsp) =>
          subProductsFilter.includes(rsp.name.toUpperCase())
        );
        return rp;
      });
    }

    return (
      <SummaryCard
        key={index}
        title={data?.entity === 'paymentInvoice' ? 'Payment' : data?.entity}
        tagColor={'green'}
        isLoading={isLoading}
        tagContents={result.products}
      />
    );
  });

  const statisticCards = <></>;
  // entityData.map((data, index) => {
  //   const { result, entity, isLoading } = data;

  //   if (entity === 'payment') return null;

  //   return (
  //     <PreviewCard
  //       key={index}
  //       title={`${data?.entity.charAt(0).toUpperCase() + data?.entity.slice(1)} Preview`}
  //       isLoading={isLoading}
  //       statistics={
  //         !isLoading &&
  //         result?.performance?.map((item) => ({
  //           tag: item?.status,
  //           color: 'blue',
  //           value: item?.percentage,
  //         }))
  //       }
  //     />
  //   );
  // });

  return (
    <DashboardLayout>
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
          <h4 style={{ marginBottom: 4, textTransform: 'capitalize' }}>Factory</h4>
          <Select
            loading={false}
            showSearch
            allowClear
            mode="multiple"
            placeholder={'Filter by Factory'}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            notFoundContent={false ? '... Searching' : 'Not Found'}
            value={factoriesFilter}
            onSearch={() => {}}
            onChange={(newValue) => {
              setFactoriesFilter(newValue);
            }}
            style={{ width: '200px' }}
          >
            {FACTORY_LIST.map((pl) => (
              <Select.Option key={pl} value={pl}>
                {pl}
              </Select.Option>
            ))}
          </Select>
        </div>
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

      <div
        className="pad15 strong"
        style={{ textAlign: 'center', justifyContent: 'center', marginTop: '2rem' }}
      >
        <h3 style={{ color: '#22075e', marginBottom: 0, textTransform: 'capitalize' }}>
          Inventory
        </h3>
      </div>
      <Row gutter={[24, 24]}>{factoryCards}</Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
          <div className="whiteBox shadow" style={{ minHeight: '380px', height: '100%' }}>
            <Row className="pad10" gutter={[0, 0]}>
              {statisticCards}
            </Row>
          </div>
        </Col>
        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
          <CustomerPreviewCard
            isLoading={clientLoading}
            activeCustomer={clientResult?.active}
            newCustomer={clientResult?.new}
          />
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 12 }}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Recent Invoices</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>

        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 12 }}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Recent Quotes</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
