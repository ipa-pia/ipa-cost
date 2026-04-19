import type { EntryModel as PrismaEntry } from "~~/prisma/generated/prisma/models/Entry";

export type Entry = PrismaEntry;

export interface EntryFormData {
  id?: string;
  title: string;
  amount: number;
  currency?: string;
  date: string;
  category?: string;
  note?: string;
  [key: string]: unknown;
}
