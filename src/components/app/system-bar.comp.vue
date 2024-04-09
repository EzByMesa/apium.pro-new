<template>
  <v-system-bar color="sys_bar">
    <v-btn v-for="route in routes" :key="route" flat size="small"
           :icon="playing && $route.path === '/radio'"
           :color="$route.path === route.path ? (average && $route.path === '/radio' ? inverted : 'accent') : 'inherit'"
           variant="text"
           v-on:click="$router.push({ name: route.name})"
    >
      <template v-if="playing && $route.path === '/radio'">
        <template v-if="route.name === 'radio'">
          <v-icon color="accent" :icon="['fas', 'compact-disc']" :spin="playing" />
        </template>
        <v-icon v-else :icon="['fas', route.icon]"/>
      </template>
      <template v-else>
        {{ route.full_name }}
        <template v-if="route.name === 'radio' && playing">
          <v-avatar :image="artwork" size="15" class="rotating ml-1" />
        </template>
      </template>
    </v-btn>
    <v-spacer />
    <theme_switcher v-if="!playing" />
  </v-system-bar>
  <v-app-bar color="gradient" flat density="compact" v-if="!playing || $route.path !== '/radio'">
    <template v-slot:default>
      <v-container class="mx-auto d-flex align-center justify-space-between">
        <v-spacer />
        <h1>APIUM {{ get_prefix() }}</h1>
        <v-spacer />
      </v-container>
    </template>
  </v-app-bar>
</template>

<script>
import { theme } from "@/store/theme.store.js"
import Theme_switcher from "@/components/app/theme_switcher.comp.vue";
import {routes} from "@/router/main.router.js";
import {CurrentPlaying, CurrentPlayingArtwork} from "@/store/radio/current.store.js";
import {averageColor, isPlaying} from "@/store/radio/playing.store.js";
import {themes} from "@/plugins/themes.js";
import invert from "invert-color";

export default {
  name: "system-bar",
  components: { Theme_switcher },
  methods: {
    get_prefix: function () {
      switch (this.$route.path) {
        case '/radio':
          return 'РАДИО'
        default:
          return null
      }
    }
  },
  computed: {
    inverted() {
      if (this.average) {
        if (themes[theme().get()].dark) {
          return invert(this.average, { black: this.average, white: 'opposite' })
        } else {
          return invert(this.average, { black: 'opposite', white: this.average })
        }
      } return this.average
    },
    routes() {
      return routes.filter(el => el.shown === true)
    },
    title: {
      get() {
        return CurrentPlaying().get()
      },
      set(value) {
        CurrentPlaying().set(value)
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
    average: {
      get() {
        return averageColor().get()
      },
      set(value) {
        averageColor().set(value)
      }
    },
    artwork: {
      get() {
        return CurrentPlayingArtwork().get()
      },
      set(value) {
        CurrentPlayingArtwork().set(value)
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

<style scoped>
.rotating {
  animation:spin 4s linear infinite;
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform:rotate(360deg);
  }
}
</style>