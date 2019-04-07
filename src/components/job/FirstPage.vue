<template>
  <div>
    <el-container>
      <el-main style="padding: 0">
        <el-carousel :interval="4000" type="card" height="300px">
          <el-carousel-item v-for="news1 in news" :key="news.id" @click.native="gotoNews(news1.title)">
<!--            <img :id="'img' + index" :ref="'img' + index" v-show="imgLoading[index]" src="" alt="" style="width: 533px"/>-->
            <my-image :src="news1.posterUrl" ></my-image>
<!--            <div v-show="!imgLoading[index]" v-loading="true" style="width: 533px; height: 300px"></div>-->
          </el-carousel-item>
        </el-carousel>
      </el-main>
    </el-container>
    <el-container>
      <el-main class="main-panel">
        <el-row>
          <el-col :span="8">
            <el-card class="box" shadow="hover" v-loading="jobLoading" style="height: 400px">
              <div slot="header">
                <span class="box-title">最新职位</span>
                <el-button type="text" class="box-op" @click="$router.push('/job/jobSearch')">更多</el-button>
              </div>
              <div v-loading="jobLoading" class="box-item"
                   v-for="job in jobs" :key="job.id">
                <el-button type="text" class="box-info" @click="gotoJob(job.name)">
                  {{job.name}}&emsp;&emsp;{{job.company}}&emsp;&emsp;{{job.createTime.substr(0, 10)}}
                </el-button>
              </div>
            </el-card>
          </el-col>
          <el-col :span="2"><div>&emsp;</div></el-col>
          <el-col :span="14">
            <el-card class="box" shadow="hover" v-loading="newsLoading" style="height: 400px">
              <div slot="header">
                <span class="box-title">最新发布新闻</span>
                <el-button type="text" class="box-op" @click="$router.push('/job/newsBrowse')">更多</el-button>
              </div>
              <div v-loading="newsLoading" class="box-item"
                   v-for="news1 in news" :key="news1.id">
                <el-button type="text" class="box-info" @click="gotoNews(news1.title)">
                  {{news1.title}} （{{news1.summary}}）
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import myImage from '../my-image'
  export default {
    name: "FirstPage",
    components: {myImage},
    data() {
      return {
        loading: false,
        jobLoading: false,
        newsLoading: false,
        loginLoading: false,
        jobs: [],
        news: [],
        imgLoading: Array
      }
    },
    methods: {
      getJobs: function () {
        this.jobLoading = true;
        axios.get('/job/getLatestJobs')
          .then(response => {
            if (response.data.status === 200) {
              this.jobs = response.data.jobs;
            } else {
              this.$message.error(response.data.message);
            }
            this.jobLoading = false;
          }).catch(exception => {
          console.log(exception);
          this.$message.error("未知错误");
          this.jobLoading = false;
        });
      },
      getLatestNews() {
        this.newsLoading = true;
        axios.get('/news/getHottestNews')
          .then(response => {
            if (response.data.status === 200) {
              this.news = response.data.news;
              // 加载图片
              this.imgLoading = new Array(this.news.length);
              // for (let i = 0; i < this.news.length; i++) {
              //   let img = this.$refs['img' + i];
              //   console.log(img);
              //   let newImg = new Image();
              //   newImg.onload = () => {
              //     img.src = newImg.src;
              //     this.imgLoading[i] = true;
              //   };
              //   newImg.src = this.news[i].posterUrl;
              // }
            } else {
              this.$message.error(response.data.message);
            }
            this.newsLoading = false;
          }).catch(exception => {
            console.log(exception);
            this.$message.error("未知错误");
            this.newsLoading = false;
          });
      },
      gotoJob(keyword) {
        this.$router.push({name: 'jobSearch', params:{keyword: keyword}})
      },
      gotoNews(keyword) {
        this.$router.push({name: 'newsBrowse', params:{keyword: keyword}})
      }
    },
    created() {
      this.getLatestNews();
      this.getJobs();
    }
  }
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    margin: 0;
  }

  .main-panel {
    padding-left: 5px;
    padding-right: 5px;
  }

  .box {

  }

  .box-op {
    float: right;
    padding: 3px 0;
  }

  .box-info {
    padding: 0;
  }

  .box-title {
    color: #909399
  }

  .box-item {
    padding: 5px 0;
    font-size: 14px;
  }

</style>
