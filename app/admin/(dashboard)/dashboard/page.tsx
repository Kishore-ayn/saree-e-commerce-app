import { getCurrentProfile } from "@/lib/cms/auth";
import { countProducts, countProductsByStatus } from "@/lib/cms/products";
import { countCollections, countCollectionsByStatus } from "@/lib/cms/collections";
import { countAreas, countAreasByStatus } from "@/lib/cms/areas";
import { countMedia } from "@/lib/cms/media";
import { countTestimonials } from "@/lib/cms/testimonials";
import { countFaqs } from "@/lib/cms/faqs";
import { countPages } from "@/lib/cms/pages";
import { countForms } from "@/lib/cms/forms";
import { countBlogPosts, countBlogPostsByStatus } from "@/lib/cms/blog";
import { countUsersByRole } from "@/lib/cms/users";
import { listProductsAdmin } from "@/lib/cms/products";
import { listMedia } from "@/lib/cms/media";
import { listBlogPostsAdmin } from "@/lib/cms/blog";
import StatCard from "@/components/admin/StatCard";
import * as Lucide from "lucide-react";
const { Box, ArrowRight, ClipboardList, Users, Building, Image, MessageSquare, FileText, Calendar } = Lucide;

export default async function AdminDashboardPage() {
  const profile = await getCurrentProfile();

  // Fetch all dashboard statistics in parallel
  const [
    totalProducts,
    publishedProducts,
    draftProducts,
    totalCollections,
    publishedCollections,
    draftCollections,
    totalAreas,
    publishedAreas,
    draftAreas,
    totalMedia,
    totalTestimonials,
    totalFaqs,
    totalPages,
    totalForms,
    totalBlogPosts,
    publishedBlogPosts,
    draftBlogPosts,
    adminUsers,
    editorUsers,
    recentProducts,
    recentMedia,
    recentBlogPosts
  ] = await Promise.all([
    countProducts(),
    countProductsByStatus("published"),
    countProductsByStatus("draft"),
    countCollections(),
    countCollectionsByStatus("published"),
    countCollectionsByStatus("draft"),
    countAreas(),
    countAreasByStatus("published"),
    countAreasByStatus("draft"),
    countMedia(),
    countTestimonials(),
    countFaqs(),
    countPages(),
    countForms(),
    countBlogPosts(),
    countBlogPostsByStatus("published"),
    countBlogPostsByStatus("draft"),
    countUsersByRole("admin"),
    countUsersByRole("editor"),
    listProductsAdmin(),
    listMedia(),
    listBlogPostsAdmin()
  ]);

  // Get recent items (limit to 5 most recent)
  const recentProductsList = recentProducts.slice(0, 5);
  const recentMediaList = recentMedia.slice(0, 5);
  const recentBlogPostsList = recentBlogPosts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Welcome{profile.fullName ? `, ${profile.fullName}` : ""}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Overview of your saree store's content and performance
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Products */}
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon="Box"
          variant="primary"
          href="/admin/products"
        />
        <StatCard
          title="Published Products"
          value={publishedProducts}
          icon="Check"
          variant="success"
          href="/admin/products"
        />
        <StatCard
          title="Draft Products"
          value={draftProducts}
          icon="Edit"
          variant="warning"
          href="/admin/products"
        />

        {/* Collections */}
        <StatCard
          title="Total Collections"
          value={totalCollections}
          icon="Folder"
          variant="primary"
          href="/admin/collections"
        />
        <StatCard
          title="Published Collections"
          value={publishedCollections}
          icon="Check"
          variant="success"
          href="/admin/collections"
        />
        <StatCard
          title="Draft Collections"
          value={draftCollections}
          icon="Edit"
          variant="warning"
          href="/admin/collections"
        />

        {/* Areas */}
        <StatCard
          title="Total Areas"
          value={totalAreas}
          icon="Map"
          variant="primary"
          href="/admin/areas"
        />
        <StatCard
          title="Published Areas"
          value={publishedAreas}
          icon="Check"
          variant="success"
          href="/admin/areas"
        />
        <StatCard
          title="Draft Areas"
          value={draftAreas}
          icon="Edit"
          variant="warning"
          href="/admin/areas"
        />

        {/* Media & Content */}
        <StatCard
          title="Media Files"
          value={totalMedia}
          icon="Image"
          variant="primary"
          href="/admin/media"
        />
        <StatCard
          title="Testimonials"
          value={totalTestimonials}
          icon="MessageSquare"
          variant="success"
          href="/admin/testimonials"
        />
        <StatCard
          title="FAQs"
          value={totalFaqs}
          icon="FileText"
          variant="primary"
          href="/admin/faqs"
        />
        <StatCard
          title="Pages"
          value={totalPages}
          icon="FileText"
          variant="primary"
          href="/admin/pages"
        />
        <StatCard
          title="Forms"
          value={totalForms}
          icon="ClipboardList"
          variant="primary"
          href="/admin/forms"
        />
        <StatCard
          title="Blog Posts"
          value={totalBlogPosts}
          icon="Calendar"
          variant="primary"
          href="/admin/blog"
        />
        <StatCard
          title="Published Blog Posts"
          value={publishedBlogPosts}
          icon="Check"
          variant="success"
          href="/admin/blog"
        />
        <StatCard
          title="Draft Blog Posts"
          value={draftBlogPosts}
          icon="Edit"
          variant="warning"
          href="/admin/blog"
        />

        {/* Users */}
        <StatCard
          title="Admin Users"
          value={adminUsers}
          icon="Users"
          variant="success"
          href="/admin/settings/users"
        />
        <StatCard
          title="Editor Users"
          value={editorUsers}
          icon="Users"
          variant="secondary"
          href="/admin/settings/users"
        />
      </div>

      {/* Recent Activity Sections */}
      <div className="space-y-8">
        {/* Recent Products */}
        <section>
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Box className="h-4 w-4" /> Recent Products
          </h2>
          <div className="mt-3 space-y-2">
            {recentProductsList.length > 0 ? (
              recentProductsList.map((product) => (
                <div
                  key={product.id}
                  className="flex w-full items-center justify-between p-3 border rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Box className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">{product.name}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {product.sku || "No SKU"}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    product.status === "published"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}>
                    {product.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 py-4">
                No products found.
              </p>
            )}
          </div>
        </section>

        {/* Recent Media */}
        <section>
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Image className="h-4 w-4" /> Recent Media
          </h2>
          <div className="mt-3 space-y-2">
            {recentMediaList.length > 0 ? (
              recentMediaList.map((media) => (
                <div
                  key={media.id}
                  className="flex w-full items-center justify-between p-3 border rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      {media.fileType === "image" ? (
                        <Image className="h-4 w-4" />
                      ) : media.fileType === "video" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {media.storagePath.split("/").pop() || "Unnamed"}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {media.fileType.toUpperCase()} • {
                          (media.sizeBytes / 1024).toFixed(1)
                        } KB
                      </p>
                    </div>
                  </div>
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 py-4">
                No media uploaded yet.
              </p>
            )}
          </div>
        </section>

        {/* Recent Blog Posts */}
        <section>
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Recent Blog Posts
          </h2>
          <div className="mt-3 space-y-2">
            {recentBlogPostsList.length > 0 ? (
              recentBlogPostsList.map((post) => (
                <div
                  key={post.id}
                  className="flex w-full items-center justify-between p-3 border rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">{post.title}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(post.publishedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    post.status === "published"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}>
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 py-4">
                No blog posts found.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
