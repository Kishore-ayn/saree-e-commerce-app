import { listMedia } from "@/lib/cms/media";
import { MediaUploadForm } from "@/components/admin/media/MediaUploadForm";
import { MediaGrid } from "@/components/admin/media/MediaGrid";

export default async function AdminMediaPage() {
  const items = await listMedia();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Media Library
      </h1>
      <MediaUploadForm />
      <MediaGrid items={items} />
    </div>
  );
}
