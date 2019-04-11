<template>
  <div style="text-align: center; width: 60px">
    <div :style="{color: iconColor, background: bgColor}" class="circle-button">
      <fa :icon="icon"></fa>
    </div>
    <span style="font-size: 10px">{{text}}</span>
  </div>
</template>

<script>
  export default {
    name: 'CircleButton',
    props: {
      text: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      },
      "bg-color": String,
      "icon-color": String
    }
  }
</script>

<style scoped>
  .circle-button {
    text-align: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    padding: 10px;
    font-size: 18px;
    margin-left: 10px;
  }
</style>
