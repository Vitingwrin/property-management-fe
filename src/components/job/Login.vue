<template>
  <el-container>
    <el-main>
      <transition name="el-zoom-in-top">
        <el-card v-show="loginPage" v-loading="loading" shadow="hover">
          <div slot="header">
            <span>&emsp;登录</span>
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
              <el-button @click="loginPage = false">注册</el-button>
              <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </transition>
      <transition  name="el-zoom-in-bottom">
        <el-card v-show="!loginPage" v-loading="loading" shadow="hover">
          <div slot="header">
            <span>&emsp;注册</span>
          </div>
          <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
            <el-form-item prop="username" ref="username">
              <el-input type="text" clearable autocomplete autofocus v-model="registerForm.username"
                        placeholder="用户名" @keyup.native="clearValidateInfo('username')">
                <template slot="prefix">
                  <span>&nbsp;</span><fa class="prefix-icon" icon="user"></fa>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="name" ref="name">
              <el-input type="text" clearable autocomplete autofocus v-model="registerForm.name"
                        placeholder="昵称" @keyup.native="clearValidateInfo('name')">
                <template slot="prefix">
                  <span>&nbsp;</span><fa class="prefix-icon" icon="user"></fa>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password" ref="password">
              <el-input type="password" autocomplete clearable v-model="registerForm.password"
                        placeholder="请输入密码" @keyup.native="clearValidateInfo('password')">
                <template slot="prefix">
                  <span>&nbsp;</span><fa class="prefix-icon" icon="lock"></fa>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password2" ref="password2">
              <el-input type="password" autocomplete clearable v-model="registerForm.password2"
                        placeholder="再次输入密码" @keyup.native="clearValidateInfo('password2')">
                <template slot="prefix">
                  <span>&nbsp;</span><fa class="prefix-icon" icon="lock"></fa>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="email" ref="email">
              <el-input type="text" autocomplete clearable v-model="registerForm.email"
                        placeholder="请输入电子邮箱" @keyup.native="clearValidateInfo('email')">
                <template slot="prefix">
                  <span>&nbsp;</span><fa class="prefix-icon" icon="at"></fa>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item style="text-align: right" prop="captcha">
              <el-button @click="loginPage = true">返回</el-button>
              <el-button type="primary" @click="register">注册</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </transition>
    </el-main>
  </el-container>
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
      const validatePass2 = (rule, value, callback) => {
        if ('' === this.registerForm.password) {
          return;
        }
        if ('' === value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };
      return {
        loginForm: {
          userName: '',
          userPwd: ''
        },
        registerForm: {
          username: '',
          name: '',
          password: '',
          password2: '',
          email: ''
        },
        loginPage: true,
        captcha: null,
        verified: false,
        rules: {
          userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          userPwd: [{required: true, message: '请输入密码', trigger: 'blur'}],
          captcha: [{validator: validator}]
        },
        registerRules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          name: [{required: true, message: '请输入昵称', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          password2: [{validator: validatePass2, trigger: 'blur'}],
          email: [{type: 'email', message: '请输入正确的电子邮箱地址', trigger: 'blur'}]
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
          this.$message.error("验证码走丢了");
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
                // this.$router.push(this.$route.query == null ? '/job/index' : this.$route.query.redirect);
                this.$router.replace(this.$route.query.redirect == null ? '/job/index' : this.$route.query.redirect);
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
      },
      register: function () {
        this.loading = true;
        this.$refs['registerForm'].validate(valid => {
          if (valid) {
            this.validateOthers(valid => {
              if (valid) {
                axios({
                  url: '/user/addUser',
                  method: 'POST',
                  data: qs.stringify(this.registerForm)
                }).then(response => {
                  if (response.data.status === 200) {
                    this.$refs['registerForm'].resetFields();
                    this.$message.success(response.data.message);
                    this.loginPage = true;
                  } else {
                    this.$message.error(response.data.message);
                  }
                  this.loading = false;
                }).catch(exception => {
                  console.log(exception);
                  this.$message.error("未知错误");
                });
              } else {
                this.loading = false;
              }
            });
          } else {
            this.loading = false;
          }
        });
      },
      validateOthers: function (callback) {
        axios.get('/user/checkUsernameUnique', {params: {username: this.registerForm.username}})
          .then(response => {
            if (response.data.status === 500) {
              this.$message.error(response.data.message);
              callback(false);
            } else {
              callback(true);
            }
          }).catch(exception => {
          console.log(exception);
          this.$message.error("未知错误");
          callback(false);
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
    position: absolute;
    opacity: 0.7;
    width: 450px;
    right: 150px;
    margin-top: 20vh;
  }
  .el-card:hover {
    opacity: 1;
  }
  .el-container {
    background: url('/static/background/background.jpg');
    height: 100vh;
    width: 100vw;
    min-width: 1000px;
  }
</style>
