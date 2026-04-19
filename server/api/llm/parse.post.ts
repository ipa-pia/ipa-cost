import { readBody } from "h3";
export default defineApiHandler(async (event) => {
  const body = await readBody(event);
  const text = body?.text;
  if (!text || typeof text !== "string") {
    return { error: "missing text" };
  }
  const parsed = await parseTextToEntry(text);
  return parsed;
});
