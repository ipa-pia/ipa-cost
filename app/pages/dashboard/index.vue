<template>
  <div class="flex flex-col items-center">
      <UserProfile v-if="isSignedIn"/>
  </div>
</template>

<script setup lang="ts">
import { UserProfile } from "@clerk/nuxt/components";
import { useAuth } from "@clerk/nuxt/composables";
const { isSignedIn } = useAuth();
</script>

<style scoped></style>
