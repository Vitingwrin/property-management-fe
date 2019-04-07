<template>
  <div>
    <el-container class="outer" style="width: 1200px">
      <el-header class="header" style="height: 10vh">
        <el-menu :default-active="currentMenu" mode="horizontal" router
                  active-text-color="#409eff">
          <h1 style="margin-right: 400px">招聘网站</h1>
          <el-menu-item index="/job/index">首页</el-menu-item>
          <el-menu-item index="/job/jobSearch">职位查询</el-menu-item>
          <el-menu-item index="/job/newsBrowse">浏览新闻</el-menu-item>
          <el-menu-item index="/job/myResume">我的简历</el-menu-item>
          <el-menu-item index="/job/mySent">我的应聘</el-menu-item>
          <el-dropdown v-if="this.$store.getters.isLogin" @command="handleCommand" style="float: right;margin-right: 20px">
          <span class="dropdown">
            {{this.$store.state.user.name}}
            <i class="el-icon-caret-bottom"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="psnInfo">个人信息</el-dropdown-item>
              <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
              <el-dropdown-item v-show="this.$store.getters.isAdmin" command="admin">后台管理</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-else type="text" class="header-button" @click="login">登录</el-button>
        </el-menu>
      </el-header>
      <el-container>
        <el-main style="padding: 0">
          <el-scrollbar style="height: 85vh">
            <router-view></router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px"
               :close-on-click-modal="false" v-loading="loading">
      <el-form :model="pwdForm" ref="pwdForm" :rules="rules">
        <el-form-item ref="oldPwd" prop="oldPwd">
          <el-input type="password" size="medium" clearable="" autofocus v-model="pwdForm.oldPwd"
                    placeholder="请输入当前密码" @keyup.native="clearValidateInfo('oldPwd')">
            <template slot="prepend"><span>原密码</span></template>
          </el-input>
        </el-form-item>
        <el-form-item ref="newPwd" prop="newPwd">
          <el-input type="password" size="medium" clearable="" autofocus v-model="pwdForm.newPwd"
                    placeholder="请输入新密码" @keyup.native="clearValidateInfo('newPwd')">
            <template slot="prepend"><span>新密码</span></template>
          </el-input>
        </el-form-item>
        <el-form-item ref="newPwd2" prop="newPwd2">
          <el-input type="password" size="medium" clearable="" autofocus v-model="pwdForm.newPwd2"
                    placeholder="请再次输入新密码" @keyup.native="clearValidateInfo('newPwd2')">
            <template slot="prepend"><span>新密码</span></template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="changePwd">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import * as qs from 'querystring'
  import axios from 'axios'
  export default {
    name: "Job",
    data() {
      const validateOldPwd = async (rule,  value,  callback) => {
        if ('' === value) {
          callback(new Error('请输入原密码'));
        } else {
          await axios({
            url: '/user/validatePwd',
            method: 'POST',
            data: qs.stringify({username: this.pwdForm.username, password: this.pwdForm.oldPwd})
          }).then(response => {
            response.data.status === 200 ? callback() : callback(new Error(response.data.message));
          });
        }
      };
      const validateNewPwd = (rule, value, callback) => {
        if ('' === value) {
          callback(new Error('请输入新密码'));
        } else if (value === this.pwdForm.oldPwd) {
          callback(new Error('新密码不得和原密码一致'));
        } else {
          callback();
        }
      };
      const validateNewPwd2 = (rule, value, callback) => {
        if ('' === this.pwdForm.newPwd) {
          return;
        }
        if ('' === value) {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.pwdForm.newPwd) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };
      return {
        currentMenu: '/job/firstPage',
        dialogFormVisible: false,
        pwdForm: {
          username: '',
          oldPwd: '',
          newPwd: '',
          newPwd2: ''
        },
        loading: false,
        rules: {
          oldPwd: [{validator: validateOldPwd, trigger: 'blur'}],
          newPwd: [{validator: validateNewPwd, trigger: 'blur'}],
          newPwd2: [{validator: validateNewPwd2, trigger: 'blur'}]
        }
      }
    },
    watch: {
      $route () {
        this.changeMenuFromUrl(window.location.href);
      }
    },
    mounted: function () {
      this.changeMenuFromUrl(window.location.href);
    },
    methods: {
      clearValidateInfo(ref) {
        this.$refs[ref].clearValidate();
      },
      changePwd: function () {
        this.$refs['pwdForm'].validate(valid => {
          if (valid) {
            this.loading = true;
            this.pwdForm.username = this.$store.state.user.name;
            axios({
              url: '/user/changePwd',
              method: 'POST',
              data: qs.stringify(this.pwdForm)
            }).then(response => {
              if (response.data.status === 200) {
                this.$message.success(response.data.message);
                this.dialogFormVisible = false;
              } else {
                this.$message.error(response.data.message);
              }
              this.loading = false;
            }).catch(exception => {
              console.error(exception);
              this.$message.error("未知错误");
              this.loading = false;
            });
          }
        });
      },
      handleCommand(command) {
        switch (command) {
          case 'psnInfo':
            this.$router.push({name: 'myResume'});
            break;
          case 'pwd':
            this.dialogFormVisible = true;
            break;
          case 'admin':
            this.$router.push('/admin');
            break;
          case 'logout':
            this.$store.commit('logout');
            this.$router.push({name: 'login'});
            break;
        }
      },
      changeMenuFromUrl: function(url) {
        url = url.substr(url.indexOf('//') + 2);
        this.currentMenu = url.substr(url.indexOf('/'));
      },
      login() {
        this.$router.push({path: '/login'});
      }
    }
  }
</script>

<style scoped>

  .header {
    background-color: #fff;
    color: #fff;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 60px;
    position: relative;
  }

  .el-menu li:hover{
    color: #8cc4fd !important;
  }

  .header h1 {
    color: #409eff;
    margin: 0;
    float: left;
    font-size: 32px;
    font-weight: 400;
  }

  .header-button {
    float: right;
    padding: 3px 0;
    line-height: 60px;
    margin-right: 20px;
  }

  .outer {
    margin-left: auto;
    margin-right: auto;
  }

  .dropdown {
    color: #909399;
    cursor: pointer;
    width: 100%;
  }

  .dropdown:hover {
    color: #5cb6ff;
    transition: color .15s linear;
  }


</style>
