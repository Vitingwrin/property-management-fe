<template>
  <transition>
    <div style="margin-bottom: 48px">
      <mt-header fixed title="投诉建议">
        <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        <mt-button slot="right" @click.prevent="feLogout"><fa icon="sign-out-alt"></fa></mt-button>
      </mt-header>
      <div class="top-card"></div>

      <div v-for="complaint in complaints" :key="complaint.id">
        <el-card shadow="never" class="fe-card">
          <div slot="header" style="height: 15px; text-align: center">
            <span style="font-size: 14px;">{{complaint.title}}</span>
          </div>
          <el-form :model="complaint" label-width="100px" label-position="left">
            <el-form-item label="投诉内容">{{complaint.content}}</el-form-item>
            <el-form-item label="发起时间">{{complaint.createTime}}</el-form-item>
            <el-form-item label="反馈结果">{{complaint.feedbackContent ? complaint.feedbackContent : '未处理'}}</el-form-item>
            <el-form-item label="反馈时间">{{complaint.feedbackTime ? complaint.feedbackTime : '未处理'}}</el-form-item>
          </el-form>
        </el-card>
      </div>
      <p style="color: darkgrey; text-align: center; margin-top: 100px" v-show="complaints.length === 0">暂无内容</p>
      <mt-button class="button" size="small" type="primary"
                 :disabled="!sendable"
                 @click="dialogVisible = true">
        {{sendable ? '发起投诉或建议' : '请先等待上一个投诉处理'}}
      </mt-button>
      <el-dialog class="dialog" title="发起投诉或建议" :visible.sync="dialogVisible" width="250px" center>
        <el-form :model="complaint" ref="complaint" :rules="rules" style="text-align: center">
          <el-form-item prop="title">
            <el-input size="small" v-model="complaint.title" placeholder="请输入标题" ></el-input>
          </el-form-item>
          <el-form-item prop="content">
            <el-input size="small" type="textarea" :rows="3" placeholder="请输入内容" v-model="complaint.content" label="内容"></el-input>
          </el-form-item>
          <el-form-item>
            <mt-button type="primary" @click.prevent="send">发起</mt-button>
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
    name: "Complaint",
    data() {
      return {
        complaints: [],
        complaint: {
          creator: this.$store.state.user.id,
          title: '',
          content: ''
        },
        dialogVisible: false,
        rules: {
          title: [{required: true, message: '请输入标题', trigger: 'blur'}],
          content: [{required: true, message: '请输入内容', trigger: 'blur'}]
        }
      }
    },
    computed: {
      sendable() {
        return this.complaints.length === 0 || this.complaints[0].feedbackContent !== undefined
      }
    },
    methods: {
      send() {
        this.$refs['complaint'].validate(valid => {
          if (valid) {
            Indicator.open('请稍后...');
            axios.post('/complaint/send', this.complaint)
              .then(response => {
                if (response.data.status === 200) {
                  this.complaint.content = '';
                  this.complaint.title = '';
                  this.getComplaints();
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
      getComplaints() {
        Indicator.open('加载中');
        axios.get('/complaint/getComplaintsByUserId', {params: {userId: this.$store.state.user.id}})
          .then(response => {
            if (response.data.status === 200) {
              this.complaints = response.data.complaints;
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
      this.getComplaints();
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

  .el-input {
    width: 200px;
  }

  .el-textarea {
    width: 200px;
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
