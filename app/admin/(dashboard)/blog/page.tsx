import Link from "next/link";
import { listBlogPostsAdmin } from "@/lib/cms/blog";
import { DeleteBlogPostButton } from "@/components/admin/blog/DeleteBlogPostButton";

export default async function AdminBlogPage() {
  const posts = await listBlogPostsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No posts yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <tr>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Published</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                  {post.title}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                  {post.publishedAt ? post.publishedAt.slice(0, 10) : "—"}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">{post.status}</td>
                <td className="py-2 text-right">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                  >
                    Edit
                  </Link>
                  <DeleteBlogPostButton id={post.id} title={post.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
