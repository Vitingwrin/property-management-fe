<template>
  <div v-loading="loading" style="padding-left: 50px">
    <el-form ref="jobForm" :model="job" :rules="rules" label-width="100px" label-position="left">
      <el-form-item prop="name" ref="name" label="名称">
        <el-input v-model="job.name"></el-input>
      </el-form-item>
      <el-form-item prop="place" ref="place" label="工作地点">
        <el-input v-model="job.place"></el-input>
      </el-form-item>
      <el-form-item prop="company" label="所属公司" ref="company">
        <el-select v-model="job.company" filterable remote reserve-keyword
                   placeholder="请输入关键词" :remote-method="remoteSearch" :loading="searching">
          <el-option
            v-for="item in companies"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="requireCount" ref="requireCount" label="招聘人数">
        <el-input-number v-model="job.requireCount" :min="0" :max="1000" size="small" controls-position="right"/>
      </el-form-item>
      <el-form-item prop="education" ref="education" label="学历要求">
        <el-select v-model="job.education" placeholder="请选择">
          <el-option
            v-for="item in eduOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="sex" label="性别要求">
        <el-radio-group v-model="job.sex">
          <el-radio label="男" value="男"></el-radio>
          <el-radio label="女" value="女"></el-radio>
          <el-radio label="不限" value="不限"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="age" label="年龄要求" style="width: 100%" ref="age">
        <el-input-number v-model="job.age1" :min="0" :max="100" size="small" controls-position="right"/>
        &emsp;-&emsp;
        <el-input-number v-model="job.age2" :min="0" :max="100" size="small" controls-position="right"/>
      </el-form-item>
      <el-form-item prop="workYear" label="工作年限" style="width: 100%" ref="workYear">
        <el-slider v-model="job.workYear" :max="50" style="width: 43%" show-input
                   :show-input-controls="false" input-size="mini" />
      </el-form-item>
      <el-form-item prop="intro" label="介绍" ref="intro">
        <el-input type="textarea" v-model="job.intro" :rows="7" />
      </el-form-item>
      <el-form-item style="margin-top: 50px">
        <el-row>
          <el-button type="primary" plain style="width: 45%" @click="resetForm('jobForm')">重置</el-button>
          <el-button type="primary" style="width: 45%" @click="release">发布职位</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "JobAdd",
    data() {
      const ageValidator = (rule, value, callback) => {
        if (this.job.age1 > this.job.age2) {
          callback(new Error('请选择正确的区间'));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        searching: false,
        job: {
          id: this.$route.params.id,
          name: this.$route.params.name,
          workYear: this.$route.params.workYear,
          age1: this.$route.params.age1,
          age2: this.$route.params.age2,
          sex: this.$route.params.sex,
          place: this.$route.params.place,
          requireCount: this.$route.params.requireCount,
          education: this.$route.params.education,
          company: this.$route.params.company,
          intro: this.$route.params.intro,
          creator: this.$store.state.user.id
        },
        companies: [],
        rules: {
          name: [{required: true, message: '请填写名称', trigger: 'blur'}],
          sex: [{required: true, message: '请选择性别要求', trigger: 'blur'}],
          place: [{required: true, message: '请填写工作地点', trigger: 'blur'}],
          education: [{required: true, message: '请选择学历要求', trigger: 'blur'}],
          company: [{required: true, message: '请选择所属公司', trigger: 'blur'}],
          intro: [{required: true, message: '请填写介绍', trigger: 'blur'}],
          age: [{validator: ageValidator}]
        },
        eduOptions: [
          {label: '无要求', value: '无要求'},
          {label: '高中', value: '高中'},
          {label: '本科', value: '本科'},
          {label: '研究生', value: '研究生'},
          {label: '博士生', value: '博士生'}
        ]
      }
    },
    methods: {
      remoteSearch(query) {
        if (query !== '') {
          this.searching = true;
          setTimeout(() => {
            axios.post('/company/getAllCompanies')
              .then(response => {
                if (response.data.status === 200) {
                  this.companies = response.data.companies.filter(item => {
                    return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
                  });
                  if (this.companies.length === 0) {
                    this.companies = response.data.companies;
                  }
                  this.searching = false;
                }
              })
          }, 200);
        } else {
          this.companies = [];
        }
      },
      resetForm(form) {
        this.$refs[form].resetFields();
        this.job.company = '';
        this.job.age1 = 0;
        this.job.age2 = 0;
        this.job.workYear = 0;
        this.job.sex = '';
      },
      release() {
        this.$refs['jobForm'].validate(valid => {
          if (valid) {
            this.loading = true;
            axios.post('/job/release', this.job)
              .then(response => {
                if (response.data.status === 200) {
                  this.$message.success(response.data.message);
                  this.resetForm('jobForm');
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
