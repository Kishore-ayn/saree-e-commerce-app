import { listMedia } from "@/lib/cms/media";
import { createPage } from "@/app/admin/pages/actions";
import { PageForm } from "@/components/admin/pages/PageForm";

export default async function NewPagePage() {
  const media = await listMedia();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">New page</h1>
      <PageForm media={media} action={createPage} />
    </div>
  );
}
