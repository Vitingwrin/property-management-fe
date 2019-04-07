<template>
  <div style="height: 100%">
    <el-table :data="news" v-loading="loading">
      <el-table-column align="center" label="标题" prop="title" />
      <el-table-column align="center" label="作者" prop="author" />
      <el-table-column align="center" label="点击量" prop="clickTimes" />
      <el-table-column align="center" label="删除时间" prop="lastEditTime" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" content="还原" placement="left">
            <el-button size="mini" type="success" icon="el-icon-check" circle @click="restoreNews(scope.$index)" />
          </el-tooltip>
          <el-tooltip class="item" content="永久删除" placement="right">
            <el-button size="mini" circle icon="el-icon-delete" type="danger" @click="deleteNews(scope.$index)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination  layout="prev, pager, next" :total="total" v-show="show" style="text-align: center"
                    @current-change="handleCurrentChange" :current-page="page" />
  </div>
</template>

<script>

  import axios from 'axios'
  import * as qs from 'querystring'

  export default {
    name: "Trash",
    data() {
      return {
        news: [],
        loading: false,
        page: 1,
        total: 0
      }
    },
    watch: {
      page: function () {
        this.getNewsByPaging();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      }
    },
    methods: {
      restoreNews: function (index) {
        this.loading = true;
        axios({
          url: '/news/restoreNews',
          data: qs.stringify({id: this.news[index].id}),
          method: 'POST'
        }).then(response => {
            if (response.data.status === 200) {
              this.getNewsByPaging();
              this.$message.success(response.data.message);
            } else {
              this.$message.error(response.data.message);
            }
            this.loading = false;
          })
      },
      deleteNews: function (index) {
        this.$confirm('确定永久删除此新闻？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          axios.delete('/news/deleteNews', {params: {id: this.news[index].id}})
            .then(response => {
              if (response.data.status === 200) {
                this.getNewsByPaging();
                this.$message.success(response.data.message);
              } else {
                this.$message.error(response.data.message);
              }
              this.loading = false;
            });
        });
      },
      getNewsByPaging: function () {
        this.loading = true;
        axios.get('/news/getNewsByPaging', {params: {page: this.page, status: 2}})
          .then(response => {
            if (response.data.status === 200) {
              this.news = response.data.news;
              this.total = response.data.total;
            } else {
              this.$message.error(response.data.message);
            }
            this.loading = false;
          }).catch(exception => {
          console.log(exception);
          this.$message.error("未知错误");
          this.loading = false;
        });
      },
      handleCurrentChange: function(page) {
        this.page = page;
      }
    },
    created: function () {
      this.getNewsByPaging();
    }
  }
</script>

<style scoped>

</style>
