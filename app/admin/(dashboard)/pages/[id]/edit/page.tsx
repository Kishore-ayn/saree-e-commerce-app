import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageAdmin } from "@/lib/cms/pages";
import { listMedia } from "@/lib/cms/media";
import { updatePage } from "@/app/admin/pages/actions";
import { PageForm } from "@/components/admin/pages/PageForm";
import { DeleteSectionButton } from "@/components/admin/pages/DeleteSectionButton";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [page, media] = await Promise.all([getPageAdmin(id), listMedia()]);

  if (!page) notFound();

  const updatePageWithId = updatePage.bind(null, id);

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Edit page</h1>
        <PageForm page={page} media={media} action={updatePageWithId} />
      </div>

      <div className="max-w-3xl space-y-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Sections</h2>
          <Link
            href={`/admin/pages/${page.id}/sections/new`}
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            Add section
          </Link>
        </div>

        {page.sections.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No sections yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              <tr>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Position</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
              {page.sections.map((section) => (
                <tr key={section.id}>
                  <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                    {section.sectionType}
                  </td>
                  <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{section.position}</td>
                  <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{section.status}</td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/admin/pages/${page.id}/sections/${section.id}/edit`}
                      className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                    >
                      Edit
                    </Link>
                    <DeleteSectionButton id={section.id} pageId={page.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
