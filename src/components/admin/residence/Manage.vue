<template>
  <div style="height: 100%">
    <el-table :data="displayData" v-loading="loading">
      <el-table-column align="center" label="小区名称" prop="name" />
      <el-table-column align="center" label="小区编码" prop="code" />
      <el-table-column align="center" label="楼栋数" prop="buildingsNum" />
      <el-table-column align="center" label="创建时间" prop="createTime" />
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
        residences: [],
        displayData: [],
        loading: false,
        page: 1,
        total: 0,
      }
    },
    watch: {
      page: function () {
        this.getAllResidences();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      }
    },
    methods: {
      modifyRow: function (row) {
        this.$router.push({name: 'residenceAdd', params: row});
      },
      deleteRow: function (row) {
        this.$confirm(row.name, '删除小区', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          axios.delete('/residence/deleteResidence', {params: {id: row.id}})
            .then(response => {
              if (response.data.status === 200) {
                this.getAllResidences();
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
      getAllResidences: function () {
        this.loading = true;
        axios.get('/residence/getAllResidences')
          .then(response => {
            if (response.data.status === 200) {
              this.residences = response.data.residences;
              this.total = this.residences.length;
              this.displayData = this.residences.filter((item, index) => {
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
      this.getAllResidences();
    }
  }
</script>

<style scoped>

</style>
