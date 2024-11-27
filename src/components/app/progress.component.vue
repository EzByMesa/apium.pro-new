<template>
  <v-sheet>
    <v-sheet :color="inverted" class="my-progress" id="progress_top_right"  :height="5"   :width="`${segments.top_right/2}%`" style="top: 0; left: 50%;" />
    <v-sheet :color="inverted" class="my-progress" id="progress_right"      :width="5"    :height="`${segments.right}%`"      style="top: 0; right: 0;" />
    <v-sheet :color="inverted" class="my-progress" id="progress_bottom"     :height="5"   :width="`${segments.bottom}%`"      style="bottom: 0; right: 0; rotate: -180deg" />
    <v-sheet :color="inverted" class="my-progress" id="progress_left"       :width="5"    :height="`${segments.left}%`"        style="bottom: 0; left: 0; rotate: -180deg" />
    <v-sheet :color="inverted" class="my-progress" id="progress_top_left"   :height="5"   :width="`${segments.top_left/2}%`"  style="top: 0; left: 0;" />
  </v-sheet>
</template>

<script>
import invert from "invert-color";

export default {
  name: "ProgressBG",
  props: ['color', 'percent'],
  computed: {
    segments() {
      return {
        top_right:  this.percent > 12.5 ? 100 : 100 * (0 - this.percent) / (0 - 12.5) < 0 ? 0 : 100 * (0 - this.percent) / (0 - 12.5),
        right:      this.percent > 37.5 ? 100 : 100 * (12.6 - this.percent) / (12.6 - 37.5) < 0 ? 0 : 100 * (12.6 - this.percent) / (12.6 - 37.5),
        bottom:     this.percent > 62.5 ? 100 : 100 * (37.6 - this.percent) / (37.6 - 62.5) < 0 ? 0 : 100 * (37.6 - this.percent) / (37.6 - 62.5),
        left:       this.percent > 87.5 ? 100 : 100 * (62.6 - this.percent) / (62.6 - 87.5) < 0 ? 0 : 100 * (62.6 - this.percent) / (62.6 - 87.5),
        top_left:   this.percent > 100 ? 100 : 100 * (87.6 - this.percent) / (87.6 - 100) < 0 ? 0 : 100 * (87.6 - this.percent) / (87.6 - 100),
      }
    },
    inverted() {
      return invert(this.color)
    },
  }
}
</script>

<style>
.my-progress {
  opacity: 1;
  transition: 4s;
  position: absolute;
  z-index: 10000;
}
</style>
