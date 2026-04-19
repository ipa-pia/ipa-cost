import { parseApiResponse, type PageResult } from "@ipa-schema/api";
import type { Entry } from "~~/shared/types/index";

export type ParseResponse = {
  ok?: boolean;
  data?: Record<string, unknown> | null;
  error?: string;
};

export async function parseText(text: string) {
  return $fetch("/api/llm/parse", {
    method: "POST",
    body: { text },
  }).then((r) => {
    return parseApiResponse<Entry>(r);
  });
}

export async function createEntry(payload: Record<string, unknown>) {
  return $fetch("/api/entries", {
    method: "POST",
    body: payload,
  }).then((r) => {
    return parseApiResponse<Entry>(r);
  });
}

export async function updateEntry(
  id: string,
  payload: Record<string, unknown>,
) {
  return $fetch(`/api/entries/${id}`, {
    method: "PUT",
    body: payload,
  }).then((r) => {
    return parseApiResponse<Entry>(r);
  });
}

export async function deleteEntry(id: string) {
  return $fetch(`/api/entries/${id}`, {
    method: "DELETE",
  }).then((r) => {
    return parseApiResponse<Entry>(r);
  });
}

export async function getEntries(params: { page: number; pageSize: number }) {
  return $fetch("/api/entries", {
    method: "GET",
    query: params,
  }).then(parseApiResponse<PageResult<Entry>>);
}