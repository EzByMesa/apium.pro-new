import { defineStore } from 'pinia'
import Cookies from "js-cookie";

export const theme = defineStore({
  id: 'selected_theme',
  state: () => {
    if (Cookies.get('theme')) {
      return {
        theme: Cookies.get('theme')
      }
    } else {
      Cookies.set('theme', 'dark', { expires: 365 })
      return {
        theme: Cookies.get('theme')
      }
    }
  },
  actions: {
    get() {
      return this.theme
    },
    set(data) {
      Cookies.set('theme', data, { expires: 365 })
      this.theme = Cookies.get('theme')
    }
  },
})