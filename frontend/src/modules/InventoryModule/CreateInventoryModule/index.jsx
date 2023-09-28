import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import InventoryForm from '@/modules/InventoryModule/Forms/InventoryForm';

export default function CreateInventoryModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={InventoryForm} />
    </ErpLayout>
  );
}
