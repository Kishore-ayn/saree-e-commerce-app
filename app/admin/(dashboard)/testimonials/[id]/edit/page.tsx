import { notFound } from "next/navigation";
import { getTestimonialAdmin } from "@/lib/cms/testimonials";
import { listMedia } from "@/lib/cms/media";
import { updateTestimonial } from "@/app/admin/testimonials/actions";
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [testimonial, media] = await Promise.all([getTestimonialAdmin(id), listMedia()]);

  if (!testimonial) notFound();

  const updateTestimonialWithId = updateTestimonial.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Edit testimonial
      </h1>
      <TestimonialForm testimonial={testimonial} media={media} action={updateTestimonialWithId} />
    </div>
  );
}
