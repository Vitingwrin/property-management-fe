<template>
  <div style="height: 100%">
    <div v-show="!viewDetail">
      <el-table :data="displayData" v-loading="loading" row-class-name="table-row"
                @row-click="showDetail">
        <el-table-column align="center" label="所属小区" prop="residence" />
        <el-table-column align="center" label="费用名称" prop="name" />
        <el-table-column align="center" label="费用" prop="fee" />
        <el-table-column align="center" label="发起时间" prop="createTime" />
      </el-table>
      <el-pagination  layout="prev, pager, next" :total="total" v-show="show" style="text-align: center"
                      @current-change="handleCurrentChange" :current-page="page" />
    </div>
    <div v-if="viewDetail">
      <el-button icon="el-icon-arrow-left" circle @click="viewDetail = false"/>
      <el-table v-loading="detailLoading" :data="details">
        <el-table-column align="center" label="物业名称" prop="property" />
        <el-table-column align="center" label="住户" prop="resident" />
        <el-table-column align="center" label="手机号" prop="phone" />
        <el-table-column align="center" label="缴费时间" prop="payTime" />
        <el-table-column align="center" label="缴费状态" prop="status" />
      </el-table>
    </div>
  </div>
</template>

<script>

  import axios from 'axios'

  export default {
    name: "Manage",
    data() {
      return {
        bills: [],
        displayData: [],
        loading: false,
        page: 1,
        total: 0,
        viewDetail: false,
        detailLoading: false,
        details: []
      }
    },
    watch: {
      page: function () {
        this.getAllBills();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      }
    },
    methods: {
      getAllBills: function () {
        this.loading = true;
        axios.get('/bill/getAllBills')
          .then(response => {
            if (response.data.status === 200) {
              this.bills = response.data.bills;
              this.total = this.bills.length;
              this.displayData = this.bills.filter((item, index) => {
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
      },
      showDetail(row) {
        this.viewDetail = true;
        this.detailLoading = true;
        axios.get('/bill/getBillDetails', {params: {name: row.residence}})
          .then(response => {
            if (response.data.status === 200) {
              this.details = response.data.details;
            }
            this.detailLoading = false;
          }).catch(() => {
            this.$message.error("未知错误");
            this.detailLoading = false;
        })
      }
    },
    created: function () {
      this.getAllBills();
    }
  }
</script>

<style scoped>

</style>

<style>
  .table-row {
    cursor: pointer;
  }
</style>
