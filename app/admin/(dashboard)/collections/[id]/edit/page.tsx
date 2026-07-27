import { notFound } from "next/navigation";
import {
  getCollectionAdmin,
  listAreasForPicker,
  listCollectionsForRelatedPicker,
} from "@/lib/cms/collections";
import { listMedia } from "@/lib/cms/media";
import { updateCollection } from "@/app/admin/collections/actions";
import { CollectionForm } from "@/components/admin/collections/CollectionForm";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [collection, areas, relatedCollections, media] = await Promise.all([
    getCollectionAdmin(id),
    listAreasForPicker(),
    listCollectionsForRelatedPicker(id),
    listMedia(),
  ]);

  if (!collection) notFound();

  const updateCollectionWithId = updateCollection.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Edit collection
      </h1>
      <CollectionForm
        collection={collection}
        areas={areas}
        relatedCollections={relatedCollections}
        media={media}
        action={updateCollectionWithId}
      />
    </div>
  );
}
