import { notFound } from "next/navigation";
import { getNavigationItemAdmin, listNavigationItemsAdmin } from "@/lib/cms/navigation";
import { updateNavigationItem } from "@/app/admin/navigation/actions";
import { NavigationItemForm } from "@/components/admin/navigation/NavigationItemForm";

export default async function EditNavigationItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, allItems] = await Promise.all([
    getNavigationItemAdmin(id),
    listNavigationItemsAdmin(),
  ]);

  if (!item) notFound();

  const otherItems = allItems.filter((i) => i.id !== id);
  const updateNavigationItemWithId = updateNavigationItem.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Edit navigation item
      </h1>
      <NavigationItemForm item={item} otherItems={otherItems} action={updateNavigationItemWithId} />
    </div>
  );
}
