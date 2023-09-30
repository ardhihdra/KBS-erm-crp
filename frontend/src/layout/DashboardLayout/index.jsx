import React from 'react';

import { Layout } from 'antd';

const { Content } = Layout;

export default function DashboardLayout({ children }) {
  return (
    <Layout className="site-layout">
      <Content
        style={{
          padding: '20px 30px',
          margin: '50px auto',
          width: '100%',
          maxWidth: '1100px',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}
