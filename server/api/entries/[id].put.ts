import { readBody } from "h3";
import { prisma } from "~~/prisma/index";

export default defineApiHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw new Error("id is required");
  }

  const body = await readBody(event);
  const { title, amount, currency, date, category, note } = body || {};

  if (!title || typeof amount !== "number" || !date) {
    throw new Error("title, amount and date are required");
  }

  const dt = new Date(date);
  if (Number.isNaN(dt.getTime())) {
    throw new Error("invalid date format");
  }

  return await prisma.entry.update({
    where: { id },
    data: {
      title,
      amount: Number(amount),
      currency: currency || "CNY",
      date: dt,
      category: category || null,
      note: note || null,
    },
  });
});
