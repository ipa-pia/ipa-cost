<template>
  <el-card
    class="h-full rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    shadow="hover"
    :body-style="{
      padding: '10px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }"
    @contextmenu="handleContextMenu"
  >
    <div class="flex justify-between items-start mb-3 border-b border-gray-100">
      <el-text
        class="text-base font-semibold text-gray-800 line-clamp-2 flex-1 mr-1"
        truncated
        >{{ entry.title }}</el-text
      >
      <div class="text-red-500 font-bold">
        <span class="text-xs opacity-80 mr-1">{{ entry.currency }}</span>
        <span class="text-lg">{{ entry.amount.toFixed(2) }}</span>
      </div>
    </div>
    <div class="flex flex-wrap gap-3 mb-1 text-sm text-gray-600 text-sm">
      <div class="flex items-center gap-2">
        <el-icon class="text-gray-400"><Calendar /></el-icon>
        {{ formatDate(entry.date) }}
      </div>
      <div v-if="entry.category" class="flex items-center gap-2">
        <el-icon class="text-gray-400"><PriceTag /></el-icon>
        {{ entry.category }}
      </div>
    </div>
    <div class="my-1 text-sm text-gray-600 flex items-start gap-2 flex-1">
      {{ entry.note }}
    </div>
    <div class="mt-auto pt-1 border-t border-gray-100 text-right">
      <el-text size="small" type="info">
        <el-icon class="mr-1"><Timer /></el-icon>
        {{ formatDate(entry.createdAt) }}
      </el-text>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Entry } from "~~/shared/types";
import { Calendar, PriceTag, Document, Timer } from "@element-plus/icons-vue";
import { useContextMenu } from "~/composables/context-menu";

interface Props {
  entry: Entry;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [entry: Entry];
  delete: [entryId: string];
}>();

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleContextMenu = (e: MouseEvent) => {
  useContextMenu(e, {
    items: [
      {
        label: "编辑",
        onClick: () => emit("edit", props.entry),
      },
      {
        label: "删除",
        onClick: () => emit("delete", props.entry.id),
      },
    ],
  });
};
</script>

<style lang="scss" scoped></style>
