<template>
  <div>
    <img v-show="!loading" :src="url" alt="" :style="{'width': w}" @load="loaded">
    <div v-show="loading" v-loading="loading" :style="{'width': w, 'height': h}"></div>
  </div>
</template>
<script>
  export default {
    props: {
      src: String,
      width: String,
      height: String
    },
    data() {
      return {
        url: this.src,
        loading: true,
        w: this.width ? this.width : '533px',
        h: this.height ? this.height : '300px'
      }
    },
    methods: {
      loaded() {
        this.loading = false;
      }
    }
  }
</script>
