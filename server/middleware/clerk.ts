import { isSafeRoute } from "#shared/utils/route";
import { clerkMiddleware } from "@clerk/nuxt/server";
export default clerkMiddleware((event) => {
  const runtimeConfig = useRuntimeConfig();
  if (!runtimeConfig.clerk.enabled) {
    console.debug("clerk not enabled");
    return;
  }
  if (isSafeRoute(event.path)) {
    return;
  }
  console.log("clerk middleware", event.context.auth());
  const { isAuthenticated } = event.context.auth();
  if (isAuthenticated) {
    return;
  }

  if (event.path.startsWith("/api/")) {
    throw createError({
      statusCode: 401,
      message: "unauthorized",
      data: {
        success: false,
      },
    });
  }
  return sendRedirect(event, "/");
});
