<template>
  <transition>
    <div style="background: #f5f5f5; height: 100vh;">
      <mt-header fixed title="缴费详情">
        <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        <mt-button slot="right" @click.prevent="feLogout"><fa icon="sign-out-alt"></fa></mt-button>
      </mt-header>
      <div class="top-card"></div>
      <el-card class="fe-card" shadow="never">
        <el-form :data="bill" label-position="left" label-width="100px">
          <el-form-item label="名称"><span>{{bill.name}}</span></el-form-item>
          <el-form-item label="所属物业"><span>{{bill.property}}</span></el-form-item>
          <el-form-item label="待缴金额"><span>{{bill.fee}}</span></el-form-item>
          <el-form-item label="创建时间"><span>{{bill.createTime}}</span></el-form-item>
          <el-form-item label="缴费状态"><span>{{bill.payTime ? '已缴费' : '未缴费'}}</span></el-form-item>
          <el-form-item label="缴费时间"><span>{{bill.payTime ? bill.payTime : '无'}}</span></el-form-item>
        </el-form>
      </el-card>
      <el-button circle :type="bill.payTime ? 'success' : 'primary'" class="pay-button"
                 :icon="bill.payTime ? 'el-icon-check' : ''" :disabled="bill.payTime !== undefined"
                 :style="{'font-size': bill.payTime ? '50px' : '30px'}"
                 @click="pay">
        {{bill.payTime ? '' : '缴费'}}
      </el-button>
    </div>
  </transition>
</template>

<script>
  import axios from 'axios'
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: "BillDetail",
    data() {
      return {
        bill: this.$route.params
      }
    },
    methods: {
      pay() {
        Indicator.open('缴费中...');
        axios.post('/bill/pay', this.bill)
          .then(response => {
            if (response.data.status === 200) {
              this.bill = response.data.bill;
              Toast(response.data.message);
            } else {
              Toast('缴费失败');
            }
            Indicator.close();
          }).catch(() => {
            Toast('缴费失败');
          Indicator.close();
        })
      }
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
