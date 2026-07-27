import { notFound } from "next/navigation";
import { getPageAdmin } from "@/lib/cms/pages";
import { createSection } from "@/app/admin/pages/sections-actions";
import { SectionForm } from "@/components/admin/pages/SectionForm";

export default async function NewSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPageAdmin(id);
  if (!page) notFound();

  const createSectionForPage = createSection.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Add section to &quot;{page.title}&quot;
      </h1>
      <SectionForm action={createSectionForPage} />
    </div>
  );
}
