<template>
  <v-sheet :color="palette[palette.length-1]" v-if="artwork && palette" width="100%" height="100%" style="position: fixed; left: 0; top: 0; z-index: -10;">
<!--    <v-img class="artwork_bg" :class="{'paused' : !playing}" cover :src="artwork" width="100%" height="100%" style="opacity: 0.5;" />-->
  </v-sheet>
  <WeveComp :average="inverted" :playing="playing" v-if="artwork && palette"  />
  <v-sheet
      width="100%"
      class="pa-2 mt-2 d-flex justify-center align-center flex-column"
      rounded="xl"
      style="transition: 0.5s; position: absolute; top: 0; right: 0"
      :style="`filter: blur(${ !playing ? '0' : '30px' }); display: ${ !playing ? '1' : '0' };`"
  >
    <p :style="`filter: blur(${ !playing ? '0' : '10px' }); opacity: ${ !playing ? '1' : '0' }`" style="transition: 1s">
      <span style="font-family: MontserratBD, sans-serif !important; font-size: 60px">APIUM RADIO</span>
    </p>
  </v-sheet>
  <v-sheet rounded="xl" class="text-center" v-if="artwork">
    <v-sheet style="position: relative">
      <v-avatar
          elevation="10"
          rounded="xl"
          :class="{'my-track-cover' :  playing}"

          :style="`filter: grayscale(${ playing ? '0' : '1' });`"
          style="cursor: pointer; transition: 0.5s;"

          size="500"
          :image="artwork"

          v-on:click="playing ? stop() : play()"
      />
      <v-fade-transition>
        <v-sheet v-if="!playing"
                 style="pointer-events: none; backdrop-filter: blur(8px) brightness(0.3); position: absolute; top: 0; left: 0; z-index: 4000;"
                 rounded="xl" width="100%" height="100%" color="transparent"
                 class="d-flex text-center align-center justify-center"
                 :style="`background: radial-gradient(var(--average-color), rgba(0,0,0,0)); scale: ${!playing ? 1.06 : 1}`"
        >
          <p style="font-size: 60px; font-family: MontserratBD, sans-serif !important;">
            PLAY
            <v-icon class="ml-2" :icon="['fas', 'play']" />
          </p>
        </v-sheet>
      </v-fade-transition>

    </v-sheet>


    <v-sheet
        width="100%"
        v-on:mouseenter="show_volume = true"
        v-on:mouseleave="show_volume = false"
        class="pa-2 mb-2 mt-2 d-flex justify-center align-center flex-column"
        rounded="xl"
         style="transition: 0.5s; position: absolute; bottom: 0; right: 0"
        :style="`filter: blur(${ playing ? '0' : '30px' }); display: ${ playing ? '1' : '0' };`"
    >
      <p :style="`filter: blur(${ playing ? '0' : '10px' }); opacity: ${ playing ? '1' : '0' }`" style="transition: 0.9s">
        <span v-if="leblure" style="font-family: MontserratBD, sans-serif !important; font-size: 60px">{{ volume.toFixed(0) }}%</span>
        <span v-else style="font-family: MontserratBD, sans-serif !important; font-size: 60px">{{ composition }}</span>
      </p>
      <p :style="`filter: blur(${ playing ? '0' : '10px' }); opacity: ${ playing ? '1' : '0' }`" style="font-family: Montserrat, sans-serif !important; font-size: 20px; transition: 2s !important">
        <span v-if="leblure">ГРОМКОСТЬ</span>
        <span v-else>{{ artist }}</span>
      </p>

      <v-expand-transition>
        <v-sheet width="400" v-if="show_volume">
          <v-slider
              rounded="xl"
              :style="`opacity: ${leblure ? 1 : 0.3}; transition: 0.3s;`"
              :track-size="5"
              thumb-size="0"
              min="0" max="100" step="1"
              :color="md(palette)"
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
        </v-sheet>

      </v-expand-transition>
    </v-sheet>
  </v-sheet>

  <!--<v-sheet v-if="!artwork" width="100%" height="100%" style="position: fixed; left: 0; top: 0; z-index: -10;">
    <v-img class="offline_bg" cover src="https://00.apium.pro/img/radio/bg_ofline.jpg" width="100%" height="100%" style="opacity: 0.7;" />
  </v-sheet>


  <template v-if="artwork">
    <v-sheet style="position: absolute; top: 0; left: 0; z-index: 100" width="100%" height="100%" class="d-flex justify-center align-center">
      <v-sheet class="d-flex flex-column align-center justify-center">
        <v-sheet v-on:click="playing ? stop() : play()" :class="{ 'fade': playing }" style="cursor: pointer;" >
          <v-avatar id="title_cover" rounded="xl" :size="mobile ? 350 : 600" :image="artwork" :style="`box-shadow: 4px 4px 60px 4px var(&#45;&#45;lighten-color)`" />
