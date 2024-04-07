<template>
  <v-system-bar color="sys_bar">
    <v-btn v-for="route in routes" :key="route" flat rounded size="small"
           :icon="$route.path === '/radio'"
           :color="$route.path === route.path ? (average && $route.path === '/radio' ? average : 'accent') : 'inherit'"
           variant="text"
           v-on:click="$router.push({ name: route.name})"
    >
      <template v-if="$route.path !== '/radio'">
        {{ route.full_name }}
          <span v-if="title && route.path === '/radio' && playing" class="ml-2">
            <v-avatar :image="artwork" size="15" class="rotating" />
        </span>
      </template>
      <template v-else>
        <template v-if="route.name === 'radio'">
          <v-icon color="accent" :icon="['fas', 'compact-disc']" :spin="playing" />
        </template>

        <v-icon v-else :icon="['fas', route.icon]"/>
      </template>

    </v-btn>
    <v-spacer />
    <theme_switcher />
  </v-system-bar>
  <v-app-bar color="gradient" flat density="compact" v-if="$route.path === '/'">
    <template v-slot:image>
      <v-img :gradient="`to top left, rgba(255,255,255, .1), rgba(0,0,0,.1)`" />
    </template>
    <template v-slot:default>
      <v-container class="mx-auto d-flex align-center justify-space-between">
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