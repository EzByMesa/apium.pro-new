<template>
  <v-sheet id="work_area" v-if="palette" style="position: fixed; z-index: -1; mix-blend-mode: color-burn; filter: blur(10px)" width="100%" height="100%" class="d-flex justify-space-between flex-column" >
    <v-sheet v-for="i in y" style="width: 100%" class="d-flex justify-space-between">
      <v-sheet v-for="j in x" :width="step" :height="step" :color="get_random()">
        &nbsp;
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
import { paletteColors } from "@/store/radio/playing.store.js";

export default {
  name: "WeveComp",
  data() {
    return {
      step: 60, // pixels
      x: null,
      y: null
    }
  },
  mounted() {
    this.init_scales()
  },
  methods: {
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
#work_area {
  filter: blur(0px);
}
</style>
