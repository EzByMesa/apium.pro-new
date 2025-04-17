<template>
  <v-sheet id="work_area" style="position: fixed; z-index: -1; scale: 1.3; filter: blur(30px); transition: 1s" :style="`filter: blur(30px) grayscale(${playing ? '0' : '1'});`" :color="average" width="100%" height="100%" class="d-flex justify-space-between flex-column" >
    <v-sheet v-for="i in y" style="width: 100%" class="d-flex justify-space-between">
      <v-sheet v-for="j in x" :width="step" :height="step" :color="color_array[i-1][j-1]" style="transition: 1.6s">
        &nbsp;
      </v-sheet>
    </v-sheet>
  </v-sheet>

</template>
<script>
import { paletteColors } from "@/store/radio/playing.store.js";

export default {
  name: "WeveComp",
  props: ['average', 'playing'],
  data() {
    return {
      timer: null,
      step: 60, // pixels
      x: null,
      y: null,
      color_array: []
    }
  },
  watch: {
    playing(value) {
      if (value) {
        this.timer = setInterval(() => {
          this.generate_array()
        }, 0.2*1000)
      } else {
        clearInterval(this.timer)
      }
    }
  },
  mounted() {
    this.init_scales()
    this.generate_array()
  },
  methods: {
    generate_array: function () {
      let array = []

      for (let i = 0; i < this.y; i++) {
        let t_array = []
        for (let j = 0; j < this.x; j++) {
          let color = this.get_random()
          t_array.push(color)
        }
        array.push(t_array)
      }
      this.color_array = array
    },
    get_random: function () {
      let color = '#000'
      let palette = this.palette
      color = palette[ Math.floor(Math.random() * palette.length) ];
      return color
    },
    init_scales: function () {
      this.x = Math.ceil(document.body.offsetWidth / this.step)
      this.y = Math.ceil(document.body.offsetHeight / this.step)
    }
  },
  computed: {
    palette: {
      get() {
        return paletteColors().get()
      },
      set(value) {
        paletteColors().set(value)
      }
    }
  }
}
</script>


<style scoped>
</style>
