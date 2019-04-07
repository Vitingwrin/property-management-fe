<template>
  <div style="height: 100%">
    <el-table :data="admins" style="width: 100%; height: 80vh" v-loading="loading">
      <el-table-column align="center" label="用户名" prop="username" />
      <el-table-column align="center" label="昵称" prop="name" />
      <el-table-column align="center" label="电子邮件" prop="email" />
      <el-table-column align="center" label="创建时间" prop="createTime" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" content="删除" placement="right">
            <el-button size="mini" circle icon="el-icon-delete" type="danger" @click="deleteAdmin(scope.$index)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination  layout="prev, pager, next" :total="total" v-show="show" align="center"
                    @current-change="handleCurrentChange" :current-page="page" />
  </div>
</template>

<script>

  import axios from 'axios'
  import * as qs from 'querystring'

  export default {
    name: "UserManage",
    data() {
      return {
        admins: [],
        loading: false,
        page: 1,
        total: 0
      }
    },
    watch: {
      page: function () {
        this.getAdminsByPaging();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      }
    },
    methods: {
      deleteAdmin: function (index) {
        this.$confirm('确定删除此管理员？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          axios.delete('/user/deleteUser', {params: {id: this.admins[index].id}})
            .then(response => {
              if (response.data.status === 200) {
                this.getAdminsByPaging();
                this.$message.success(response.data.message);
              } else {
                this.$message.error(response.data.message);
              }
              this.loading = false;
            });
        });
      },
      getAdminsByPaging: function () {
        this.loading = true;
        axios.get('/user/getAdminsByPaging', {params: {page: this.page}})
          .then(response => {
            if (response.data.status === 200) {
              this.admins = response.data.admins;
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
      this.getAdminsByPaging();
    }
  }
</script>

<style scoped>

</style>
