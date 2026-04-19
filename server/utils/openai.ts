import OpenAI from "openai";
import { useRuntimeConfig } from "#imports";

import type { EntryFormData } from "~~/shared/types/index";

function formatResult(result: Partial<EntryFormData>) {
  let changed = false;
  if (!result.date) {
    result.date = new Date().toDateString();
    changed = true;
  }
  if (changed) {
    console.info("formatResult changed:", result);
  }
  return result;
}

/**
 * 使用 runtime config 读取配置；如果配置了 ollama 则使用本地 ollama，
 * 如果配置了 OpenAI key 则使用 OpenAI，否则返回假数据。
 */
export async function parseTextToEntry(text: string) {
  const config = useRuntimeConfig();
  const openaiConfig = (config as any).openai || {};
  const apiKey = openaiConfig.apiKey as string | undefined;
  const baseUrl = openaiConfig.baseUrl;
  const model = openaiConfig.model;
  let result: Partial<EntryFormData> = {
    date: new Date().toDateString(),
  };

  if (baseUrl) {
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: baseUrl,
    });

    const system = `将用户的记账描述解析为严格的JSON对象，字段格式如下：\n{\n  "title": string,\n  "amount": number,\n  "currency": string,\n  "date": string,\n  "category": string,\n  "note": string\n}\ndate格式为YYYY-MM-DD,如果某个字段无法确定，请返回 null，尤其是日期。仅返回纯 JSON。`;

    const resp = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: text },
      ],
      max_tokens: 5000,
      temperature: 0,
    });

    const raw = resp.choices?.[0]?.message?.content || "";
    try {
      result = JSON.parse(raw) as EntryFormData;
      result.source = model;
    } catch (e) {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          return JSON.parse(m[0]) as EntryFormData;
        } catch (e2) {
          throw new Error("无法解析模型返回的 JSON");
        }
      }
      throw new Error("模型未返回可解析的 JSON");
    }
  } else {
    // 返回基于文本的简单假数据：尝试从文本抽取金额和日期，否则用默认
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    // 提取数字作为金额
    const m = text.match(/(\d+[.,]?\d*)/);
    const amount = m && m[1] ? Number(m[1].replace(",", ".")) : 0;
    // 简单分类判断
    const cat = /午餐|晚餐|早餐|餐|麦当劳|肯德基|饭|吃/.test(text)
      ? "餐饮"
      : /打车|出租|地铁|公交|出行/.test(text)
        ? "出行"
        : undefined;
    const title = (text.length > 0 ? text.slice(0, 40) : "记账") || "记账";

    result = {
      title: title,
      amount: amount,
      currency: "CNY",
      date: today,
      category: cat,
      note: text,
      source: "regex",
    };
  }
  console.info("parseTextToEntry result:", result);

  return formatResult(result);
}
