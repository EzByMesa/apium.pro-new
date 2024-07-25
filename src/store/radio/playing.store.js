import { defineStore } from 'pinia'

export const isPlaying = defineStore({
    id: 'isPlaying_radio_store',
    state: () => ({
        playing: false
    }),
    actions: {
        set(value) {
            this.title = value
        },
        get() {
            return this.title
        }
    }
})

export const isMuted = defineStore({
    id: 'isMuted_radio_store',
    state: () => ({
        muted: false
    }),
    actions: {
        set(value) {
            this.muted = value
        },
        get() {
            return this.muted
        }
    }
})

export const musicVolume = defineStore({
    id: 'volume_radio_store',
    state: () => ({
        volume: 100
    }),
    actions: {
        set(value) {
            this.volume = value
        },
        get() {
            return this.volume
        }
    }
})

export const radioSource = defineStore({
    id: 'source_radio_store',
    state: () => ({
        source: null
    }),
    actions: {
        set(value) {
            this.source = value
        },
        get() {
            return this.source
        }
    }
})

export const averageColor = defineStore({
    id: 'average_radio_store',
    state: () => ({
        average: null
    }),
    actions: {
        set(value) {
            this.average = value
        },
        get() {
            return this.average
        }
    }
})