&lt;!&ndash;          <v-fade-transition>
            <ProgressBG v-if="playing" :percent="duration_perc" :color="inverted" />
          </v-fade-transition>&ndash;&gt;
        </v-sheet>


        <v-card class="text-center mt-4" rounded="0" color="transparent" elevation="0" style="color: white !important;">
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
      <v-sheet width="100%" style="position: fixed; z-index: 10000; bottom: 10px" v-if="playing & !mobile">
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
  </template>-->
</template>


<script>
import { CurrentPlayingData, CurrentPlayingArtwork } from "@/store/radio/current.store.js"
import { average } from "@/libs/average.js"
import invert from 'invert-color'
import { theme } from "@/store/theme.store.js"
import {averageColor, isMuted, isPlaying, musicVolume, paletteColors, radioSource} from "@/store/radio/playing.store.js"
import ProgressBG from "@/components/app/progress.component.vue";
import {cover_palette, md} from "@/libs/palette.js";
import { prepared_palette } from "@/libs/color.js";
import WeveComp from "@/components/app/wave.comp.vue";
import LyricsShell from "@/components/app/lyrics.comp.vue";

export default {
  name: 'MusicView',
  components: {LyricsShell, WeveComp, ProgressBG},
  data() {
    return {
      show_volume: false,
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
    md,
    prepared_palette,
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
        this.palette = await cover_palette(this.artwork)

      } else {
        this.average = null
      }

      if (this.palette && this.palette.length > 0) {
        document.body.style.setProperty('--darken-color', this.palette[0])
        document.body.style.setProperty('--lighten-color', this.palette[this.palette.length -1])
      } else {
        document.body.style.setProperty('--darken-color', '#000')
        document.body.style.setProperty('--lighten-color', '#fff')
      }



      document.body.style.setProperty('--average-color', this.average)
      document.body.style.setProperty('--inverted-color', this.inverted)
    },
    media_player_handler: function () {
      if (this.playing) {
        document.title = `${this.composition} ■ ${this.artist}`
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
    isDark() {
      return this.check_is_dark(this.average)
    },
    segments() {
      return {
        top_right:  this.duration_perc > 12.5 ? 100 : 100 * (0 - this.duration_perc) / (0 - 12.5) < 0 ? 0 : 100 * (0 - this.duration_perc) / (0 - 12.5),
        right:      this.duration_perc > 37.5 ? 100 : 100 * (12.6 - this.duration_perc) / (12.6 - 37.5) < 0 ? 0 : 100 * (12.6 - this.duration_perc) / (12.6 - 37.5),
        bottom:     this.duration_perc > 62.5 ? 100 : 100 * (37.6 - this.duration_perc) / (37.6 - 62.5) < 0 ? 0 : 100 * (37.6 - this.duration_perc) / (37.6 - 62.5),
        left:       this.duration_perc > 87.5 ? 100 : 100 * (62.6 - this.duration_perc) / (62.6 - 87.5) < 0 ? 0 : 100 * (62.6 - this.duration_perc) / (62.6 - 87.5),
        top_left:   this.duration_perc > 100 ? 100 : 100 * (87.6 - this.duration_perc) / (87.6 - 100) < 0 ? 0 : 100 * (87.6 - this.duration_perc) / (87.6 - 100),
      }

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
    palette: {
      get() {
        return paletteColors().get()
      },
      set(value) {
        paletteColors().set(value)
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
  filter: blur(30px) opacity(0.6);
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
    transform: scale(0.97);
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

.rotating_gradient {
  animation: spin 120s linear infinite;
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.my-track-cover {
  transition: 0.3s;
  scale: 1.06;
  box-shadow: 0 30px 30px rgba(0,0,0,0.3) !important;
}

</style>
