<template>
  <div v-loading="loading" style="padding-left: 50px">
    <el-form ref="residentForm" :model="resident" :rules="rules" label-width="100px" label-position="left">
      <el-form-item prop="user" label="入住用户">
        <el-select v-model="resident.user" filterable remote reserve-keyword
                   placeholder="请输入关键词" :remote-method="userRemoteSearch" :loading="userSearching" value="">
          <el-option
            v-for="item in users"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="property" label="入住房产">
        <el-select v-model="resident.property" filterable remote reserve-keyword
                   placeholder="请输入关键词" :remote-method="propertyRemoteSearch" :loading="propertySearching" value="">
          <el-option
            v-for="item in properties"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="住户姓名">
        <el-input v-model="resident.name"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="住户手机">
        <el-input v-model="resident.phone"></el-input>
      </el-form-item>
      <el-form-item prop="idCard" label="住户身份证">
        <el-input v-model="resident.idCard"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 50px">
        <el-row>
          <el-button type="primary" plain style="width: 45%" @click="resetForm">重置</el-button>
          <el-button type="primary" style="width: 45%" @click="save">入住房产</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "CheckIn",
    data() {
      return {
        loading: false,
        userSearching: false,
        propertySearching: false,
        users: [],
        resident: {
          name: '',
          idCard: '',
          phone: '',
          property: ''
        },
        properties: [],
        rules: {
          name: [{required: true, message: '请填写住户姓名', trigger: 'blur'}],
          user: [{required: true, message: '请选择入住用户', trigger: 'blur'}],
          property: [{required: true, message: '请选择入住房产', trigger: 'blur'}],
          idCard: [{required: true, message: '请填写住户身份证号码', trigger: 'blur'}],
          phone: [{required: true, message: '请填写住户手机', trigger: 'blur'}]
        }
      }
    },
    methods: {
      propertyRemoteSearch(query) {
        this.propertySearching = true;
        setTimeout(() => {
          axios.get('/property/getAllUnsoldProperties')
            .then(response => {
              if (response.data.status === 200) {
                this.properties = response.data.properties.filter(item => {
                  return (item.name.toLowerCase().indexOf(query.toLowerCase()) > -1)
                    || (item.code.toLowerCase().indexOf(query.toLowerCase()) > -1);
                });
                if (this.properties.length === 0) {
                  this.properties = response.data.properties;
                }
                this.propertySearching = false;
              }
            })
        }, 200);
      },
      userRemoteSearch(query) {
        this.userSearching = true;
        setTimeout(() => {
          axios.get('/user/getAllUsers')
            .then(response => {
              if (response.data.status === 200) {
                this.users = response.data.users.filter(item => {
                  return (item.name.toLowerCase().indexOf(query.toLowerCase()) > -1)
                    || (item.username.toLowerCase().indexOf(query.toLowerCase()) > -1);
                });
                if (this.users.length === 0) {
                  this.users = response.data.users;
                }
                this.userSearching = false;
              }
            })
        }, 200);
      },
      resetForm() {
        this.$refs['residentForm'].resetFields();
      },
      save() {
        this.$refs['residentForm'].validate(valid => {
          if (valid) {
            this.loading = true;
            axios.post('/resident/saveResident', this.resident)
              .then(response => {
                if (response.data.status === 200) {
                  this.$message.success(response.data.message);
                  this.resetForm('residentForm');
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
        })

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
