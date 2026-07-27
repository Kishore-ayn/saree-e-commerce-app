import Link from "next/link";
import { listFaqsAdmin } from "@/lib/cms/faqs";
import { DeleteFaqButton } from "@/components/admin/faqs/DeleteFaqButton";

export default async function AdminFaqsPage() {
  const faqs = await listFaqsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">FAQs</h1>
        <Link
          href="/admin/faqs/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          New FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No FAQs yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <tr>
              <th className="py-2 pr-4">Question</th>
              <th className="py-2 pr-4">Scope</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                  {faq.question}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                  {faq.areaName ?? "Global"}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{faq.status}</td>
                <td className="py-2 text-right">
                  <Link
                    href={`/admin/faqs/${faq.id}/edit`}
                    className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                  >
                    Edit
                  </Link>
                  <DeleteFaqButton id={faq.id} question={faq.question} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
