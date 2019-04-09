<template>
  <div v-loading="loading" style="padding-left: 50px">
    <el-form ref="propertyForm" :model="property" :rules="rules" label-width="100px" label-position="left">
      <el-form-item prop="residence" label="所属小区" ref="residence">
        <el-select v-model="property.residence" filterable remote reserve-keyword @change="handleChange"
                   placeholder="请输入关键词" :remote-method="remoteSearch" :loading="searching" value="">
          <el-option
            v-for="item in residences"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="code" ref="code" label="房产编码">
        <el-input v-model="property.code"></el-input>
      </el-form-item>
      <el-form-item prop="buildings" ref="requireCount" label="所属楼栋">
        <el-select v-model="property.buildings" placeholder="请选择" value="">
          <el-option
            v-for="item in selectedResidence.buildingsNum"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="doorplate" ref="doorplate" label="门牌号">
        <el-input v-model="property.doorplate"></el-input>
      </el-form-item>
      <el-form-item prop="unit" ref="unit" label="单元号">
        <el-input v-model="property.unit"></el-input>
      </el-form-item>
      <el-form-item prop="area" ref="area" label="面积">
        <el-input v-model="property.area"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 50px">
        <el-row>
          <el-button type="primary" plain style="width: 45%" @click="resetForm('propertyForm')">重置</el-button>
          <el-button type="primary" style="width: 45%" @click="save">保存房产</el-button>
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
          callback(new Error('请填写房产编码'));
        } else {
          await axios.get('/property/checkCodeUnique', {params: {code: value}})
            .then(response => {
              response.data.status === 200 ? callback() : callback(new Error(response.data.message));
            });
        }
      };
      return {
        loading: false,
        searching: false,
        property: {
          id: this.$route.params.id,
          code: this.$route.params.code,
          residence: this.$route.params.residence,
          buildings: this.$route.params.buildings,
          doorplate: this.$route.params.doorplate,
          area: this.$route.params.area,
          unit: this.$route.params.unit,
          status: this.$route.params.status === undefined ? '未售' : this.$route.params.status
        },
        selectedResidence: {},
        residences: [],
        rules: {
          residence: [{required: true, message: '请选择所属小区', trigger: 'blur'}],
          code: [{required: true, validator: validateCode, trigger: 'blur'}],
          buildings: [{required: true, message: '请选择所属楼栋', trigger: 'blur'},],
          doorplate: [{required: true, message: '请填写门牌号', trigger: 'blur'}],
          area: [{required: true, message: '请填写面积', trigger: 'blur'}],
          unit: [{required: true, message: '请填写单元号', trigger: 'blur'}],
        }
      }
    },
    methods: {
      handleChange(value) {
        for (let i = 0; i < this.residences.length; i++) {
          if (value === this.residences[i].id) {
            this.selectedResidence = this.residences[i];
          }
        }
      },
      remoteSearch(query) {
        this.searching = true;
        setTimeout(() => {
          axios.get('/residence/getAllResidences')
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
      resetForm(form) {
        this.$refs[form].resetFields();
        this.property.id = '';
        this.property.code = '';
        this.property.buildings= '';
        this.property.residence = '';
        this.property.doorplate = '';
        this.property.unit = '';
        this.property.area = '';
        this.property.status = '未售';
      },
      save() {
        this.$refs['propertyForm'].validate(valid => {
          if (valid) {
            this.loading = true;
            axios.post('/property/saveProperty', this.property)
              .then(response => {
                if (response.data.status === 200) {
                  this.$message.success(response.data.message);
                  this.resetForm('propertyForm');
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
