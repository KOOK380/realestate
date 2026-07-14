import { getProperties } from "@/lib/data";
import { PropertiesTable } from "@/components/admin/properties-table";

export default async function AdminPropertiesPage() {
  const { items } = await getProperties({}, 1, 100);
  return <PropertiesTable items={items} />;
}
