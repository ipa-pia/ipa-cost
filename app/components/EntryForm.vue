<template>
  <el-form :model="form" label-width="80px">
    <el-form-item label="文本解析" prop="rawText">
      <el-input
        v-model="rawText"
        type="textarea"
        :rows="4"
        placeholder="例如：今天中午在麦当劳消费 45 元，午餐。"
      />
      <div class="mt-2">
        <el-button type="primary" :loading="parsing" @click="parseText">
          解析并填充表单
        </el-button>
      </div>
    </el-form-item>

    <el-form-item label="标题" required prop="title">
      <el-input v-model="form.title" placeholder="例如：午餐" />
    </el-form-item>

    <el-form-item label="金额" required prop="amount">
      <el-input-number
        v-model="form.amount"
        :step="0.01"
        :min="0"
        controls-position="right"
        class="w-full"
      />
    </el-form-item>

    <el-form-item label="日期" required prop="date">
      <el-date-picker
        v-model="form.date"
        type="date"
        placeholder="选择日期"
        class="w-full"
      />
    </el-form-item>

    <el-form-item label="分类" prop="category">
      <el-input v-model="form.category" placeholder="例如：餐饮" />
    </el-form-item>

    <el-form-item label="备注" prop="note">
      <el-input v-model="form.note" type="textarea" :rows="3" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="saving" @click="handleSubmit">
        {{ editMode ? "更新" : "保存" }}
      </el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from "vue";
import { ElMessage } from "element-plus";
import { parseText as parseTextApi } from "~/composables/useEntries";
import type { EntryFormData } from "~~/shared/types";

interface Props {
  initialData?: Partial<EntryFormData>;
  editMode?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [entry: EntryFormData];
  cancel: [];
}>();

const defaultFormData = {
  id: "",
  title: "",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  category: "",
  note: "",
  currency: "CNY",
};
const form = reactive<EntryFormData>({
  ...defaultFormData,
  ...props.initialData,
});

const rawText = ref("");
const saving = ref(false);
const parsing = ref(false);

const parseText = async () => {
  if (!rawText.value) { 
    ElMessage.warning("请输入要解析的文本");
    return;
  }
  parsing.value = true;
  try {
    const res = await parseTextApi(rawText.value);
    if (res.success && res.data) {
      const data = res.data;
      // 填充表单
      form.title = (data.title as string) ?? "";
      form.amount = Number((data.amount as number) ?? 0);
      form.date =
        (data.date as unknown as string) ??
        new Date().toISOString().slice(0, 10);
      form.category = (data.category as string) ?? "";
      form.note = (data.note as string) || rawText.value;
      ElMessage.success("解析成功，已填充表单");
    } else {
      ElMessage.error(res.error ?? "解析失败");
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    ElMessage.error(msg);
  } finally {
    parsing.value = false;
  }
};

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      Object.assign(form, newData);
    } else {
      Object.assign(form, defaultFormData);
    }
  },
  { immediate: true },
);

const handleSubmit = async () => {
  if (!form.title || form.amount <= 0) {
    ElMessage.error("请填写标题和金额");
    return;
  }

  saving.value = true;
  try {
    emit("submit", { ...form });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    ElMessage.error(msg);
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  emit("cancel");
};
</script>
