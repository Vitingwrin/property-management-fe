<template>
  <div style="height: 100%">
    <el-table :data="displayData" v-loading="loading" row-class-name="table-row"
              @row-click="feedback">
      <el-table-column align="center" label="投诉用户" prop="creator" />
      <el-table-column align="center" label="投诉标题" prop="title" />
      <el-table-column align="center" label="投诉内容" prop="content" />
      <el-table-column align="center" label="投诉时间" prop="createTime" />
      <el-table-column align="center" label="反馈内容" prop="feedbackContent" />
      <el-table-column align="center" label="反馈人" prop="feedbackUser" />
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
        complaints: [],
        displayData: [],
        loading: false,
        page: 1,
        total: 0,
      }
    },
    watch: {
      page: function () {
        this.getAllComplaints();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      }
    },
    methods: {
      getAllComplaints: function () {
        this.loading = true;
        axios.get('/complaint/getAllComplaints')
          .then(response => {
            if (response.data.status === 200) {
              this.complaints = response.data.complaints;
              this.total = this.complaints.length;
              this.displayData = this.complaints.filter((item, index) => {
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
        if (row.feedbackContent !== undefined && row.feedbackContent !== '') {
          this.$message.error('该投诉建议已反馈');
          return;
        }
        this.$prompt('请输入反馈内容', row.title,  {
          confirmButtonText: '反馈',
          cancelButtonText: '取消',
          inputPattern: /^.*[^\s]+.*$/,
          inputErrorMessage: '请输入反馈内容'
        }).then(({value}) => {
          let params = Object.assign({}, row);
          params.feedbackUser = this.$store.state.user.id;
          params.feedbackContent = value;
          axios.post('/complaint/feedback', params)
            .then(response => {
              if (response.data.status === 200) {
                this.$message.success(response.data.message);
                this.getAllComplaints();
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
      this.getAllComplaints();
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
