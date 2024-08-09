<template>
  <v-app :theme="theme" style="background: transparent !important">
    <v-main class="d-flex justify-center align-center" style="height: 100%; width: 100%">
      <v-container class="d-flex align-center justify-center" style="height: 100%; width: 100%;">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SystemBar from "@/components/app/system-bar.comp.vue"
import { theme } from "@/store/theme.store.js"
import { CurrentPlayingData, CurrentPlayingArtwork } from "@/store/radio/current.store.js";
import { isPlaying } from "@/store/radio/playing.store.js";

export default {
  name: 'App',
  components: { SystemBar },
  beforeMount() {
    setInterval(() => {
      CurrentPlayingData().reload()
      CurrentPlayingArtwork().reload()
    }, 1000)
  },
  computed: {
    artwork: {
      get() {
        return CurrentPlayingArtwork().get()
      },
      set(value) {
        CurrentPlayingArtwork().set(value)
      }
    },
    playing: {
      get() {
        return isPlaying().get()
      },
      set(value) {
        isPlaying().set(value)
      }
    },
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
@import "assets/global.style.css";
@import "assets/play_pause.style.css";
* {
  transition: 0.3s
}

::-webkit-scrollbar {
  width: 0 !important;
}
</style>
