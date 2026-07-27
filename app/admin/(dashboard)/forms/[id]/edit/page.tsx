import { notFound } from "next/navigation";
import { getFormAdmin } from "@/lib/cms/forms";
import { updateForm } from "@/app/admin/forms/actions";
import { FormDefinitionForm } from "@/components/admin/forms/FormDefinitionForm";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getFormAdmin(id);
  if (!form) notFound();

  const updateFormWithId = updateForm.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Edit form</h1>
      <FormDefinitionForm form={form} action={updateFormWithId} />
    </div>
  );
}
