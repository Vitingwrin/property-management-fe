<template>
  <div style="height: 100%">
      <el-table :data="displayData" v-loading="loading" row-class-name="table-row"
                @row-click="feedback">
        <el-table-column align="center" label="报修人" prop="creator" />
        <el-table-column align="center" label="报修单号" prop="code" />
        <el-table-column align="center" label="报修类型" prop="type" />
        <el-table-column align="center" label="联系电话" prop="phone" />
        <el-table-column align="center" label="期望处理时间" prop="expectTime" />
        <el-table-column align="center" label="费用" prop="fee" />
        <el-table-column align="center" label="处理状态">
          <template slot-scope="scope">
            <span>{{statusMap[parseInt(scope.row.status)]}}</span>
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
        repairs: [],
        displayData: [],
        loading: false,
        page: 1,
        total: 0,
        statusMap: ['待查看', '待缴费', '已缴费待处理', '已处理']
      }
    },
    watch: {
      page: function () {
        this.getAllRepairs();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      }
    },
    methods: {
      getAllRepairs: function () {
        this.loading = true;
        axios.get('/repair/getAllRepairs')
          .then(response => {
            if (response.data.status === 200) {
              this.repairs = response.data.repairs;
              this.total = this.repairs.length;
              this.displayData = this.repairs.filter((item, index) => {
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
      feedback(row) {
        if (row.status === 3) {
          this.$message.success('该报修已处理完毕');
          return;
        }
        if (row.status === 2) {
          this.$confirm('将状态置为已处理？', row.title,  {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            axios.post('/repair/finish', row)
              .then(response => {
                if (response.data.status === 200) {
                  this.$message.success(response.data.message);
                  this.getAllRepairs();
                }
              }).catch(exception => {
              console.log(exception);
              this.$message.error("未知错误");
              this.loading = false;
            });
          });
          return;
        }
        if (row.fee !== undefined && row.fee !== '') {
          this.$message.error('已反馈费用信息');
          return;
        }
        this.$prompt('请输入修理费用', row.title,  {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^([1-9]\d?|[1-9]\d+)$/,
          inputErrorMessage: '请输入正确的修理费用'
        }).then(({value}) => {
          let params = Object.assign({}, row);
          params.fee = value;
          params.status = 1;
          axios.post('/repair/fee', params)
            .then(response => {
              if (response.data.status === 200) {
                this.$message.success(response.data.message);
                this.getAllRepairs();
              }
            }).catch(exception => {
              console.log(exception);
              this.$message.error("未知错误");
              this.loading = false;
          });
        })
      }
    },
    created: function () {
      this.getAllRepairs();
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
