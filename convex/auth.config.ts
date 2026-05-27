// Convex + Clerk auth config.
// Set CLERK_JWT_ISSUER_DOMAIN env var in Convex dashboard.
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
