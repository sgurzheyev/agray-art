import { classNames } from "@/lib/format";

type BrandTag = "span" | "p" | "h1";

export function BrandName({
  className,
  as: Tag = "span",
  tracking = "0.2em",
}: {
  className?: string;
  as?: BrandTag;
  tracking?: string;
}) {
  return (
    <Tag className={classNames("font-brand uppercase", className)} style={{ letterSpacing: tracking }}>
      A.GRAY
    </Tag>
  );
}
