import { getQuery } from "h3";
import { prisma } from "~~/prisma/index";

export default defineApiHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const [entries, total] = await Promise.all([
    prisma.entry.findMany({
      skip: offset,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.entry.count(),
  ]);

  return {
    items: entries,
    total,
    page,
    pageSize,
  };
});
