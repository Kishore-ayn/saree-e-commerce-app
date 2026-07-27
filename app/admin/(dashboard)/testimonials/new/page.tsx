import { listMedia } from "@/lib/cms/media";
import { createTestimonial } from "@/app/admin/testimonials/actions";
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm";

export default async function NewTestimonialPage() {
  const media = await listMedia();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        New testimonial
      </h1>
      <TestimonialForm media={media} action={createTestimonial} />
    </div>
  );
}
