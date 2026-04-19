<template>
  <div class="p-6 max-w-4/5 mx-auto">
    <EntryPage v-if="isSignedIn" />
  </div>
</template>

<script setup lang="ts">
import EntryPage from "~/components/EntryPage.vue";
import { useAuth } from "@clerk/nuxt/composables";

const { isSignedIn } = useAuth();
</script>

<style lang="scss" scoped></style>
