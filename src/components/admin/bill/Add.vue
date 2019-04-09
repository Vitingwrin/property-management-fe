<template>
  <div v-loading="loading" style="padding-left: 50px">
    <el-form ref="billForm" :model="bill" :rules="rules" label-width="100px" label-position="left">
      <el-form-item prop="residenceId" label="收费小区">
        <el-select v-model="residenceId" filterable remote reserve-keyword
                   placeholder="请输入关键词" :remote-method="remoteSearch" :loading="searching" value="">
          <el-option
            v-for="item in residences"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="费用名称">
        <el-input v-model="bill.name"></el-input>
      </el-form-item>
      <el-form-item prop="fee" label="费用">
        <el-input-number v-model="bill.fee" :precision="2" :step="1" :min="1" :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item style="margin-top: 50px">
        <el-row>
          <el-button type="primary" plain style="width: 45%" @click="resetForm('billForm')">重置</el-button>
          <el-button type="primary" style="width: 45%" @click="initiate">发起缴费</el-button>
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
      return {
        loading: false,
        searching: false,
        bill: {
          name: '',
          fee: ''
        },
        residenceId: '',
        residences: [],
        rules: {
          name: [{required: true, message: '请填写费用名称', trigger: 'blur'}],
          fee: [{required: true, message: '请输入费用', trigger: 'blur'}],
          residenceId: [{required: true, message: '请选择收费小区', trigger: 'blur'},],
        }
      }
    },
    methods: {
      resetForm(form) {
        this.$refs[form].resetFields();
      },
      remoteSearch(query) {
        this.searching = true;
        setTimeout(() => {
          axios.get('/residence/getAllCheckedResidences')
            .then(response => {
              if (response.data.status === 200) {
                this.residences = response.data.residences.filter(item => {
                  return (item.name.toLowerCase().indexOf(query.toLowerCase()) > -1)
                    || (item.code.toLowerCase().indexOf(query.toLowerCase()) > -1);
                });
                if (this.residences.length === 0) {
                  this.residences = response.data.residences;
                }
                this.searching = false;
              }
            })
        }, 200);
      },
      initiate() {
        this.$refs['billForm'].validate(valid => {
          if (valid) {
            const params = {
              name: this.bill.name,
              fee: this.bill.fee,
              residenceId: this.residenceId
            };
            this.loading = true;
            axios({
              url: '/bill/initiate',
              data: qs.stringify(params),
              method: 'POST'
            }).then(response => {
                if (response.data.status === 200) {
                  this.$message.success(response.data.message);
                  this.resetForm('billForm');
                } else {
                  this.$message.error(response.data.message);
                }
                this.loading = false;
              }).catch(exception => {
              console.log(exception);
              this.$message.error('未知错误');
              this.loading = false;
            })
          }
        });
      }
    }
  }
</script>

<style scoped>

  .el-form-item {
    min-width: 40%;
    width: 50%;
  }
  .el-input-number {
    display: inline-block;
  }
</style>
