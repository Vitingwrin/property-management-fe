<template>
  <div v-loading="loading" style="padding-left: 50px">
    <el-form ref="residenceForm" :model="residence" :rules="rules" label-width="100px" label-position="left">
      <el-form-item prop="name" ref="name" label="小区名称">
        <el-input v-model="residence.name"></el-input>
      </el-form-item>
      <el-form-item prop="code" ref="code" label="小区编码">
        <el-input v-model="residence.code"></el-input>
      </el-form-item>
      <el-form-item prop="buildingsNum" ref="requireCount" label="楼栋数">
        <el-input-number v-model="residence.buildingsNum" :min="1" :max="100" size="small" controls-position="right"/>
      </el-form-item>
      <el-form-item style="margin-top: 50px">
        <el-row>
          <el-button type="primary" plain style="width: 45%" @click="resetForm('residenceForm')">重置</el-button>
          <el-button type="primary" style="width: 45%" @click="save">保存小区</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "Add",
    data() {
      const validateCode = async (rule, value, callback) => {
        if (value === undefined || '' === value) {
          callback(new Error('请填写小区编码'));
        } else {
          await axios.get('/residence/checkCodeUnique', {params: {code: value}})
            .then(response => {
            response.data.status === 200 ? callback() : callback(new Error(response.data.message));
          });
        }
      };
      return {
        loading: false,
        searching: false,
        residence: {
          id: this.$route.params.id,
          name: this.$route.params.name,
          code: this.$route.params.code,
          buildingsNum: this.$route.params.buildingsNum
        },
        rules: {
          name: [{required: true, message: '请填写小区名称', trigger: 'blur'}],
          code: [{required: true, validator: validateCode, trigger: 'blur'}],
          buildingsNum: [{type: 'number', required: true, message: '请填写正确的楼栋数', trigger: 'blur'},],
        }
      }
    },
    methods: {
      resetForm(form) {
        this.$refs[form].resetFields();
        this.residence.id = '';
        this.residence.name = '';
        this.residence.code = '';
        this.residence.buildingsNum = 1;
      },
      save() {
        this.$refs['residenceForm'].validate(valid => {
          if (valid) {
            this.loading = true;
            axios.post('/residence/saveResidence', this.residence)
              .then(response => {
                if (response.data.status === 200) {
                  this.$message.success(response.data.message);
                  this.resetForm('residenceForm');
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
