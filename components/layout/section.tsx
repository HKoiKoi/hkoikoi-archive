import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-5xl px-4", className)}
      {...props}
    />
  );
}

export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("py-12 md:py-16", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  title,
  description,
  as: Heading = "h2",
  className,
}: {
  title: string;
  description?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("mb-8 space-y-2", className)}>
      <Heading className="font-heading text-2xl font-bold tracking-tight text-balance md:text-3xl">
        {title}
      </Heading>
      {description ? (
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
