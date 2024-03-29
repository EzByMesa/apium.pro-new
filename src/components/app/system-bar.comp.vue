<template>
  <v-system-bar color="sys_bar">
    <theme_switcher />
  </v-system-bar>
  <v-app-bar color="gradient" flat density="compact">
    <template v-slot:image>
      <v-img :gradient="`to top left, rgba(255,255,255, .1), rgba(0,0,0,.1)`" />
    </template>
    <template v-slot:default>
      <v-container class="mx-auto d-flex align-center justify-space-between">
        <h1>APIUM</h1>
        <v-spacer />
        <v-btn flat rounded>ГЛАВНАЯ</v-btn>
        <v-btn flat rounded>РАДИО</v-btn>
        <v-btn flat rounded>GAMES</v-btn>
        <v-btn flat rounded>КОНТАКТЫ</v-btn>
      </v-container>
    </template>
  </v-app-bar>
</template>

<script>
import { theme } from "@/store/theme.store.js"
import Theme_switcher from "@/components/app/theme_switcher.comp.vue";

export default {
  name: "system-bar",
  components: { Theme_switcher },
  computed: {
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

</style>