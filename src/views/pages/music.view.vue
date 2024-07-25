<template>
  <v-row>
    <v-col cols="12" lg="4" md="6" sm="6" offset-lg="4" offset-md="3" offset-sm="3">
      <v-sheet rounded="xl" flat class="text-center" color="transparent">
        <v-sheet v-if="title" color="transparent" class="my-1 pa-2" id="title_holder" rounded="xl">
          <p style="font-size: 30px; font-family: Sen, sans-serif !important;">{{ composition }} </p>
          <p style="margin-top: -10px; font-size: 10px; font-family: Sen, sans-serif !important;" v-if="album !== composition">
            <span class="font-weight-bold">{{ album }}</span>
          </p>
          <v-spacer />
          <span style="font-size: 30px; font-family: Yeseva_One, sans-serif !important;">{{ artist }}</span>
        </v-sheet>
        <v-sheet v-else color="transparent" class="my-1 pa-2" rounded="xl">
          <span style="font-size: 30px; font-family: Yeseva_One, sans-serif !important;">OFFLINE</span>
        </v-sheet>
      </v-sheet>
      <v-card v-on:click="playing ? stop() : play()" v-if="title" class="my-10 d-flex justify-center align-center" :style="get_shadow()" rounded="xl" :class="playing ? 'fade' : null">
        <v-img id="artwork" :color="artwork ? 'transparent' : 'accent'" rounded="xl" :src="artwork" cover aspect-ratio="1 / 1" width="100%" />
        <v-fade-transition>
          <v-sheet :color="check_is_dark(inverted2) ? '#00000033' : '#ffffff55'/*inverted2+'99'*/" class="d-flex justify-center align-center"
                   rounded="xl" width="100%" height="100%" style="position: absolute; top: 0; left: 0; backdrop-filter: blur(20px);" v-if="leblure">
            <v-chip style="font-size: 40px" variant="text" :color="average">
              <span v-if="volume === 100">МАКСИМУМ</span>
              <span v-else-if="volume > 0">ГРОМКОСТЬ {{ volume }}%</span>
              <span v-else>ЗВУК ВЫКЛЮЧЕН</span>
            </v-chip>
          </v-sheet>
        </v-fade-transition>
      </v-card>

      <v-sheet color="transparent" class="d-flex justify-center align-center" rounded="xl" v-if="title && playing && !$vuetify.display.platform.ios">
        <v-slider
            v-if="playing"
            :thumb-color="average" :disabled="muted"
            min="0" max="100" step="1"
            :track-color="inverted"
            v-model="volume" hide-details
            v-on:start="leblure = true"
            v-on:end="leblure = false"
        />

        <v-chip v-if="playing" variant="text" :color="inverted" class="mx-2">
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
  name: 'MusicView',
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
    check_is_dark: function (color) {
      var c = color.substring(1);      // strip #
      var rgb = parseInt(c, 16);   // convert rrggbb to decimal
      var r = (rgb >> 16) & 0xff;  // extract red
      var g = (rgb >>  8) & 0xff;  // extract green
      var b = (rgb >>  0) & 0xff;  // extract blue
      var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
      return luma < 40 ? true : false
    },
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
      this.source.volume = this.volume / 100
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
    title: {
      get() {
        return CurrentPlaying().get()
      },
      set(value) {
        CurrentPlaying().set(value)
      }
    },
    artist() {
      let artist = this.title.split(' - ')[0]
      let artists = artist.split('/')
      if (artists.length <= 1) {
        artists = artist.split(',')
      }

      let artist_str = ''

      if (artists.length > 1) {
        for (let [index, artist] of artists.entries()) {
          artist_str += artist
          if (index === 0) artist_str += ' ft. '
          else if (index < artists.length - 1) artist_str += ', '
        }
      } else {
        artist_str += artists[0]
      }
      return artist_str
    },
    composition() {
      return this.title.split(' - ')[1]
    },
    album() {
      return this.title.split(' - ')[2]
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
    inverted2() {
      if (this.average) return invert(this.average)
      return this.average
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
