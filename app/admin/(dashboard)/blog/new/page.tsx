import { listCollectionsForPicker } from "@/lib/cms/products";
import { listMedia } from "@/lib/cms/media";
import { createBlogPost } from "@/app/admin/blog/actions";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export default async function NewBlogPostPage() {
  const [collections, media] = await Promise.all([
    listCollectionsForPicker(),
    listMedia(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">New post</h1>
      <BlogPostForm collections={collections} media={media} action={createBlogPost} />
    </div>
  );
}
