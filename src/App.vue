<template>
  <v-app :theme="theme">
    <system-bar />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SystemBar from "@/components/app/system-bar.comp.vue"
import { theme } from "@/store/theme.store.js"

export default {
  name: 'App',
  components: { SystemBar },
  computed: {
    theme: {
      get() {
        return theme().get()
      },
      set(value) {
        theme().set(value)
      }
    }
  }
}
</script>

<style>
@import "assets/fonts/fonts.handler.css";


::-webkit-scrollbar {
  width: 0px !important;
}
</style>
