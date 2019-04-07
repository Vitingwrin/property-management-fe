<template>
  <div style="height: 100%">
    <el-table :data="tableData" v-loading="loading">
      <el-table-column align="center" label="名称" prop="name" />
      <el-table-column align="center" label="所属企业" prop="company" />
      <el-table-column align="center" label="创建人" prop="creator" />
      <el-table-column align="center" label="招聘人数" prop="requireCount" />
      <el-table-column align="center" label="发表时间" prop="createTime" />
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-tooltip class="item" content="编辑" placement="left">
            <el-button size="mini" circle icon="el-icon-edit" type="primary" @click="modifyJob(scope.$index, scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" content="删除" placement="right">
            <el-button size="mini" circle icon="el-icon-delete" type="danger" @click="deleteJob(scope.row)" />
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

  export default {
    name: "JobManage",
    data() {
      return {
        jobs: [],
        displayData: [],
        loading: false,
        page: 1,
        total: 0,
        search: ''
      }
    },
    watch: {
      page: function () {
        this.getJobs();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      },
      tableData: function () {
        return this.search === '' ? this.displayData :
          this.jobs
            .filter(data => data.name.toLowerCase().includes(this.search.toLowerCase()))
            .filter((item, index) => {
              return index < 10;
            })
      }
    },
    methods: {
      modifyJob: function (index, row) {
        this.$router.push({name: 'jobAdd', params: row});
      },
      deleteJob: function (row) {
        this.$confirm(row.name, '删除职位', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          axios.delete('/job/deleteJob', {params: {id: row.id}})
            .then(response => {
              if (response.data.status === 200) {
                this.getJobs();
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
      getJobs: function () {
        this.loading = true;
        axios.get('/job/getAllJobs')
          .then(response => {
            if (response.data.status === 200) {
              this.jobs = response.data.jobs;
              this.total = response.data.total;
              this.displayData = this.jobs.filter((item, index) => {
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
      this.getJobs();
    }
  }
</script>

<style scoped>

</style>
