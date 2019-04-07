<template>
  <div v-loading="loading">
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

      <el-form-item>
        <el-row>
          <el-button type="primary" style="width: 15rem" @click="changePwd">确认修改</el-button>
        </el-row>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as qs from 'querystring'

  export default {
    name: "UserPwd",
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
        loading: false,
        pwdForm: {
          username: '',
          oldPwd: '',
          newPwd: '',
          newPwd2: ''
        },
        rules: {
          oldPwd: [{validator: validateOldPwd, trigger: 'blur'}],
          newPwd: [{validator: validateNewPwd, trigger: 'blur'}],
          newPwd2: [{validator: validateNewPwd2, trigger: 'blur'}]
        }
      }
    },
    mounted: function() {
      document.onkeyup = e => {
        if (e.key === 'Enter') {
          this.changePwd();
        }
      }
    },
    methods: {
      clearValidateInfo(ref) {
        this.$refs[ref].clearValidate();
      },
      changePwd: function () {
        this.$refs['pwdForm'].validate(valid => {
          if (valid) {
            this.loading = true;
            axios({
              url: '/user/changePwd',
              method: 'POST',
              data: qs.stringify(this.pwdForm)
            }).then(response => {
              if (response.data.status === 200) {
                this.$message.success(response.data.message);
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
      }
    }
  }
</script>

<style scoped>

</style>
