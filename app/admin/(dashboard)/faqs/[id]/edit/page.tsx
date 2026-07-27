import { notFound } from "next/navigation";
import { getFaqAdmin } from "@/lib/cms/faqs";
import { listAreasForPicker } from "@/lib/cms/collections";
import { updateFaq } from "@/app/admin/faqs/actions";
import { FaqForm } from "@/components/admin/faqs/FaqForm";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [faq, areas] = await Promise.all([getFaqAdmin(id), listAreasForPicker()]);

  if (!faq) notFound();

  const updateFaqWithId = updateFaq.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Edit FAQ</h1>
      <FaqForm faq={faq} areas={areas} action={updateFaqWithId} />
    </div>
  );
}
