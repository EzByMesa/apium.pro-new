<template>
  <v-row>
    <v-col cols="12" lg="4" md="6" sm="6" offset-lg="4" offset-md="3" offset-sm="3">
      <v-sheet rounded="xl" flat class="text-center" color="transparent">
        <v-sheet v-if="title" color="transparent" class="my-1 pa-2" id="title_holder" rounded="xl">
          <span style="font-size: 30px; font-family: Yeseva_One, sans-serif !important;">{{ artist }}</span>
          <v-divider :color="inverted" />
          <span style="font-size: 30px; font-family: Sen, sans-serif !important;">{{ composition }}</span>
        </v-sheet>
        <v-sheet v-else color="transparent" class="my-1 pa-2" rounded="xl">
          <span style="font-size: 30px; font-family: Yeseva_One, sans-serif !important;">OFFLINE</span>
        </v-sheet>
      </v-sheet>
      <v-card v-on:click="playing ? stop() : play()" v-if="title" class="my-10 d-flex justify-center align-center" :style="get_shadow()" rounded="xl" :class="playing ? 'fade' : null">
        <v-img id="artwork" :color="artwork ? 'transparent' : 'accent'" rounded="xl" :src="artwork" cover aspect-ratio="1 / 1" width="100%" />
        <v-fade-transition>
          <v-sheet color="transparent" class="d-flex justify-center align-center" rounded="xl" width="100%" height="100%" style="position: absolute; top: 0; left: 0; backdrop-filter: blur(10px)" v-if="leblure">
            <span v-if="volume === 100">РАЗРУШИТЕЛЬ ПЕРЕПОНОК</span>
            <span v-else-if="volume > 0">ГРОМКОСТЬ {{ volume }}%</span>
            <span v-else>ЗВУК ВЫКЛЮЧЕН</span>
          </v-sheet>
        </v-fade-transition>
      </v-card>

      <v-sheet color="transparent" class="d-flex justify-center align-center" rounded="xl" v-if="title">
        <v-btn :color="inverted" flat rounded="xl" variant="plain">
          <template v-slot:append>
            <v-icon :icon="['fas', 'circle']" fade />
          </template>
          <template v-slot:default>
            LIVE
          </template>
        </v-btn>

        <v-slider
            v-if="playing"
            :thumb-color="average" :disabled="muted"
            min="0" max="100" step="5"
            :track-color="inverted"
            v-model="volume" hide-details
            v-on:start="leblure = true"
            v-on:end="leblure = false"
        />

        <v-chip v-if="playing" variant="text" :color="inverted" class="mx-2" v-on:click="muted ? unmute() : mute()">
          <v-icon :icon="['fas', volume === 0 || muted ? 'volume-xmark' : (volume >= 50 ? 'volume-high' : 'volume-low')]" />
        </v-chip>
      </v-sheet>
    </v-col>
  </v-row>
</template>


<script>
import { CurrentPlaying, CurrentPlayingArtwork } from "@/store/radio/current.store.js"
import { average } from "@/libs/average.js"
import invert from 'invert-color'
import { themes } from "@/plugins/themes.js"
import { theme } from "@/store/theme.store.js"
import { averageColor, isMuted, isPlaying, musicVolume, radioSource } from "@/store/radio/playing.store.js"

export default {
  name: 'RadioView',
  data() {
    return {
      leblure: false,
      delay: false,
      marquee: false,
      levels: 16,
      bands: null
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
    focus_blur: function (event) {
      console.log(event)
      this.leblure = true
    },
    update_volume: function () {
      this.source.volume = this.volume / 100
    },
    play: function () {
      this.source = new Audio()
      this.source.src = 'https://radio.apium.pro/type=https?nocache'
      this.source.play()
      this.source.volume = this.volume / 100
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
      if (this.average) {
        if (themes[theme().get()].dark) {
          return invert(this.average, { black: this.average, white: 'opposite' })
        } else {
          return invert(this.average, { black: 'opposite', white: this.average })
        }
      } return this.average
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
