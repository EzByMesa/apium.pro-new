<template>
  <template v-if="mobile">
    <v-system-bar color="sys_bar">
      <v-btn  density="compact" size="small" v-on:click="drawer = !drawer" variant="text" >
        <v-icon :icon="['fas', 'bars']" />
      </v-btn>
    </v-system-bar>

    <v-navigation-drawer location="end" v-model="drawer" temporary :width="width" color="bg">
      <v-list>
        <v-list-item title="APIUM" :subtitle="get_prefix()" />
        <v-divider />
        <v-list-item link v-for="(route, index) in routes" :key="route"
                     :title="route.full_name.toUpperCase()"
                     v-on:click="$router.push({ name: route.name})"
        />
      </v-list>
      <template v-slot:append>
        <theme_switcher />
      </template>
    </v-navigation-drawer>
  </template>
  <template v-else>
    <v-system-bar color="sys_bar">
      <theme_switcher />
      APIUM {{ get_prefix() }}
      <v-spacer />
      <template v-for="(route, index) in routes" :key="route">
        <v-btn :color="$route.name === route.name ? 'accent' : 'bg'" density="compact" size="small" v-on:click="$router.push({ name: route.name})" variant="text" >
          {{ route.full_name.toUpperCase() }}
        </v-btn>
      </template>
    </v-system-bar>
  </template>


  <v-sheet
      class="current_avatar d-flex justify-space-between align-end"
      v-on:click="$router.push({name: 'music'})"
      color="transparent"
      v-if="$route.name !== 'music' && playing"
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
import {CurrentPlaying, CurrentPlayingArtwork} from "@/store/radio/current.store.js";
import {averageColor, isPlaying} from "@/store/radio/playing.store.js";
import {themes} from "@/plugins/themes.js";
import invert from "invert-color";

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
        default:
          return null
      }
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mobile
    },
    width() {
      return this.$vuetify.display.width
    },
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
    artist() {
      return this.title.split('-')[0]
    },
    composition() {
      return this.title.split('-')[1]
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
          rgb(255, 255, 255) 4%,
          rgb(255, 255, 255) 21%,
          rgb(255, 255, 255) 22%,
          rgb(255, 255, 255) 23%,
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