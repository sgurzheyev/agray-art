function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Prefer SITE_URL → VERCEL_URL → agray.art → localhost. Never returns an empty/invalid URL. */
export function resolveSiteUrl(...extras: Array<string | undefined>): string {
  const vercel = process.env.VERCEL_URL?.trim();
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    vercel ? (isAbsoluteHttpUrl(vercel) ? vercel : `https://${vercel}`) : undefined,
    ...extras,
    "https://agray.art",
    "http://localhost:3000",
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withProtocol = isAbsoluteHttpUrl(value)
      ? value
      : `https://${value.replace(/^\/+/, "")}`;
    if (isAbsoluteHttpUrl(withProtocol)) return withProtocol.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
