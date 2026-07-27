import { notFound } from "next/navigation";
import { getBlogPostAdmin } from "@/lib/cms/blog";
import { listCollectionsForPicker } from "@/lib/cms/products";
import { listMedia } from "@/lib/cms/media";
import { updateBlogPost } from "@/app/admin/blog/actions";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, collections, media] = await Promise.all([
    getBlogPostAdmin(id),
    listCollectionsForPicker(),
    listMedia(),
  ]);

  if (!post) notFound();

  const updateBlogPostWithId = updateBlogPost.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Edit post</h1>
      <BlogPostForm post={post} collections={collections} media={media} action={updateBlogPostWithId} />
    </div>
  );
}
