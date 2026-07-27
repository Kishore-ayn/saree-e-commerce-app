import { notFound } from "next/navigation";
import { getAreaAdmin } from "@/lib/cms/areas";
import { listCollectionsForPicker } from "@/lib/cms/products";
import { updateArea } from "@/app/admin/areas/actions";
import { AreaForm } from "@/components/admin/areas/AreaForm";

export default async function EditAreaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [area, collections] = await Promise.all([
    getAreaAdmin(id),
    listCollectionsForPicker(),
  ]);

  if (!area) notFound();

  const updateAreaWithId = updateArea.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Edit area</h1>
      <AreaForm area={area} collections={collections} action={updateAreaWithId} />
    </div>
  );
}
