<template>
  <div style="height: 100%">
    <el-table :data="displayData" v-loading="loading">
      <el-table-column align="center" label="标题" prop="title" />
      <el-table-column align="center" width="250" label="内容" prop="content" />
      <el-table-column align="center" label="发布人" prop="creator" />
      <el-table-column align="center" label="发表时间" prop="createTime" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="modifyRow(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination  layout="prev, pager, next" :total="total" v-show="show" style="text-align: center"
                    @current-change="handleCurrentChange" :current-page="page" />
  </div>
</template>

<script>

  import axios from 'axios'

  export default {
    name: "Manage",
    data() {
      return {
        notices: [],
        displayData: [],
        loading: false,
        page: 1,
        total: 0,
      }
    },
    watch: {
      page: function () {
        this.getAllNotices();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      }
    },
    methods: {
      modifyRow: function (row) {
        this.$router.push({name: 'noticeAdd', params: row});
      },
      deleteRow: function (row) {
        this.$confirm(row.name, '删除小区', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          axios.delete('/notice/deleteNotice', {params: {id: row.id}})
            .then(response => {
              if (response.data.status === 200) {
                this.getAllNotices();
                this.$message.success(response.data.message);
              } else {
                this.$message.error(response.data.message);
              }
              this.loading = false;
            }).catch(exception => {
              console.log(exception);
              this.$message.error('未知错误');
              this.loading = false;
          })
        })
      },
      getAllNotices: function () {
        this.loading = true;
        axios.get('/notice/getAllNotices')
          .then(response => {
            if (response.data.status === 200) {
              this.notices = response.data.notices;
              this.total = this.notices.length;
              this.displayData = this.notices.filter((item, index) => {
                return index < this.page * 10 && index >= this.page * 10 - 10;
              })
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
      this.getAllNotices();
    }
  }
</script>

<style scoped>

</style>
