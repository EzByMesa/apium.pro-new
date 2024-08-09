<template>
  <v-sheet style="position: fixed; top: 0; left: 0;" color="black" width="100%" height="100%" class="d-flex justify-center align-center flex-column">
    <v-card variant="text" color="grey-darken-4" class="my-code" density="compact">{{ code }}</v-card>
    <v-card variant="text" color="white" class="text-center" density="compact" :title="title" :subtitle="message" />
  </v-sheet>
</template>

<script>
export default {
  name: 'ErrorPage',
  props: {
    code: {
      type: Number,
      default: 503,
      required: true
    },
    title: {
      type: String,
      default: 'Service Unavailable',
      required: true
    },
    message: {
      type: String,
      default: 'The server is temporarily busy, try again later!',
      required: true
    }
  }
}
</script>

<style scoped>
.my-code {
  font-family: Arial, sans-serif !important;
  font-size: 230px;
  font-weight: bolder;
}

</style>
