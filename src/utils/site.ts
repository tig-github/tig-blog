const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tig-github.github.io/tig-blog";

export const SITE_URL = configuredSiteUrl.replace(/\/$/, "");
