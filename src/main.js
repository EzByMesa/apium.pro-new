import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@fortawesome/fontawesome-free/css/all.css'
import router from './router/main.router.js'
import { themes } from "@/plugins/themes.js"


library.add(fas, far, fab)

const vuetify = createVuetify({
    theme: {
        themes: themes
    },
    icons: {
        defaultSet: 'fa',
        aliases,
        sets: {
            fa
        }
    },
    defaults: {
        VSheet: {
           color: 'transparent'
        },
        VChip: {
            variant: 'text'
        }
    },
    components,
    directives
})

const Vue = createApp(App)
const pinia = createPinia()

Vue.use(router)
Vue.use(pinia)
Vue.use(vuetify)
Vue.component('v-icon', FontAwesomeIcon)



Vue.mount('#app')