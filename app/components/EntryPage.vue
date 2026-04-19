<template>
  <div class="entry-page">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">记账</h2>
      <el-button
        v-if="showCreateButton"
        type="primary"
        @click="handleCreateClick"
      >
        <el-icon><Plus /></el-icon>
        新建记录
      </el-button>
    </div>

    <EntryList
      :items="items"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @page-change="handlePageChange"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <EntryCreateDialog
      v-model="showCreateDialog"
      :initial-data="editEntry"
      :edit-mode="!!editEntry"
      @created="handleEntryCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import EntryList from "./EntryList.vue";
import EntryCreateDialog from "./EntryCreateDialog.vue";
import { getEntries, deleteEntry } from "~/composables/useEntries";
import type { Entry, EntryFormData } from "~~/shared/types";

interface Props {
  showCreateButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCreateButton: true,
});

const items = ref<Entry[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const showCreateDialog = ref(false);
const editEntry = ref<EntryFormData | undefined>();

const handleCreateClick = () => {
  showCreateDialog.value = true;
  editEntry.value = undefined;
};
const loadEntries = async () => {
  try {
    const res = await getEntries({
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    if (res.success) {
      items.value = res.data!.items!;
      total.value = res.data!.total!;
    }
  } catch (e) {
    console.error("Failed to load entries:", e);
  }
};

const handlePageChange = (page: number, size: number) => {
  currentPage.value = page;
  pageSize.value = size;
  loadEntries();
};

const handleEntryCreated = () => {
  loadEntries();
  editEntry.value = undefined;
};

const handleEdit = (entry: Entry) => {
  editEntry.value = {
    title: entry.title,
    amount: entry.amount,
    date: new Date(entry.date).toISOString().slice(0, 10),
    category: entry.category || "",
    note: entry.note || "",
  };
  showCreateDialog.value = true;
};

const handleDelete = async (entryId: string) => {
  try {
    await ElMessageBox.confirm("确定要删除这条记录吗？", "删除确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const res = await deleteEntry(entryId);
    if (res.success) {
      ElMessage.success("删除成功");
      loadEntries();
    } else {
      ElMessage.error(res.error || "删除失败");
    }
  } catch (e) {
    if (e !== "cancel") {
      const msg = e instanceof Error ? e.message : String(e);
      ElMessage.error(msg);
    }
  }
};

onMounted(() => {
  loadEntries();
});
</script>

<style lang="scss" scoped></style>
