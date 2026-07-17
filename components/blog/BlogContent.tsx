export function BlogContent({ content }: { content: string[] }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
      {content.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="!mt-10 mb-2 font-heading text-2xl font-medium text-foreground">
              {block.replace("## ", "")}
            </h2>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="!mt-6 mb-2 font-heading text-lg font-medium text-foreground">
              {block.replace("### ", "")}
            </h3>
          );
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
