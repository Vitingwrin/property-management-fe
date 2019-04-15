<template>
  <transition>
    <div style="margin-bottom: 48px">
      <mt-header fixed title="公告详情">
        <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        <mt-button slot="right" @click.prevent="feLogout"><fa icon="sign-out-alt"></fa></mt-button>
      </mt-header>
      <div class="top-card"></div>
      <div class="notice">
        <h2 style="text-align: center">{{notice.title}}</h2>
        <p>{{'&emsp;&emsp;' + notice.content}}</p>
        <p style="text-align: right; font-size: 14px">{{notice.createTime}}</p>
      </div>
      <h4 style="margin-left: 20px" v-show="comments.length > 0">评论</h4>
      <div v-for="comment in comments" :key="comments.id">
        <el-card shadow="never" class="fe-card comment">
          <div slot="header" style="height: 15px">
            <span style="float: left; font-size: 14px;">{{comment.creator}}</span>
            <span style="float: right; font-size: 12px; color: darkgrey;">{{comment.createTime}}</span>
          </div>
          <span>{{comment.content}}</span>
        </el-card>
      </div>
      <p style="color: darkgrey; text-align: center; margin-top: 100px" v-show="comments.length === 0">暂无评论</p>
      <mt-field class="comment-input" placeholder="说两句..." v-model="comment.content">
        <mt-button size="small" type="primary" @click="sendComment">发送</mt-button>
      </mt-field>
    </div>
  </transition>
</template>

<script>
  import axios from 'axios'
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: "NoticeDetail",
    data() {
      return {
        notice: {},
        comment: {
          creator: this.$store.state.user.id,
          noticeId: this.$route.params.id,
          content: ''
        },
        comments: []
      }
    },
    methods: {
      sendComment() {
        if (this.comment.content === '') {
          Toast('请输入评论内容');
          return;
        }
        Indicator.open('发表中');
        axios.post('/notice/comment', this.comment)
          .then(response => {
            if (response.data.status === 200) {
              this.comment.content = '';
              this.getComments();
              Toast(response.data.message);
            } else {
              Toast('发表失败');
            }
            Indicator.close();
          }).catch(() => {
            Toast('发表失败');
            Indicator.close();
        })
      },
      getComments() {
        Indicator.open('加载中');
        axios.get('/notice/getNoticeById', {params: {noticeId: this.$route.params.id}})
          .then(response => {
            if (response.data.status === 200) {
              this.notice = response.data.notice;
              this.comments = this.notice.messages;
            } else {
              Toast('加载失败');
            }
            Indicator.close();
          }).catch(() => {
          Toast('加载失败');
          Indicator.close();
        })
      }
    },
    created() {
      this.getComments();
    }
  }
</script>

<style scoped>
  .top-card {
    height: 40px;
    background: #f5f5f5;
    width: 100%;
  }

  .el-card {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .el-form {
    padding-left: 20px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .comment-input {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .notice {
    margin-left: 20px;
    margin-right: 20px;
    border-bottom: lightgray 1px solid;
  }
</style>
