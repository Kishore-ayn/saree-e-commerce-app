import { createForm } from "@/app/admin/forms/actions";
import { FormDefinitionForm } from "@/components/admin/forms/FormDefinitionForm";

export default function NewFormPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">New form</h1>
      <FormDefinitionForm action={createForm} />
    </div>
  );
}
