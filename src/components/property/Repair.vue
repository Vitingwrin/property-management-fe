<template>
  <transition>
    <div style="margin-bottom: 48px">
      <mt-header fixed title="物业报修">
        <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        <mt-button slot="right" @click.prevent="feLogout"><fa icon="sign-out-alt"></fa></mt-button>
      </mt-header>
      <div class="top-card"></div>

      <div v-for="repair in repairs" :key="repair.id">
        <el-card shadow="never" class="fe-card">
          <el-form :model="repair" label-width="100px" label-position="left">
            <el-form-item label="报修类型">{{repair.type}}</el-form-item>
            <el-form-item label="报修单号">{{repair.code}}</el-form-item>
            <el-form-item label="发起时间">{{repair.createTime}}</el-form-item>
            <el-form-item label="联系电话">{{repair.phone}}</el-form-item>
            <el-form-item label="处理状态">{{statusMap[repair.status]}}</el-form-item>
            <el-form-item label="费用">{{repair.fee ? repair.fee : '无'}}</el-form-item>
          </el-form>
        </el-card>
      </div>
      <p style="color: darkgrey; text-align: center; margin-top: 100px" v-show="repairs.length === 0">暂无内容</p>
      <mt-button class="button" size="small" type="primary" @click.prevent="dialogVisible = true">发起报修</mt-button>
      <el-dialog class="dialog" title="发起报修" :visible.sync="dialogVisible" width="250px" center>
        <el-form :model="repair" ref="repair" :rules="rules" style="text-align: center">
          <el-form-item prop="type">
            <el-input size="small" v-model="repair.type" placeholder="请输入报修类型" ></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input size="small" placeholder="请输入联系电话" v-model="repair.phone"></el-input>
          </el-form-item>
          <el-form-item prop="expectTime">
            <el-date-picker size="small" placeholder="请选择期望时间" value-format="yyyy-MM-dd" v-model="repair.expectTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <mt-button type="primary" style="margin-top: 10px" @click.prevent="send">发起</mt-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
  import axios from 'axios'
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: "Repair",
    data() {
      return {
        repairs: [],
        repair: {
          creator: this.$store.state.user.id,
          type: '',
          phone: '',
          expectTime: ''
        },
        dialogVisible: false,
        rules: {
          type: [{required: true, message: '请输入报修类型', trigger: 'blur'}],
          phone: [{required: true, message: '请输入联系电话', trigger: 'blur'}],
          expectTime: [{required: true, message: '请选择期望时间', trigger: 'blur'}]
        },
        statusMap: ['待查看', '待缴费', '已缴费待处理', '已处理']
      }
    },
    methods: {
      send() {
        this.$refs['repair'].validate(valid => {
          if (valid) {
            Indicator.open('请稍后...');
            axios.post('/repair/send', this.repair)
              .then(response => {
                if (response.data.status === 200) {
                  this.repair.content = '';
                  this.repair.title = '';
                  this.getRepairs();
                  this.dialogVisible = false;
                  Toast(response.data.message);
                } else {
                  Toast('发起失败');
                }
                Indicator.close();
              }).catch(() => {
              Toast('发起失败');
              Indicator.close();
            })
          }
        });
      },
      getRepairs() {
        Indicator.open('加载中');
        axios.get('/repair/getRepairsByUserId', {params: {userId: this.$store.state.user.id}})
          .then(response => {
            if (response.data.status === 200) {
              this.repairs = response.data.repairs;
            } else {
              Toast('加载失败');
            }
            Indicator.close();
          }).catch(() => {
          Toast('加载失败');
          Indicator.close();
        })
      }
    },
    created() {
      this.getRepairs();
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

  .el-form-item {
    margin-bottom: 0;
  }

  .dialog .el-form-item {
    margin-bottom: 15px;
  }

  .el-input {
    width: 200px;
  }

  .el-date-editor {
    width: 200px !important;
  }

  .button {
    position: fixed;
    bottom: 30px;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    width: 200px;
  }

  .notice {
    margin-left: 20px;
    margin-right: 20px;
    border-bottom: lightgray 1px solid;
  }
</style>
<style>
  .dialog .el-dialog__title {
    font-size: 16px;
  }
  .dialog .el-dialog__body {
    padding: 10px 5px;
  }
</style>
