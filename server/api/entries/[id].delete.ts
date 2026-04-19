import { prisma } from "~~/prisma/index";

export default defineApiHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("id is required");
  }

  return await prisma.entry.delete({
    where: { id },
  });
});
