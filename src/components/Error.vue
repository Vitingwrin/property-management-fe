<template>
  <h2 align="center">
    页面走丢了，3秒内自动跳转到首页，或点击
    <el-button type="text" @click="gotoIndex"><h2>这里</h2></el-button>
    跳转。。。
  </h2>
</template>

<script>
  export default {
    name: "Error",
    methods: {
      gotoIndex() {
        this.$router.replace('/');
      }
    },
    created() {
      setTimeout(() => {
        this.gotoIndex();
      }, 3000);
    }
  }
</script>

<style scoped>

</style>
