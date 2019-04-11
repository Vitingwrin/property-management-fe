<template>
  <div v-loading="loading" style="padding-left: 50px">
    <el-form ref="noticeForm" :model="notice" :rules="rules" label-width="100px" label-position="left">
      <el-form-item prop="title" label="公告标题">
        <el-input v-model="notice.title"></el-input>
      </el-form-item>
      <el-form-item prop="content" label="公告内容">
        <el-input type="textarea" :rows="10" v-model="notice.content"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 50px">
        <el-row>
          <el-button type="primary" plain style="width: 45%" @click="resetForm('residenceForm')">重置</el-button>
          <el-button type="primary" style="width: 45%" @click="save">发布公告</el-button>
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
          callback(new Error('请填写公告标题'));
        } else if (value === this.$route.params.title) {
          callback();
        } else {
          await axios.get('/notice/checkTitleUnique', {params: {title: value}})
            .then(response => {
              response.data.status === 200 ? callback() : callback(new Error(response.data.message));
            });
        }
      };
      return {
        loading: false,
        notice: {
          id: this.$route.params.id,
          title: this.$route.params.title,
          content: this.$route.params.content,
          creator: this.$store.state.user.id
        },
        rules: {
          title: [{required: true, validator: validateCode, trigger: 'blur'}],
          content: [{required: true, message: '请填写公告内容', trigger: 'blur'}],
        }
      }
    },
    methods: {
      resetForm(form) {
        this.$refs[form].resetFields();
        this.notice.id = '';
        this.notice.title = '';
        this.notice.content = '';
      },
      save() {
        this.$refs['noticeForm'].validate(valid => {
          if (valid) {
            this.loading = true;
            axios.post('/notice/saveNotice', this.notice)
              .then(response => {
                if (response.data.status === 200) {
                  this.$message.success(response.data.message);
                  this.resetForm('noticeForm');
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
