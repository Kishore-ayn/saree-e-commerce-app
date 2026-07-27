import Link from "next/link";
import { listTestimonialsAdmin } from "@/lib/cms/testimonials";
import { DeleteTestimonialButton } from "@/components/admin/testimonials/DeleteTestimonialButton";

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonialsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Testimonials
        </h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          New testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No testimonials yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <tr>
              <th className="py-2 pr-4">Author</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id}>
                <td className="py-2 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                  {testimonial.authorName}
                </td>
                <td className="py-2 pr-4 text-neutral-600 dark:text-neutral-400">
                  {testimonial.status}
                </td>
                <td className="py-2 text-right">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}/edit`}
                    className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                  >
                    Edit
                  </Link>
                  <DeleteTestimonialButton id={testimonial.id} authorName={testimonial.authorName} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
