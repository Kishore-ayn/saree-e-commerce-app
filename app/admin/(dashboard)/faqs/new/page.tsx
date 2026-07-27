import { listAreasForPicker } from "@/lib/cms/collections";
import { createFaq } from "@/app/admin/faqs/actions";
import { FaqForm } from "@/components/admin/faqs/FaqForm";

export default async function NewFaqPage() {
  const areas = await listAreasForPicker();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">New FAQ</h1>
      <FaqForm areas={areas} action={createFaq} />
    </div>
  );
}
