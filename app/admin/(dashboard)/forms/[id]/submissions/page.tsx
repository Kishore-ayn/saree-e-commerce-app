import { notFound } from "next/navigation";
import { getFormAdmin, listSubmissionsForForm } from "@/lib/cms/forms";
import { SubmissionRow } from "@/components/admin/forms/SubmissionRow";

export default async function FormSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getFormAdmin(id);
  if (!form) notFound();

  const submissions = await listSubmissionsForForm(id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Submissions — {form.name}
      </h1>

      {submissions.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No submissions yet.</p>
      ) : (
        <div className="max-w-3xl space-y-3">
          {submissions.map((submission) => (
            <SubmissionRow key={submission.id} submission={submission} formId={id} />
          ))}
        </div>
      )}
    </div>
  );
}
