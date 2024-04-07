<template>
  <v-menu open-on-hover open-delay="1000">
    <template v-slot:activator="{ props }">
      <v-btn v-if="variants.length > 1" variant="plain" v-on:click="switch_theme" icon v-bind="props" color="theme">
        <v-icon :icon="['fas', themes[theme].icon]" />
      </v-btn>

    </template>

    <v-card color="grey-lighten-4" flat rounded="xl">
      <template v-slot:subtitle>
        <v-divider class="mx-3" />
        <p class="text-center">ВЫБЕРИТЕ ТЕМУ</p>
        <v-divider />
      </template>
      <template v-slot:text>
        <v-btn
            flat
            rounded="xl"
            block
            class="mb-1 justify-space-between"
            v-on:click="toggle_theme(theme)"
            :color="themes[theme].colors.sys_bar"
            v-for="theme in variants"
            :key="theme"
            :value="theme"
        >
          <v-icon class="mr-1" :icon="['fas', themes[theme].icon]"/>
          {{ themes[theme].name }}
        </v-btn>
      </template>
    </v-card>
  </v-menu>
</template>

<script>
import { theme } from "@/store/theme.store.js"
import { themes } from "@/plugins/themes.js";
import { NotifyStore } from "@/store/notify.store.js";

export default {
  name: "theme_switcher",
  data() {
    return {

    }
  },
  methods: {
    toggle_theme: function (theme) {
      this.theme = theme;
    },
    switch_theme: function () {
      if (this.themes && this.variants.length > 0) {
        let position = this.variants.indexOf(this.theme)
        if (position < this.variants.length - 1) {
          this.theme = this.variants[position+1]
        } else {
          this.theme = this.variants[0]
        }
      } else {
        NotifyStore().notify('Внимание', 'Ошибка сметы темы', 'amber', 'palette')
      }
    },

  },
  computed: {
    variants() {
      let themes = Object.keys(this.themes)
      return themes
    },
    themes() {
      return themes
    },
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