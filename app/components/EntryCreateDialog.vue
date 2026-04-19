<template>
  <el-dialog
    v-model="visible"
    :title="props.editMode ? '更新记录' : '新建记录'"
    :width="isSmallScreen ? '90%' : '600px'"
    :close-on-click-modal="false"
  >
    <EntryForm
      :initial-data="props.initialData"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useIsSmallScreen } from "~/utils/responsive";
import { ElMessage } from "element-plus";
import EntryForm from "./EntryForm.vue";
import {
  createEntry as createEntryApi,
  updateEntry as updateEntryApi,
} from "~/composables/useEntries";
import type { EntryFormData } from "~~/shared/types";

interface Props {
  modelValue: boolean;
  initialData?: Partial<EntryFormData>;
  editMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: undefined,
  editMode: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  created: [entry: any];
}>();

// 检测是否为小屏幕
const isSmallScreen = useIsSmallScreen();

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleSubmit = async (formData: EntryFormData) => {
  try {
    const payload = {
      ...formData,
      currency: "CNY",
    };
    let res;
    if (props.editMode && props.initialData?.id) {
      res = await updateEntryApi(props.initialData.id, payload);
    } else {
      res = await createEntryApi(payload);
    }
    if (res.success) {
      ElMessage.success(props.editMode ? "更新成功" : "创建成功");
      emit("created", res.data);
      visible.value = false;
    } else {
      ElMessage.error(res.error ?? (props.editMode ? "更新失败" : "创建失败"));
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    ElMessage.error(msg);
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>