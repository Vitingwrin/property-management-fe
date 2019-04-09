<template>
  <div class="background">
    <el-card v-loading="loading">
      <div slot="header">
        <span>后台管理登录</span>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="userName" ref="userName">
          <el-input type="text" clearable autocomplete autofocus v-model="loginForm.userName"
                    placeholder="用户名" @keyup.native="clearValidateInfo('userName')">
            <template slot="prefix">
              <span>&nbsp;</span><fa class="prefix-icon" icon="user"></fa>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="userPwd" ref="userPwd">
          <el-input type="password" autocomplete clearable v-model="loginForm.userPwd"
                    placeholder="密码" @keyup.native="clearValidateInfo('userPwd')">
            <template slot="prefix">
              <span>&nbsp;</span><fa class="prefix-icon" icon="lock"></fa>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div id="captcha"></div>
        </el-form-item>
        <el-form-item style="text-align: right" prop="captcha">
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as qs from 'querystring'
  import '../../../static/js/geetest/libs/gt.js'
  import 'gt3-sdk'
  export default {
    name: "Login",
    data() {
      const validator = (rule, value, callback) => {
        if (this.verified) {
          callback();
        } else {
          this.$message.error('请先完成验证');
        }
      };
      return {
        loginForm: {
          userName: '',
          userPwd: ''
        },
        captcha: null,
        verified: false,
        rules: {
          userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          userPwd: [{required: true, message: '请输入密码', trigger: 'blur'}],
          captcha: [{validator: validator}]
        },
        loading: false
      }
    },
    methods: {
      clearValidateInfo(ref) {
        this.$refs[ref].clearValidate();
      },
      login() {
        if (this.captcha === null) {
          this.$message.error("验证码加载失败");
          return;
        }
        this.$refs['loginForm'].validate((valid) => {
          if (valid && this.verified) {
            this.loading = true;
            axios({
              url: '/login',
              data: qs.stringify(this.loginForm),
              method: 'POST'
            }).then(response => {
              if (response.data.status === 200) {
                this.$store.commit('login', response.data.user);
                this.loading = false;
                if (response.data.user.authorities[0].authority === 'admin') {
                  this.$router.replace(this.$route.query.redirect == null ? '/admin' : this.$route.query.redirect);
                } else if (response.data.user.authorities[0].authority === 'super') {
                  this.$router.replace(this.$route.query.redirect == null ? '/super' : this.$route.query.redirect);
                } else {
                  this.$message.error('权限不足，请重新登陆');
                }
                this.$message.success(response.data.message);
              } else {
                this.loading = false;
                this.$message.error(response.data.message);
                this.clearValidateInfo("userName");
                this.clearValidateInfo("userPwd");
              }
            });
          } else {
            return false;
          }
        });
      }
    },
    mounted: function () {
      document.onkeyup = (e) => {
        if (e.key === "Enter") {
          this.login();
        }
      }
    },
    created: function () {
      axios.get("/initGeetest")
        .then(response => {
          window.initGeetest({
            // 以下配置参数来自服务端 SDK
            gt: response.data.gt,
            challenge: response.data.challenge,
            offline: !response.data.success,
            new_captcha: true,
            product: "popup",
            width: '410px'
          }, (captchaObj) => {
            captchaObj.appendTo("#captcha");
            // 这里可以调用验证实例 captchaObj 的实例方法
            captchaObj.onReady(() => {
              this.captcha = captchaObj;
            });
            captchaObj.onSuccess(() => {
              if (captchaObj.getValidate() === false) {
                this.$message.error("验证失败，请重试或刷新页面");
                return;
              }
              const param = captchaObj.getValidate();
              axios({
                method: 'POST',
                url: '/verifyLogin',
                data: qs.stringify(param)
              }).then(response => {
                if (response.data.status === 200) {
                  this.verified = true;
                } else {
                  this.$message.error(response.data.message);
                }
              }).catch(exception => {
                console.log(exception);
                this.$message.error("未知错误");
                this.loading = false;
              });
              captchaObj.onError(() => this.$message.error("验证码初始化失败，刷新试试"))
            });
          })
        })
    }

  }
</script>

<style scoped>
  .el-card {
    width: 450px;
    height: 350px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .background {
    background: url('/static/background/background.jpg');
    height: 100vh;
    width: 100vw;
    min-width: 1000px;
  }
</style>
