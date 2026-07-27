import { listNavigationItemsAdmin } from "@/lib/cms/navigation";
import { createNavigationItem } from "@/app/admin/navigation/actions";
import { NavigationItemForm } from "@/components/admin/navigation/NavigationItemForm";

export default async function NewNavigationItemPage() {
  const items = await listNavigationItemsAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        New navigation item
      </h1>
      <NavigationItemForm otherItems={items} action={createNavigationItem} />
    </div>
  );
}
