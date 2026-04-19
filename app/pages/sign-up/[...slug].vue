<template>
  <div class="h-full p-8 rounded-lg flex flex-col">
    <h1 class="text-2xl font-bold text-center mb-6">{{ $t("signUp") }}</h1>
    <div class="flex-1 flex justify-center">
      <SignUp with-sign-in transferable />
    </div>
  </div>
</template>

<script setup>
import { SignUp } from "@clerk/nuxt/components";
</script>
