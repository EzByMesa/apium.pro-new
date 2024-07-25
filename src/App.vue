<template>
  <v-app :theme="theme">
    <system-bar />
    <v-main class="d-flex justify-center align-center" style="height: 100%; width: 100%;">
      <v-container class="d-flex align-center justify-center" style="height: 100%; width: 100%;">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SystemBar from "@/components/app/system-bar.comp.vue"
import { theme } from "@/store/theme.store.js"
import { CurrentPlaying, CurrentPlayingArtwork } from "@/store/radio/current.store.js";

export default {
  name: 'App',
  components: { SystemBar },
  beforeMount() {
    setInterval(() => {
      CurrentPlaying().reload()
      CurrentPlayingArtwork().reload()
    }, 1000)
  },
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
* {
  transition: 0.3s
}

::-webkit-scrollbar {
  width: 0px !important;
}
</style>
