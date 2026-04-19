<template>
  <div class="entry-list">
    <div v-if="items.length === 0" class="text-center py-10">
      <el-empty description="暂无记录" />
    </div>
  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <EntryCard 
        v-for="entry in items" 
        :key="entry.id" 
        :entry="entry"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
    <div class="flex justify-center mt-5 max-w-full overflow-hidden">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[12, 24, 36, 48]"
        :total="total"
        :layout="isSmallScreen ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import EntryCard from "./EntryCard.vue";
import { useIsSmallScreen } from "~/utils/responsive";
import type { Entry } from "~~/shared/types";

interface Props {
  items: Entry[];
  total: number;
  currentPage: number;
  pageSize: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  pageChange: [page: number, size: number];
  edit: [entry: Entry];
  delete: [entryId: string];
}>();

// 检测是否为小屏幕
const isSmallScreen = useIsSmallScreen();

const handleEdit = (entry: Entry) => {
  emit("edit", entry);
};

const handleDelete = (entryId: string) => {
  emit("delete", entryId);
};

const currentPage = computed({
  get: () => props.currentPage,
  set: (value) => emit("pageChange", value, props.pageSize),
});

const pageSize = computed({
  get: () => props.pageSize,
  set: (value) => emit("pageChange", props.currentPage, value),
});

const handleSizeChange = (size: number) => {
  emit("pageChange", 1, size);
};

const handleCurrentChange = (page: number) => {
  emit("pageChange", page, props.pageSize);
};

// 移除这个watch监听器，因为它会导致分页在数据加载时重置为第一页
// 当需要重置分页时，应该由父组件控制
</script>

<style lang="scss" scoped>
.entry-list {
  .no-entries {
    text-align: center;
    padding: 40px 0;
  }

  .entry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(23%, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>