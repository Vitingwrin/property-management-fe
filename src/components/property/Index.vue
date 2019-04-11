<template>
  <div style="background: #f5f5f5; height: 100vh;">
    <mt-header fixed title="物业管理">
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <div class="top-card">
      <span>{{property.name}}</span>
    </div>
    <el-card v-loading="backlogLoading" class="fe-card" shadow="never" header="待办事项">
      <div v-if="backlog.length > 0" v-for="bill in backlog" :key="bill.id" class="card">
        <el-button type="text" style="width: 90%" @click="$router.push({name: 'billDetail', params: bill})">
          <span style="float: left">{{bill.name + '&emsp;' + bill.fee + '元'}}</span>
          <span style="float: right">{{bill.createTime.substr(0, 10)}}</span>
        </el-button>
      </div>
      <div v-show="backlog.length === 0" class="none"><span>暂无信息</span></div>
    </el-card>
    <el-card v-loading="noticeLoading" class="fe-card" shadow="never" header="公告栏">
      <div v-if="notices.length > 0" v-for="notice in notices" :key="notice.id" class="card">
        <el-button type="text" style="width: 90%">
          <span style="float: left">{{notice.title}}</span>
          <span style="float: right">{{notice.createTime}}</span>
        </el-button>
      </div>
      <div v-show="notices.length === 0" class="none"><span>暂无信息</span></div>
    </el-card>
    <el-card class="fe-card flex" shadow="never">
      <circle-button class="circle" icon="wrench" text="物业报修" @click.native="log"
                     bg-color="#26a2ff" icon-color="white" />
      <circle-button class="circle" icon="building" text="我的物业" @click.native="$router.push('/myProperty')"
                     bg-color="#26a2ff" icon-color="white" />
      <circle-button class="circle" icon="clipboard" text="公告栏" @click.native="log"
                     bg-color="#26a2ff" icon-color="white" />
      <circle-button class="circle" icon="bookmark" text="投诉建议" @click.native="log"
                     bg-color="#26a2ff" icon-color="white" />
      <circle-button class="circle" icon="dollar-sign" text="我的缴费" @click.native="$router.push('/myBill')"
                     bg-color="#26a2ff" icon-color="white" />
      <circle-button class="circle" icon="key" text="修改密码" @click.native="$router.push('/password')"
                     bg-color="#26a2ff" icon-color="white" />
    </el-card>
  </div>
</template>

<script>
  import CircleButton from '@/components/circle-button'
  import {Indicator, Toast} from 'mint-ui'
  import axios from 'axios'
  export default {
    name: "Index",
    components: {CircleButton},
    data() {
      return {
        backlog: [],
        notices: [],
        property: {name: '加载中...'},
        backlogLoading: false,
        noticeLoading: false,
        userId: this.$store.state.user.id
      }
    },
    methods: {
      log() {
        console.log("123");
      },
      getBacklog() {
        this.backlogLoading = true;
        axios.get('/bill/getBacklogByPropertyId', {params: {propertyId: this.property.id}})
          .then(response => {
            this.backlog = response.data.backlog;
            this.backlogLoading = false;
          }).catch(() => {
            Toast('待办事项加载失败');
            this.backlogLoading = false;
        })
      },
      getNotice() {
        this.noticeLoading = true;
        axios.get('/notice/getAllNotices')
          .then(response => {
            this.notices = response.data.notices;
            this.noticeLoading = false;
          }).catch(() => {
          Toast('待办事项加载失败');
          this.noticeLoading = false;
        })
      }
    },
    created() {
      // 首先加载物业信息
      Indicator.open('正在加载物业信息...');
      axios.get('/property/getPropertyByUserId', {params: {userId: this.userId}})
        .then(response => {
          this.property = response.data.property;
          this.$store.commit('saveProperty', this.property);
          Indicator.close();
          this.getBacklog();
          this.getNotice();
        }).catch(() => {
          this.property.name = '加载失败';
          Indicator.close();
          Toast('未知错误');
      })
    }
  }
</script>

<style scoped>
  .el-card {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
  }
  .top-card {
    text-align: center;
    height: 40px;
    margin-top: 40px;
    background: #26a2ff;
    width: 100%;
  }
  .top-card span {
    color: whitesmoke;
  }
  .none {
    text-align: center;
    width: 100%;
    color: darkgrey;
  }

  .circle {
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 10px;
  }

  .el-button {
    padding: 5px 0;
  }

  .card {
    text-align: center;
  }

</style>
<style>
  .fe-card .el-card__header {
    font-size: 14px;
    padding: 10px 12px;
  }
  .fe-card .el-card__body {
    font-size: 14px;
    padding: 12px;
  }
  .flex .el-card__body{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .card .el-button--text {
    color: dimgrey;
  }
</style>
