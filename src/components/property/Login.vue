<template>
  <div>
    <mt-header fixed title="物业管理登录"></mt-header>
    <div class="top-card"></div>
    <div class="login">
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="userName">
          <el-input type="text" clearable autofocus v-model="loginForm.userName"
                    placeholder="用户名" >
            <template slot="prefix">
              <span>&nbsp;</span><fa class="prefix-icon" icon="user"></fa>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" clearable v-model="loginForm.userPwd"
                    placeholder="密码" >
            <template slot="prefix">
              <span>&nbsp;</span><fa class="prefix-icon" icon="lock"></fa>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <mt-button class="button" type="primary" @click.prevent="login">登录</mt-button>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as qs from 'querystring'
  import {Toast, Indicator} from 'mint-ui'
  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          userName: '',
          userPwd: ''
        },
        rules: {
          userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          userPwd: [{required: true, message: '请输入密码', trigger: 'blur'}],
        }
      }
    },
    methods: {
      login() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            Indicator.open('登录中...');
            axios({
              url: '/login',
              data: qs.stringify(this.loginForm),
              method: 'POST'
            }).then(response => {
              if (response.data.status === 200) {
                this.$store.commit('login', response.data.user);
                Indicator.close();
                if (response.data.user.authorities[0].authority === 'user') {
                  Toast(response.data.message);
                  this.$router.replace(this.$route.query.redirect == null ? '/' : this.$route.query.redirect);
                } else {
                  Toast('请登录普通用户');
                }
              } else {
                Indicator.close();
                Toast(response.data.message);
              }
            });
          }
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
  .button {
    width: 150px;
    position: fixed;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    top: 300px;
  }
  .login {
    margin-top: 100px;
    text-align: center;
    margin-left: 20px;
    margin-right: 20px;
  }
</style>
