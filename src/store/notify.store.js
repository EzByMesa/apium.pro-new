import { defineStore } from 'pinia'

export const NotifyStore = defineStore('notification_list', {
    state: () => {
        return { notification_list: [] }
    },
    actions: {
        notify(title, text, color, icon) {
            let element = {
                title: title,
                text: text,
                color: color,
                icon: ['fas', icon]
            }
            this.notification_list.push(element)
            setTimeout(() => {
                this.notification_list.pop(element)
            }, 3000)
        },
        get() {
            return this.notification_list
        },
        set(value) {
            this.notification_list = value
        }
    },
})