<template>
  <div style="height: 100%">
    <el-table :data="users" style="width: 100%; height: 80vh" v-loading="loading">
      <el-table-column align="center" label="用户名" prop="username" />
      <el-table-column align="center" label="姓名" prop="name" />
      <el-table-column align="center" label="手机号码" prop="phone" />
      <el-table-column align="center" label="创建时间" prop="createTime" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" content="删除" placement="right">
            <el-button size="mini" circle icon="el-icon-delete" type="danger" @click="deleteUser(scope.$index)" />
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
    name: "Manage",
    data() {
      return {
        users: [],
        loading: false,
        page: 1,
        total: 0
      }
    },
    watch: {
      page: function () {
        this.getUsersByPaging();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      }
    },
    methods: {
      deleteUser: function (index) {
        this.$confirm('确定删除此用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          axios.delete('/user/deleteUser', {params: {id: this.users[index].id}})
            .then(response => {
              if (response.data.status === 200) {
                this.getUsersByPaging();
                this.$message.success(response.data.message);
              } else {
                this.$message.error(response.data.message);
              }
              this.loading = false;
            });
        });
      },
      getUsersByPaging: function () {
        this.loading = true;
        axios.get('/user/getUsersByPaging', {params: {page: this.page}})
          .then(response => {
            if (response.data.status === 200) {
              this.users = response.data.users;
              this.total = this.users.length;
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
      this.getUsersByPaging();
    }
  }
</script>

<style scoped>

</style>
