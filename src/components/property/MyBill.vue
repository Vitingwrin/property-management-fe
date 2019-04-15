<template>
  <transition>
    <div style="background: #f5f5f5; height: 100vh;">
      <mt-header fixed title="我的缴费">
        <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        <mt-button slot="right" @click.prevent="feLogout"><fa icon="sign-out-alt"></fa></mt-button>
      </mt-header>
      <div class="top-card"></div>
      <el-card v-loading="backlogLoading" class="fe-card" shadow="never" header="待缴费">
        <div v-if="backlog.length > 0" v-for="bill in backlog" :key="bill.id" class="card">
          <el-button type="text" style="width: 90%" @click="$router.push({name: 'billDetail', params: bill})">
            <span style="float: left">{{bill.name + '&emsp;' + bill.fee + '元'}}</span>
            <span style="float: right">{{bill.createTime.substr(0, 10)}}</span>
          </el-button>
        </div>
        <div v-show="backlog.length === 0" class="none"><span>暂无信息</span></div>
      </el-card>
      <el-card v-loading="paidLoading" class="fe-card" shadow="never" header="已缴费">
        <div v-if="paidBills.length > 0" v-for="bill in paidBills" :key="bill.id" class="card">
          <el-button type="text" style="width: 90%" @click="$router.push({name: 'billDetail', params: bill})">
            <span style="float: left">{{bill.name + '&emsp;' + bill.fee + '元'}}</span>
            <span style="float: right">{{bill.createTime.substr(0, 10)}}</span>
          </el-button>
        </div>
        <div v-show="paidBills.length === 0" class="none"><span>暂无信息</span></div>
      </el-card>
    </div>
  </transition>
</template>

<script>
  import axios from 'axios'
  import {Toast} from 'mint-ui'
  export default {
    name: "MyBill",
    data() {
      return {
        backlog: [],
        backlogLoading: false,
        paidBills: [],
        paidLoading: false,
      }
    },
    methods: {
      getBacklog() {
        this.backlogLoading = true;
        axios.get('/bill/getBacklogByPropertyId', {params: {propertyId: this.$store.state.property.id}})
          .then(response => {
            this.backlog = response.data.backlog;
            this.backlogLoading = false;
          }).catch(() => {
            Toast('待缴费加载失败');
            this.backlogLoading = false;
        })
      },
      getPaidBills() {
        this.paidLoading = true;
        axios.get('/bill/getPaidBillsByPropertyId', {params: {propertyId: this.$store.state.property.id}})
          .then(response => {
            this.paidBills = response.data.paidBills;
            this.paidLoading = false;
          }).catch(() => {
          Toast('待缴费加载失败');
          this.paidLoading = false;
        })
      }
    },
    created() {
      this.getBacklog();
      this.getPaidBills();
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
