<template>
  <transition>
    <div style="background: #f5f5f5; height: 100vh;">
      <mt-header fixed title="公告栏">
        <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        <mt-button slot="right" @click.prevent="feLogout"><fa icon="sign-out-alt"></fa></mt-button>
      </mt-header>
      <div class="top-card"></div>
      <el-card v-loading="loading" class="fe-card" shadow="never">
        <div v-if="notices.length > 0" v-for="notice in notices" :key="notice.id" class="card">
          <el-button type="text" style="width: 90%" @click="$router.push({name: 'noticeDetail', params: notice})">
            <span style="float: left">{{notice.title}}</span>
            <span style="float: right">{{notice.createTime.substr(0, 10)}}</span>
          </el-button>
        </div>
        <div v-show="notices.length === 0" class="none"><span>暂无信息</span></div>
      </el-card>
    </div>
  </transition>
</template>

<script>
  import axios from 'axios'
  import {Toast} from 'mint-ui'
  export default {
    name: "Notice",
    data() {
      return {
        notices: [],
        loading: false,
      }
    },
    methods: {
      getBacklog() {
        this.loading = true;
        axios.get('/notice/getNoticesWithMsg')
          .then(response => {
            this.notices = response.data.notices;
            this.loading = false;
          }).catch(() => {
          Toast('公告加载失败');
          this.loading = false;
        })
      }
    },
    created() {
      this.getBacklog();
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

  .none {
    text-align: center;
    width: 100%;
    color: darkgrey;
  }
</style>
