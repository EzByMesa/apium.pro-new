<template>
  <v-sheet color="transparent" min-width="50%">
    <v-card rounded="xl" flat class="text-center mb-10" :color="average" variant="outlined">
      <template v-slot:title>
        <v-sheet v-if="title" color="transparent" class="my-1 pa-2" rounded="xl">
          <span style="font-size: 30px; font-family: Yeseva_One, sans-serif !important;">{{ artist }}</span>
        </v-sheet>
        <v-sheet v-else color="transparent" class="my-1 pa-2" rounded="xl">
          <span style="font-size: 30px; font-family: Yeseva_One, sans-serif !important;">OFFLINE</span>
        </v-sheet>
      </template>
      <template v-slot:subtitle v-if="title">
        <v-sheet class="my-1 pa-2" rounded="xl" color="transparent">
          <span style="font-size: 30px; font-family: Yeseva_One, sans-serif !important;">{{ composition }}</span>
        </v-sheet>
      </template>
    </v-card>
    <v-hover v-slot="{ isHovering, props }" v-if="title">
      <v-sheet style="position: relative;" :style="get_shadow()" rounded="xl" :class="playing ? 'fade' : null" v-bind="props">
        <v-img id="artwork" :color="artwork ? 'transparent' : 'accent'" rounded="xl" :src="artwork" cover aspect-ratio="1 / 1" width="100%" />
        <v-fade-transition>
          <v-sheet color="transparent" class="d-flex justify-center align-center" rounded="xl" width="100%" height="100%" style="position: absolute; top: 0; left: 0; backdrop-filter: blur(10px)" v-if="isHovering">
            <v-btn style="backdrop-filter: blur(10px)" icon v-on:click="play()" v-if="!playing" :color="inverted" flat size="200">
              <v-icon style="font-size: 40px" :icon="['fas', 'play']" />
            </v-btn>
            <v-sheet color="transparent">
              <v-btn style="backdrop-filter: blur(10px)" icon v-on:click="stop()" v-if="playing" :color="inverted" flat size="200">
                <v-icon style="font-size: 40px" :icon="['fas', 'stop']" />
              </v-btn>

              <div class="d-flex justify-space-between align-center" v-if="playing">
                <v-icon v-on:click="muted ? unmute() : mute()" class="mx-2" :icon="['fas', volume === 0 || muted ? 'volume-xmark' : (volume >= 0.5 ? 'volume-high' : 'volume-low')]" />
                <v-slider :color="average" :disabled="muted" min="0" max="1" step="0.1" v-model="volume" hide-details />
              </div>
            </v-sheet>
          </v-sheet>
        </v-fade-transition>
      </v-sheet>
    </v-hover>
  </v-sheet>
</template>


<script>

import { CurrentPlaying, CurrentPlayingArtwork } from "@/store/radio/current.store.js"
import { average } from "@/libs/average.js";
import invert from 'invert-color';
import { themes } from "@/plugins/themes.js";
import { theme } from "@/store/theme.store.js";
import {averageColor, isMuted, isPlaying, musicVolume, radioSource} from "@/store/radio/playing.store.js";

export default {
  name: 'RadioView',
  data() {
    return {

    }
  },
  async beforeMount() {
    await this.average_color()
  },
  watch: {
    artwork() {
      this.average_color()
    },
    volume() {
      this.update_volume()
    },
  },
  methods: {
    update_volume: function () {
      this.source.volume = this.volume
    },
    play: function () {
      this.source = new Audio()
      this.source.src = 'https://radio.apium.pro/type=https?nocache'
      this.source.play()
      this.source.volume = this.volume
      this.playing = true
    },
    stop: function () {
      this.source.pause()
      this.source = null
      this.playing = false
    },
    mute: function () {
      this.muted = true
      this.source.volume = 0
    },
    unmute: function () {
      this.muted = false
      this.source.volume = this.volume
    },
    average_color: async function () {
      if (this.artwork) {
        this.average = await average(this.artwork)
      } else {
        this.average = null
      }
    },
    get_shadow: function () {
      return `box-shadow: 0px 10px 70px 0px ${this.average};`
    }
  },
  computed: {
    artist() {
      return this.title.split('-')[0]
    },
    composition() {
      return this.title.split('-')[1]
    },
    inverted() {
      console.log(themes[theme().get()].dark)
      if (themes[theme().get()].dark) {
        return invert(this.average, { black: this.average, white: 'opposite' })
      } else {
        return invert(this.average, { black: 'opposite', white: this.average })
      }
    },
    title: {
      get() {
        return CurrentPlaying().get()
      },
      set(value) {
        CurrentPlaying().set(value)
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
    source: {
      get() {
        return radioSource().get()
      },
      set(value) {
        radioSource().set(value)
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
    muted: {
      get() {
        return isMuted().get()
      },
      set(value) {
        isMuted().set(value)
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
    volume: {
      get() {
        return musicVolume().get()
      },
      set(value) {
        musicVolume().set(value)
      }
    }
  }
}
</script>

<style scoped>
.fade {
  animation: customAni 3s ease-in-out 0s infinite normal none;
  transition: 0.3s;
}

@keyframes customAni {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}
</style>
