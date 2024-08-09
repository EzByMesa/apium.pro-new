<template>
  <v-system-bar :color="($route.name === 'music' || playing) ? 'transparent' : 'sys_bar'" elevation="0" density="compact">
    <v-btn density="compact" size="small" v-on:click="drawer = !drawer" variant="text">
      {{ drawer ? 'МЕНЮ' : 'APIUM' }}
    </v-btn>
    <v-spacer />
  </v-system-bar>

  <v-dialog fullscreen location="end" max-width="200" v-model="drawer" style="backdrop-filter: blur(10px) grayscale(100%)">
    <template v-slot:default="{ isActive }">
      <v-card rounded="0" class="text-center" title="APIUM" :subtitle="get_prefix()">
        <v-card-text>
          <v-btn block flat rounded="0" v-for="(route, index) in routes" :key="route"
                       v-on:click="() => {
                         $router.push({ name: route.name})
                         isActive.value = false
                       }"
          >{{ route.full_name.toUpperCase() }}</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <p style="font-size: 10px">APIUM MEDIA&Co. 2024</p>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>


  <v-sheet
      class="current_avatar d-flex justify-space-between align-end"
      v-on:click="$router.push({name: 'music'})"
      color="transparent"
      v-if="$route.name !== 'music' && playing && vinyl_player"
  >
    <v-avatar :image="artwork" size="100" class="rotating" />
    <v-sheet class="pa-2" color="transparent">
      <span style="font-size: 20px; font-family: Sen, sans-serif !important;">{{ composition }}</span>
      <v-divider :color="inverted" />
      <span style="font-size: 10px; font-family: Yeseva_One, sans-serif !important;">{{ artist }}</span>
    </v-sheet>
  </v-sheet>

</template>

<script>
import { theme } from "@/store/theme.store.js"
import Theme_switcher from "@/components/app/theme_switcher.comp.vue";
import {routes} from "@/router/main.router.js";
import {CurrentPlayingData, CurrentPlayingArtwork} from "@/store/radio/current.store.js";
import {averageColor, isPlaying} from "@/store/radio/playing.store.js";
import {themes} from "@/plugins/themes.js";
import invert from "invert-color";
import {S__VinylPlayer} from "@/store/settings.store.js";

export default {
  name: "system-bar",
  components: { Theme_switcher },
  data() {
    return {
      drawer: false,
    }
  },
  methods: {
    get_prefix: function () {
      switch (this.$route.path) {
        case '/music':
          return 'РАДИО'
        case '/settings':
          return 'НАСТРОЙКИ'
        default:
          return null
      }
    }
  },
  computed: {
    vinyl_player() {
      return S__VinylPlayer().get()
    },
    mobile() {
      return this.$vuetify.display.mobile
    },
    get_vynil_lines: function () {
      return `box-shadow: 20px 50px 100px 0px ${this.average};`
    },
    width() {
      return this.$vuetify.display.width
    },
    inverted() {
      if (this.average) return invert(this.average)
      return this.average
    },
    routes() {
      return routes.filter(el => el.shown === true)
    },
    title: {
      get() {
        return CurrentPlayingData().get()
      },
      set(value) {
        CurrentPlayingData().set(value)
      }
    },
    artist() {
      return this.title.split('-')[0]
    },
    composition() {
      return this.title.split('-')[1]
    },
    inverted2() {
      if (this.average) return invert(this.average)
      return this.average
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
.current_avatar {
  position: fixed;
  bottom: 10px;
  left: 10px;
  cursor: pointer;
  opacity: 0.3;
  transition: 0.5s;
}

.current_avatar:hover {
  opacity: 1;
}

.rotating {
  position: relative;
  animation: spin 4s linear infinite;
}

.rotating:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
  background-image:
      -webkit-radial-gradient(
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0) 3%,
          rgba(255, 255, 255, 0.5) 4%,
          rgba(255, 255, 255, 0.5)21%,
          rgba(255, 255, 255, 0.5) 22%,
          rgba(255, 255, 255, 0.5) 23%,
          rgba(103, 103, 103, 0.5) 24%,
          rgba(255,255,255,0) 25%,
          rgba(255,255,255,0) 40%,
          rgba(255,255,255,.5) 41%,
          rgba(255,255,255,0) 43%,
          rgba(255,255,255,.5) 45%,
          rgba(255,255,255,0) 46%,
          rgba(255,255,255,0) 53%,
          rgba(255,255,255,.5) 54%,
          rgba(255,255,255,0) 55%,
          rgba(255,255,255,0) 60%,
          rgba(255,255,255,.5) 61%,
          rgba(255,255,255,0) 62%,
          rgba(255,255,255,.5) 63%,
          rgba(255,255,255,0) 64%,
          rgba(255,255,255,.5) 65%,
          rgba(255,255,255,0) 66%
      );

}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform:         rotate(360deg);
  }
}
</style>