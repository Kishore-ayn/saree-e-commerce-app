import {
  listAreasForPicker,
  listCollectionsForRelatedPicker,
} from "@/lib/cms/collections";
import { listMedia } from "@/lib/cms/media";
import { createCollection } from "@/app/admin/collections/actions";
import { CollectionForm } from "@/components/admin/collections/CollectionForm";

export default async function NewCollectionPage() {
  const [areas, relatedCollections, media] = await Promise.all([
    listAreasForPicker(),
    listCollectionsForRelatedPicker(),
    listMedia(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        New collection
      </h1>
      <CollectionForm
        areas={areas}
        relatedCollections={relatedCollections}
        media={media}
        action={createCollection}
      />
    </div>
  );
}
