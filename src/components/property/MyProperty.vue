<template>
  <transition>
    <div style="background: #f5f5f5; height: 100vh;">
      <mt-header fixed title="我的物业">
        <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        <mt-button slot="right" @click.prevent="feLogout"><fa icon="sign-out-alt"></fa></mt-button>
      </mt-header>
      <div class="top-card"></div>
      <el-card class="fe-card" shadow="never">
        <el-form :data="property" label-position="left" label-width="100px">
          <el-form-item label="名称"><span>{{property.name}}</span></el-form-item>
          <el-form-item label="编号"><span>{{property.code}}</span></el-form-item>
          <el-form-item label="所属小区"><span>{{property.residence}}</span></el-form-item>
          <el-form-item label="所属单元"><span>{{property.unit}}</span></el-form-item>
          <el-form-item label="所属楼栋"><span>{{property.buildings}}</span></el-form-item>
          <el-form-item label="门牌号"><span>{{property.doorplate}}</span></el-form-item>
          <el-form-item label="入住时间"><span>{{property.createTime}}</span></el-form-item>
        </el-form>
      </el-card>
    </div>
  </transition>
</template>

<script>
  import axios from 'axios'
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: "MyProperty",
    data() {
      return {
        property: {}
      }
    },
    created() {
      Indicator.open('加载中...');
      axios.get('/property/getPropertyByUserId', {params: {userId: this.$store.state.user.id}})
        .then(response => {
          if (response.data.status === 200) {
            this.property = response.data.property;
          } else {
            Toast('加载失败');
          }
          Indicator.close();
        }).catch(() => {
          Toast('加载失败');
          Indicator.close();
      })
    }

  }
</script>

<style scoped>
  .top-card {
    height: 40px;
    background: #f5f5f5;
    width: 100%;
  }

  .el-card {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .el-form {
    padding-left: 20px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .pay-button {
    width: 100px;
    height: 100px;
    position: fixed;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    bottom: 200px;
  }
</style>
