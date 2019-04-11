<template>
  <transition>
    <div style="background: #f5f5f5; height: 100vh;">
      <mt-header fixed title="修改密码">
        <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        <mt-button icon="more" slot="right"></mt-button>
      </mt-header>
      <div class="top-card"></div>
      <mt-field label="原密码" placeholder="请输入原密码" type="password" v-model="pwdForm.oldPwd"></mt-field>
      <mt-field label="新密码" placeholder="请输入新密码" type="password" v-model="pwdForm.newPwd"></mt-field>
      <mt-field label="确认密码" placeholder="请再次输入新密码" type="password" v-model="pwdForm.newPwd2"></mt-field>
      <mt-button @click="verifyAndChange" class="center" type="primary">确认修改</mt-button>
    </div>
  </transition>
</template>

<script>
  import axios from 'axios'
  import {Toast, Indicator} from 'mint-ui'
  import * as qs from 'querystring'
  export default {
    name: "Password",
    data() {
      return {
        pwdForm: {
          username: this.$store.state.user.username,
          oldPwd: '',
          newPwd: '',
          newPwd2: ''
        },
      }
    },
    methods: {
      verifyAndChange() {
        if (this.pwdForm.oldPwd === '' || this.pwdForm.newPwd === '' || this.pwdForm.newPwd2 === '') {
          Toast('请输入正确的信息');
          return;
        }
        if (this.pwdForm.newPwd !== this.pwdForm.newPwd2) {
          Toast('两次密码不一致');
          return;
        }
        Indicator.open();
        axios({
          url: '/user/validatePwd',
          method: 'POST',
          data: qs.stringify({username: this.pwdForm.username, password: this.pwdForm.oldPwd})
        }).then(response => {
          if(response.data.status === 200) {
            this.changePwd()
          } else{
            Toast(response.data.message);
            Indicator.close();
          }
        });
      },
      changePwd() {
        this.loading = true;
        axios({
          url: '/user/changePwd',
          method: 'POST',
          data: qs.stringify(this.pwdForm)
        }).then(response => {
          if (response.data.status === 200) {
            Toast(response.data.message);
          } else {
            Toast(response.data.message);
          }
          Indicator.close();
        }).catch(exception => {
          console.error(exception);
          Toast("未知错误");
          Indicator.close();
        });
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
  .center {
    position: fixed;
    width: 200px;
    height: 40px;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    top: 200px;
  }
</style>
