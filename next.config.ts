import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These two are the defaults for every new Next.js 16.4 project.
  cacheComponents: true,
  partialPrefetching: true,
  // Keeps Next.js from adding extra instruction files to the project during development.
  agentRules: false,
  experimental: {
    // In development, Next.js checks every page for instant navigation and
    // logs "Could not validate `instant`" when a page redirects to the login.
    // This keeps the check for pages that ask for it, and none of ours do.
    instantInsights: { validationLevel: "manual-warning" },
  },
};

export default nextConfig;
