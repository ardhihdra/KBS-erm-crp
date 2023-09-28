import uniqueId from '@/utils/uinqueId';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputNumber, PageHeader } from 'antd';
import SetingsSection from './components/SetingsSection';
import SelectCurrency from './components/SelectCurrency';

export default function PaymentSettings() {
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title="Payment Settings"
        ghost={false}
        extra={[
          <Button key={`${uniqueId()}`} type="primary" disabled icon={<SyncOutlined />}>
            Update
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Divider></Divider>
      <Form>
        <SetingsSection title="information" description="Update your Currency and Tax">
          <Form.Item label="Currency">
            <SelectCurrency />
          </Form.Item>
          <Form.Item label="Tax">
            <InputNumber addonBefore={'%'} placeholder="0" />
          </Form.Item>
        </SetingsSection>

        <SetingsSection title="Other details" description="Add your company identifying numbers">
          <Form.Item label="RC">
            <Input placeholder="xxxxxx" />
          </Form.Item>
          <Form.Item label="NIF">
            <Input placeholder="xxxxxx" />
          </Form.Item>
          <Form.Item label="AI">
            <Input placeholder="xxxxxx" />
          </Form.Item>
        </SetingsSection>
      </Form>
    </>
  );
}
