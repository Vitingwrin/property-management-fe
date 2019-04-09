<template>
  <div v-loading="loading">
    <el-form :model="userForm" :rules="rules" ref="userForm">
      <el-form-item prop="username" ref="username">
        <el-input type="text" size="medium" clearable autofocus v-model="userForm.username" placeholder="请输入用户名"
                  @keyup.native="clearValidateInfo('username')">
          <template slot="prepend"><span>用户名</span></template>
        </el-input>
      </el-form-item>

      <el-form-item prop="name" ref="name">
        <el-input type="text" size="medium" clearable autofocus v-model="userForm.name" placeholder="请输入姓名"
                  @keyup.native="clearValidateInfo('name')">
          <template slot="prepend"><span>姓名&emsp;</span></template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password" ref="password">
        <el-input type="password" size="medium" clearable v-model="userForm.password" placeholder="请输入密码"
                  @keyup.native="clearValidateInfo('password')">
          <template slot="prepend"><span>密码&emsp;</span></template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password2" ref="password2">
        <el-input type="password" size="medium" clearable v-model="userForm.password2" placeholder="请再次输入密码"
                  @keyup.native="clearValidateInfo('password2')">
          <template slot="prepend"><span>密码&emsp;</span></template>
        </el-input>
      </el-form-item>

      <el-form-item prop="phone" ref="phone">
        <el-input type="text" size="medium" clearable v-model="userForm.phone" placeholder="请输入手机号码"
                  @keyup.native="clearValidateInfo('phone')">
          <template slot="prepend"><span>手机&emsp;</span></template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-row>
          <el-button type="primary" style="width: 15rem" @click="addUser">添加管理员</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as qs from 'querystring'

  export default {
    name: "Add",
    data() {
      const validatePass2 = (rule, value, callback) => {
        if ('' === this.userForm.password) {
          return;
        }
        if ('' === value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userForm.password) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };
      return {
        userForm: {
          username: '',
          name: '',
          password: '',
          password2: '',
          phone: ''
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          name: [{required: true, message: '请输入昵称', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          password2: [{validator: validatePass2, trigger: 'blur'}],
          phone: [{required: true, message: '请输入手机号码', trigger: 'blur'}]
        },
        loading: false
      }
    },
    mounted: function () {
      document.onkeyup = e => {
        if (e.key === "Enter") {
          this.addUser();
        }
      }
    },
    methods: {
      clearValidateInfo(ref) {
        this.$refs[ref].clearValidate();
      },
      addUser: function () {
        this.loading = true;
        this.$refs['userForm'].validate(valid => {
          if (valid) {
            this.validateOthers(valid => {
              if (valid) {
                axios({
                  url: '/user/addAdmin',
                  method: 'POST',
                  data: qs.stringify(this.userForm)
                }).then(response => {
                  if (response.data.status === 200) {
                    this.$refs['userForm'].resetFields();
                    this.$message.success(response.data.message);
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
        axios.get('/user/checkUsernameUnique', {params: {username: this.userForm.username}})
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
    }
  }
</script>

<style scoped>

</style>
