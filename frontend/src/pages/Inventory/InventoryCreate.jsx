import CreateInventoryModule from '@/modules/InventoryModule/CreateInventoryModule';
import configPage from './config';

const customConfig = {
  /*your custom config*/
};
const config = {
  ...configPage,
  customConfig,
};

export default function InventoryCreate() {
  return <CreateInventoryModule config={config} />;
}
