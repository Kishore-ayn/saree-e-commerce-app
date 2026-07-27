import { listCollectionsForPicker } from "@/lib/cms/products";
import { createArea } from "@/app/admin/areas/actions";
import { AreaForm } from "@/components/admin/areas/AreaForm";

export default async function NewAreaPage() {
  const collections = await listCollectionsForPicker();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">New area</h1>
      <AreaForm collections={collections} action={createArea} />
    </div>
  );
}
