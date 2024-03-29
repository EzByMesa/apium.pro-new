<template>
  <div style="position: fixed; bottom: 5px; width: 400px; left: calc(50% - 200px); z-index: 3000;" v-if="notification.length > 0">
    <v-alert
        density="compact"
        v-for="message in notification" :key="message"
        style="background: rgba(255,255,255,0.3) !important; backdrop-filter: blur(8px);"
        :color="message.color"
        variant="outlined"
        rounded="xl"
        prominent
        class="ma-1"
    >
      <template v-slot:title>
        <v-icon :color="message.color" :icon="message.icon" class="mr-2"/><p style="color: black;">{{ message.title }}</p>
      </template>
      <template v-slot:text>
        <div style="color: black;" v-html="message.text" />
      </template>
    </v-alert>
  </div>
</template>

<script>

import { NotifyStore } from "@/store/notify.store.js";

export default {
  name: "ns-shell",
  computed: {
    notification: {
      get() {
        return NotifyStore().get()
      },
      set(value) {
        NotifyStore().set(value)
      }
    }
  }
}
</script>

<style scoped>

</style>