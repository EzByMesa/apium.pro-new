<template>
  <v-sheet style="position: fixed; top: 0; left: 0;" width="100%" height="100%" :color="average" class="d-flex justify-center align-center flex-column">
    <v-img class="artwork_bg" cover :src="artwork" width="100%" height="100%" />

    <v-sheet rounded="xl" flat class="text-center" color="transparent">
      <v-sheet v-if="title" color="transparent" class="my-1 pa-2" id="title_holder" rounded="xl">
        <p style="font-size: 30px; font-family: Aquawax, sans-serif !important;">{{ composition }}</p>
        <p style="margin-top: -10px; font-size: 10px; font-family: Aquawax, sans-serif !important;" v-if="album !== composition">
          <span class="font-weight-bold">{{ album }}</span>
        </p>
        <v-spacer />
        <span style="font-size: 30px; font-family: Yeseva_One, sans-serif !important;">{{ artist }}</span>
      </v-sheet>
      <v-sheet v-else color="transparent" class="my-1 pa-2" rounded="xl">
        <span style="font-size: 30px; font-family: Yeseva_One, sans-serif !important;">OFFLINE</span>
      </v-sheet>
    </v-sheet>
    <v-card :width="mobile ? '100%' : 500" color="transparent" v-on:click="playing ? stop() : play()" v-if="title" class="my-10 d-flex justify-center align-center my-colored-shadow" :rounded="mobile ? 0 : 'xl'"
            :class="{ 'fade': playing, 'my-colored-shadow-animated': playing }"
    >
      <v-img id="artwork" :color="artwork ? 'transparent' : 'accent'" :rounded="mobile ? 0 : 'xl'" :src="artwork" cover aspect-ratio="1 / 1" width="100%" />
      <v-fade-transition>
        <v-sheet color="transparent" class="d-flex justify-center align-center"
                 rounded="xl" width="100%" height="100%" style="position: absolute; top: 0; left: 0; backdrop-filter: blur(20px);" v-if="leblure">
          <v-chip style="font-size: 40px" class="font-weight-bold" variant="text" :color="inverted2">
            <span v-if="volume === 100">МАКС.</span>
            <span v-else-if="volume > 0">
              <v-icon style="font-size: 85%" :icon="['fas', volume === 0 || muted ? 'volume-xmark' : (volume >= 50 ? 'volume-high' : 'volume-low')]" />
              {{ volume }}%
            </span>
            <span v-else>БЕЗ ЗВУКА</span>
          </v-chip>
        </v-sheet>
      </v-fade-transition>
    </v-card>
    <v-sheet width="300" color="transparent" class="d-flex justify-center align-center" rounded="xl" v-if="title && playing && !$vuetify.display.platform.ios">
      <v-slider
          :thumb-color="average" :disabled="muted"
          min="0" max="100" step="1"
          :track-color="inverted"
          v-model="volume" hide-details
          v-on:start="leblure = true"
          v-on:end="leblure = false"
      />
    </v-sheet>
  </v-sheet>
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
    average_color: async function () {
      if (this.artwork) {
        this.average = await average(this.artwork)
      } else {
        this.average = null
      }

      document.body.style.setProperty('--average-color', this.average)
      document.body.style.setProperty('--inverted-color', this.inverted2)
    },
    get_shadow: function () {
      return `box-shadow: 20px 50px 300px 10px ${this.average};`
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mobile
    },
    theme: {
      get() {
        return theme().get()
      },
      set(value) {
        theme().set(value)
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
:root {
  --average-color: #000000;
  --inverted-color: #000000;
}
.average {
  color: var(--average-color) !important;
}
.inverted {
  color: var(--inverted-color) !important;
}

.artwork_bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  filter: blur(20px) opacity(0.3);
}

.my-colored-shadow {
  box-shadow: 20px 50px 300px 10px var(--average-color);
  transition: 0.3s;
}
.my-colored-shadow-animated {
  box-shadow: 20px 50px 600px 10px var(--inverted-color);
  transition: 0.3s;
  animation: fade_shadow 10s ease-in-out infinite !important;
}

@keyframes fade_shadow {
  0% {
    box-shadow: 20px 50px 600px 10px var(--inverted-color);
  }
  50% {
    box-shadow: 20px 50px 100px 10px var(--inverted-color);
  }
  100% {
    box-shadow: 20px 50px 600px 10px var(--inverted-color);
  }
}



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
