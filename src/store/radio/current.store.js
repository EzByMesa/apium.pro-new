import { defineStore } from 'pinia'

export const CurrentPlaying = defineStore({
    id: 'current_radio_store',
    state: () => ({
        title: null
    }),
    actions: {
        set(value) {
            this.title = value
        },
        get() {
            return this.title
        },
        async reload() {
            let url = 'https://radio.apium.pro/currentsong?sid=1'
            let meta = {
                method: 'GET'
            }
            fetch(url, meta)
                .then(response => response.text())
                .then(result => {
                    if (result !== "" && result !== null) {
                        if (result !== this.title) {
                            this.title = result
                        }
                    } else {
                        this.title = null
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }
})


export const CurrentPlayingArtwork = defineStore({
    id: 'current_art_radio_store',
    state: () => ({
        artwork: null,
        size: null
    }),
    actions: {
        set(value) {
            this.artwork = value
        },
        get() {
            return this.artwork
        },
        async reload() {
            const url = 'https://radio.apium.pro/playingart?sid=1'
            let meta = {
                method: 'GET'
            }
            fetch(url, meta)
                .then(response => response.blob())
                .then(result => {
                    if (result && result.size > 0) {
                        if (this.size !== result.size) {
                            console.log('Update artwork')
                            this.size = result.size
                            this.artwork = URL.createObjectURL(result)
                        }
                    } else {
                        this.size = null
                        this.artwork = null
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }
})