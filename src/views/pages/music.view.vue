<template>
  <v-sheet v-if="artwork" width="100%" height="100%" :color="check_is_dark(average) ? '#595959' : '#2f2f2f'" style="position: fixed; left: 0; top: 0; z-index: -10;">
    <v-img class="artwork_bg" :class="{'paused' : !playing}" cover :src="artwork" width="100%" height="100%" style="opacity: 0.5;" />
  </v-sheet>
  <v-sheet v-if="!artwork" width="100%" height="100%" :color="check_is_dark(average) ? '#595959' : '#2f2f2f'" style="position: fixed; left: 0; top: 0; z-index: -10;">
    <v-img class="offline_bg" cover src="https://00.apium.pro/img/radio/bg_ofline.jpg" width="100%" height="100%" style="opacity: 0.7;" />
  </v-sheet>

  <template v-if="artwork">
    <v-sheet style="position: absolute; top: 0; left: 0; z-index: 100" width="100%" height="100%" class="d-flex justify-center align-center">
      <v-sheet width="500" class="d-flex flex-column align-center justify-center" rounded="pill">
        <v-progress-circular bg-color="rgba(0,0,0,0.21)" v-model="duration_perc" :color="inverted"
                             size="400" width="200" :class="{ 'fade': playing }" v-on:click="playing ? stop() : play()">
          <v-avatar size="398" :image="artwork" :class="{ 'fade': playing }" style="cursor: pointer; box-shadow: 4px 4px 50px 4px var(--average-color)" />
        </v-progress-circular>
        <v-card class="text-center" rounded="0" color="transparent" elevation="0" style="color: white !important;">
          <template v-slot:title>
            <span style="font-family: MontserratBD, sans-serif !important; font-size: 30px" v-if="leblure">{{ volume.toFixed(0) }}%</span>
            <span v-else style="font-family: MontserratBD, sans-serif !important; font-size: 30px">{{ composition }}</span>
          </template>
          <template v-slot:subtitle>
        <span style="font-family: Montserrat, sans-serif !important; font-size: 15px">
          <span v-if="leblure">ГРОМКОСТЬ</span>
          <span v-else>{{ artist }}</span>
        </span>
          </template>
        </v-card>
      </v-sheet>
    </v-sheet>
    <v-fade-transition>
      <v-sheet width="100%" style="position: fixed; z-index: 10000; bottom: 10px" v-if="playing">
        <v-row>
          <v-col cols="12" md="6" xs="12" lg="4" xl="2" order-md="3" offset-lg="4" offset-xl="5">
            <v-slider
                rounded="xl"
                :style="`opacity: ${leblure ? 1 : 0.3}; transition: 0.3s;`"
                :track-size="5"
                thumb-size="0"
                min="0" max="100" step="1"
                :color="inverted"
                track-color="white"
                v-model="volume" hide-details
                v-on:start="leblure = true"
                v-on:end="leblure = false"
            >
              <template v-slot:prepend>
                <v-chip variant="text" :color="inverted" :style="`opacity: ${ leblure ? 1 : 0 }`">
                  <v-icon :icon="['fas', 'volume-off']" />
                </v-chip>
              </template>
              <template v-slot:append>
                <v-chip variant="text" :color="inverted" :style="`opacity: ${ leblure ? 1 : 0 }`">
                  <v-icon :icon="['fas', 'volume-up']" />
                </v-chip>
              </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-sheet>
    </v-fade-transition>
  </template>
</template>


