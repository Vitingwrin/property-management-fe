<template>
  <div v-loading="loading">
    <el-form :model="newsForm" :rules="rules" ref="newsForm">
      <el-form-item prop="title" ref="title" style="width: 100%">
        <el-input type="text" size="medium" clearable autofocus v-model="newsForm.title" placeholder="请输入新闻标题"
                  @keyup.native="clearValidateInfo('title')">
          <template slot="prepend"><span>标题</span></template>
        </el-input>
      </el-form-item>

      <el-form-item prop="summary" ref="summary">
        <el-input type="text" size="medium" clearable v-model="newsForm.summary" placeholder="一句话概括一下"
                  @keyup.native="clearValidateInfo('summary')">
          <template slot="prepend"><span>描述</span></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="poster" ref="poster" style="width: 500px">
        <el-upload
          class="avatar-uploader"
          action="http://120.79.93.191:8080/news/uploadPoster"
          :file-list="poster"
          :limit="1"
          drag
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview"
          :on-success="handlePictureSuccess"
          :on-remove="handleRemove">
          <img v-if="newsForm.posterUrl" :src="newsForm.posterUrl" style="display: block; width: 500px" alt="">
          <div v-else style="width: 500px">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将海报拖到此处，或<em>点击上传</em></div>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="newsForm.posterUrl" alt="">
        </el-dialog>
      </el-form-item>
      <mavon-editor ref="md" class="editor" v-model="editor" @imgAdd="upload" @change="cache"/>

      <el-form-item>
        <el-row>
          <el-button type="primary" plain style="width: 15rem" @click="resetForm('newsForm')">重置</el-button>
          <el-button type="primary" style="width: 15rem" @click="publish">发表</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import axios from 'axios'
  import * as qs from 'querystring'

  export default {
    name: "Publish",
    data() {
      return {
        newsForm: {
          title: this.$route.params.title,
          summary: this.$route.params.summary,
          markdown: '',
          status: this.$route.params.status,
          html: '',
          posterUrl: this.$route.params.posterUrl,
          id: this.$route.params.id
        },
        poster: [],
        dialogImageUrl: this.$route.params.posterUrl,
        dialogVisible: false,
        rules: {
          title: [{required: true, message: '请填写标题', trigger: 'blur'}],
          summary: [{required: true, message: '请填写概括', trigger: 'blur'}],
          posterUrl: [{required: true, message: '请上传海报', trigger: 'blur'}]
        },
        editor: this.$route.params.markdown,
        loading: false
      }
    },
    methods: {
      handleRemove() {
        this.poster.pop();
        this.newsForm.posterUrl = null;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleExceed() {
        this.$message.error("只能上传一张海报,请先删除");
        return false;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isJPG) {
          this.$message.error('上传海报图片只能是 JPG/PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传海报图片大小不能超过 5MB!');
        }
        return isJPG && isLt5M;
      },
      handlePictureSuccess(response, file) {
        if (response.status === 200) {
          this.poster.push(file);
          this.newsForm.posterUrl = response.url;
        } else {
          this.$message.error(response.message);
          return false;
        }
      },
      cache: function (value, render) {
        this.newsForm.markdown = value;
        this.newsForm.html = render;
      },
      upload: function (pos, file) {
        const formData = new FormData();
        formData.append('image', file);
        axios({
          url: '/news/uploadImage',
          method: 'post',
          data: formData,
          headers: {'Content-type': 'multipart/form-data'}
        }).then(response => {
          this.$refs.md.$img2Url(pos, response.data.url);
        });
      },
      clearValidateInfo(ref) {
        this.$refs[ref].clearValidate();
      },
      resetForm(form) {
        this.$refs[form].resetFields();
        this.editor = '';
      },
      publish: function () {
        this.loading = true;
        this.$refs['newsForm'].validate(valid => {
          if (valid) {
            this.validateOthers(valid => {
              if (valid) {
                const param = {};
                param.title = this.newsForm.title;
                param.summary = this.newsForm.summary;
                param.markdown = this.newsForm.markdown;
                param.html = this.newsForm.html;
                param.author = this.$store.state.user.username;
                param.posterUrl = this.newsForm.posterUrl;
                if (this.newsForm.id !== undefined) {
                  param.id = this.newsForm.id;
                }
                axios({
                  method: "POST",
                  url: "/news/publish",
                  data: qs.stringify(param)
                }).then(response => {
                  if (response.data.status === 200) {
                    this.$message({
                      type: 'success',
                      message: '发表成功！',
                      center: true
                    });
                    this.loading = false;
                  } else {
                    this.$message({
                      type: 'error',
                      message: response.data.message,
                      center: true
                    });
                    this.loading = false;
                  }
                }).catch(exception => {
                  console.error(exception);
                  this.$message.error("未知错误");
                  this.loading = false;
                });
              } else {
                this.loading = false;
              }
            })
          } else {
            this.loading = false;
          }
        });
      },
      validateOthers: function (callback) {
        if (this.newsForm.posterUrl === undefined || this.newsForm.posterUrl === '') {
          this.$message.error("请上传海报图片");
          callback(false);
          return;
        }
        if (this.newsForm.markdown === '') {
          this.$message.error("请填写正文内容");
          callback(false);
          return;
        }
        const title = this.$route.params.title;
        if (title !== undefined && title === this.newsForm.title) {
          callback(true);
          return;
        }
        axios.get('/news/checkNewsTitle', {params: {title: this.newsForm.title}})
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

<style>
  .avatar-uploader .el-upload {
    width: 500px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload-dragger {
    width: 500px !important;
    border: none !important;
    height: auto !important;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
</style>

<style scoped>
  .editor {
    height: 60vh;
    margin-bottom: 22px;
  }
</style>
