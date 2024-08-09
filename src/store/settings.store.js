import { defineStore } from 'pinia'
import Cookies from "js-cookie";

export const S__VinylPlayer = defineStore({
    id: 'vinyl_player',
    state: () => {
        if (convert_cookie(Cookies.get('s__vinyl_player'))) {
            return {
                vinyl_player: convert_cookie(Cookies.get('s__vinyl_player'))
            }
        } else {
            Cookies.set('s__vinyl_player', true, { expires: 365 })
            return {
                vinyl_player: convert_cookie(Cookies.get('s__vinyl_player'))
            }
        }
    },
    actions: {
        get() {
            return this.vinyl_player
        },
        set(data) {
            Cookies.set('s__vinyl_player', data, { expires: 365 })
            this.vinyl_player = convert_cookie(Cookies.get('s__vinyl_player'))
        }
    },

})

function convert_cookie(str) {
    if (str === 'true') return true
    if (str === 'false') return false
    return false
}