<script>
import { CurrentPlayingData, CurrentPlayingArtwork } from "@/store/radio/current.store.js"
import { average } from "@/libs/average.js"
import invert from 'invert-color'
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
    get_gradient: function (progress) {
      return `background: conic-gradient(${'rgba(197,197,197,0.4)'} 0% ${progress}%, ${'rgba(255,255,255,0)'} ${progress}% 100%) !important`
    },
    check_is_dark: function (color) {
      if(color) {
        var c = color.substring(1);      // strip #
        var rgb = parseInt(c, 16);   // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff;  // extract red
        var g = (rgb >>  8) & 0xff;  // extract green
        var b = (rgb >>  0) & 0xff;  // extract blue
        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        return luma < 40 ? true : false
      } else {
        return null
      }
    },
    update_volume: function () {
      this.source.volume = this.volume / 100
    },
    play: async function () {
      this.source = new Audio()
      this.source.src = 'https://radio.s.apium.pro/type=https?nocache'
      this.source.play()
      this.source.volume = this.volume / 100
      this.playing = true
      await this.average_color()
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
        this.change_favicon()
        this.media_player_handler()

        this.average = await average(this.artwork)
      } else {
        this.average = null
      }

      document.body.style.setProperty('--average-color', this.average)
      document.body.style.setProperty('--inverted-color', this.inverted)
    },
    media_player_handler: function () {
      if (this.playing) {
        document.title = `${this.composition} - ${this.artist}`
      } else {
        document.title = `APIUM RADIO`
      }

      if (navigator.mediaSession) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.composition,
          artist: this.artist,
          album: this.album,
          artwork: [
            { src: this.artwork, sizes: '96x96',   type: 'image/png' },
            { src: this.artwork, sizes: '128x128', type: 'image/png' },
            { src: this.artwork, sizes: '192x192', type: 'image/png' },
            { src: this.artwork, sizes: '256x256', type: 'image/png' },
            { src: this.artwork, sizes: '384x384', type: 'image/png' },
            { src: this.artwork, sizes: '512x512', type: 'image/png' },
          ]
        })
        navigator.mediaSession.setActionHandler('seekbackward', null);
        navigator.mediaSession.setActionHandler('seekforward', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
    },
    change_favicon: function () {
      let link = document.querySelector("link[rel~='icon']");
      link.href = this.artwork
    }
  },
  computed: {
    artwork_height() {
      return document.getElementById('artwork').offsetHeight
    },
    text_color() {
      return this.check_is_dark(this.average) ? '#ffffff' : '#000000'
    },
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
    current_data: {
      get() {
        return CurrentPlayingData().get()
      },
      set(value) {
        CurrentPlayingData().set(value)
      }
    },
    artist() {
      if (this.current_data) {
        let artist = this.current_data.split(' - ')[0]
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
      }
    },
    composition() {
      if (this.current_data) {
        return this.current_data.split(' - ')[1]
      } else {
        return 'Unknown'
      }
    },
    album() {
      if (this.current_data) {
        return this.current_data.split(' - ')[2]
      } else {
        return 'Unknown'
      }
    },
    duration_full() {
      if (this.current_data) {
        return this.current_data.split(' - ')[3]
      } else {
        return 0
      }
    },
    duration_curr() {
      if (this.current_data) {
        return this.current_data.split(' - ')[4]
      } else {
        return 0
      }
    },
    duration_perc() {
      return 100 / (this.duration_full / this.duration_curr)
    },
    inverted() {
      if (this.average) {
        let color = invert(this.average)
        if (this.check_is_dark(color)) {
          return this.average
        } else {
          return color
        }
      }
      return this.average
    },
    favicon() {


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
.my-colored-shadow {
  animation: fade_shadow 13s ease-in-out 0s infinite normal none;
}

.play_pause_btn {
  position: absolute;
  font-size: 20px;
  cursor: pointer;
  background: var(--average-color);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 10px;
}

.play_pause_btn:hover {
  color: var(--inverted-color);
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
  filter: blur(20px) opacity(0.6);
  animation: bg_image_scale 20s ease-in-out 0s infinite normal none;
}

.offline_bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  filter: blur(5px) opacity(0.6);
  animation: bg_image_scale 20s ease-in-out 0s infinite normal none;
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
  animation: customAni 5s ease-in-out 0s infinite normal none;
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

@keyframes bg_image_scale {
  0% {
    transform: scale(1.3);
    rotate: 0deg;
  }
  25% {
    rotate: -10deg;
  }
  50% {
    transform: scale(1.7);
  }
  75% {
    rotate: 10deg;
  }
  100% {
    transform: scale(1.3);
    rotate: 0deg;
  }
}

.duration_indicator  {
  position: absolute;
  top: 0;
  left:0;
  z-index: -1;
}

.paused {
  animation-play-state: paused;
}
</style>
<script setup lang="ts">
</script>