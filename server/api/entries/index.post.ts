import { readBody } from "h3";
import { prisma } from "~~/prisma/index";

export default defineApiHandler(async (event) => {
  const body = await readBody(event);

  const { title, amount, currency, date, category, note } = body || {};

  if (!title || typeof amount !== "number" || !date) {
    throw new Error("missing required fields");
  }

  const dt = new Date(date);
  if (Number.isNaN(dt.getTime())) {
    throw new Error("invalid date");
  }

  const created = await prisma.entry.create({
    data: {
      title,
      amount: Number(amount),
      currency: currency || "CNY",
      date: dt,
      category: category || null,
      note: note || null,
    },
  });

  return created;
});

