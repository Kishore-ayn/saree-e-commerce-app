import { notFound } from "next/navigation";
import { getSectionAdmin } from "@/lib/cms/pages";
import { updateSection } from "@/app/admin/pages/sections-actions";
import { SectionForm } from "@/components/admin/pages/SectionForm";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ id: string; sectionId: string }>;
}) {
  const { id, sectionId } = await params;
  const section = await getSectionAdmin(sectionId);
  if (!section || section.pageId !== id) notFound();

  const updateSectionWithIds = updateSection.bind(null, sectionId, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Edit section</h1>
      <SectionForm section={section} action={updateSectionWithIds} />
    </div>
  );
}
