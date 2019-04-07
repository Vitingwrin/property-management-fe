<template>
  <el-container :style="{'margin-top': container}">
    <el-header v-show="!viewDetail">
      <el-input v-model="keyword" :prefix-icon="inputIcon" clearable
                placeholder="请输入关键字">
        <!--<el-button slot="append">搜索</el-button>-->
      </el-input>
    </el-header>
    <el-main v-show="!viewDetail">
      <el-table :data="tableData" v-show="total > 0" @row-click="showNews" row-class-name="table-row">
        <el-table-column align="center" label="标题" prop="title" />
        <el-table-column align="center" label="描述" prop="summary" />
        <el-table-column align="center" label="热度" prop="clickTimes" />
        <el-table-column align="center" label="发布时间" prop="createTime" />
      </el-table>
      <el-pagination  layout="prev, pager, next" :total="total" v-show="show" style="text-align: center"
                      @current-change="handleCurrentChange" :current-page="page" />
    </el-main>
    <el-main v-show="viewDetail" style="text-align: center">
      <el-button icon="el-icon-arrow-left" circle @click="viewDetail = false"/>
      <div id="news" style="text-align: start" class="markdown-body"></div>
    </el-main>
  </el-container>
</template>

<script>
  import 'mavon-editor/src/lib/css/markdown.css'
  import axios from 'axios'
  const STATIC = 'el-icon-search';
  const SEARCHING = 'el-icon-loading';
  import _ from 'lodash'
  export default {
    name: "NewsBrowse",
    data() {
      return {
        loading: false,
        keyword: this.$route.params.keyword,
        inputIcon: 'el-icon-search',
        news: [],
        page: 1,
        viewDetail: false,
      }
    },
    computed: {
      total() {
        return this.news.length;
      },
      show() {
        return this.total > 10;
      },
      tableData() {
        return this.news.filter((item, index) => {
          return index < this.page * 10 && index >= this.page * 10 - 10;
        })
      },
      container() {
        return this.viewDetail ? 0 : '50px'
      }
    },
    watch: {
      keyword: function() {
        this.debouncedSearch();
      }
    },
    created() {
      this.debouncedSearch();
    },
    methods: {
      debouncedSearch: _.debounce(function() {
        if (this.keyword === undefined) this.keyword = '';
        this.inputIcon = SEARCHING;
        axios.get('/news/getNewsByKeyword', {params: {keyword: this.keyword}})
          .then(response => {
            if (response.data.status === 200) {
              this.news = response.data.news;
            } else {
              this.$message.error(response.data.message);
            }
          }).catch(exception => {
          this.$message.error('未知错误');
          console.log(exception);
        }).finally(() => {
          this.inputIcon = STATIC;
        })
      }, 300),
      handleCurrentChange: function(page) {
        this.page = page;
      },
      showNews(row) {
        this.viewDetail = true;
        document.getElementById('news').innerHTML = row.html;
      }
    }
  }
</script>

<style>
  .table-row {
    cursor: pointer;
  }
</style>
