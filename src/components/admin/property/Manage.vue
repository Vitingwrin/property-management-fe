<template>
  <div style="height: 100%">
    <el-table :data="displayData" v-loading="loading">
      <el-table-column align="center" label="房产编码" prop="code" />
      <el-table-column align="center" label="所属楼栋" prop="buildings" />
      <el-table-column align="center" label="所属小区" prop="residence" />
      <el-table-column align="center" label="面积" prop="area" />
      <el-table-column align="center" label="单元号" prop="unit" />
      <el-table-column align="center" label="门牌号" prop="doorplate" />
      <el-table-column align="center" label="状态" prop="status" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-show="scope.row.status === '未售'" size="mini" type="primary" @click="modifyRow(scope.row)">编辑</el-button>
          <el-button v-show="scope.row.status === '未售'" size="mini" type="danger" @click="deleteRow(scope.row)">删除</el-button>
          <el-button v-show="scope.row.status === '已售'" size="mini" type="danger" @click="checkOutRow(scope.row)">退住</el-button>
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
        properties: [],
        displayData: [],
        loading: false,
        page: 1,
        total: 0,
      }
    },
    watch: {
      page: function () {
        this.getAllProperties();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      }
    },
    methods: {
      modifyRow: function (row) {
        this.$router.push({name: 'propertyAdd', params: row});
      },
      deleteRow: function (row) {
        this.$confirm(row.name, '删除小区', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          axios.delete('/property/deleteProperty', {params: {id: row.id}})
            .then(response => {
              if (response.data.status === 200) {
                this.getAllProperties();
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
      checkOutRow(row) {
        this.$confirm(row.name, '退住', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          axios.delete('/resident/checkOutProperty', {params: {propertyId: row.id}})
            .then(response => {
              if (response.data.status === 200) {
                this.getAllProperties();
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
      getAllProperties: function () {
        this.loading = true;
        axios.get('/property/getAllProperties')
          .then(response => {
            if (response.data.status === 200) {
              this.properties = response.data.properties;
              this.total = this.properties.length;
              this.displayData = this.properties.filter((item, index) => {
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
      this.getAllProperties();
    }
  }
</script>

<style scoped>

</style>
