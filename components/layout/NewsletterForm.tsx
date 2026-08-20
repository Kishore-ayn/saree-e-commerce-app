"use client";

export function NewsletterForm() {
  return (
    <form className="flex w-full max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Enter your email"
        className="min-h-11 flex-1 rounded-sm border border-primary-foreground/30 bg-primary-foreground/10 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      />
      <button
        type="submit"
        className="min-h-11 shrink-0 rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark cursor-pointer"
      >
        Subscribe
      </button>
    </form>
  );
}
