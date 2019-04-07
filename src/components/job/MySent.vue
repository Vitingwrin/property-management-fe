<template>
  <el-container style="margin-top: 50px">
    <el-main>
      <el-table :data="jobResumes" v-loading="loading">
        <el-table-column align="center" width="200" label="名称">
          <template slot-scope="scope">
            {{scope.row.job + ' (' + scope.row.company + ')'}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="200" label="投递时间" prop="createTime" />
        <el-table-column align="center" label="进度">
          <template slot-scope="scope">
            <el-steps :space="200" align-center :active="scope.row.step" finish-status="success">
              <el-step title="投递"></el-step>
              <el-step title="笔试"></el-step>
              <el-step title="面试"></el-step>
              <el-step title="录用"></el-step>
            </el-steps>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click.stop="cancel(scope.row)">取消投递</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "MySent",
    data() {
      return {
        jobResumes: [],
        loading: false
      }
    },
    methods: {
      getJobResumes() {
        this.loading = true;
        axios.get('/job/getJobResumeByUserId', {params: {userId: this.$store.state.user.id}})
          .then(response => {
            if (response.data.status === 200) {
              this.jobResumes = response.data.jobResumes;
            } else {
              this.$message.error(response.data.message);
            }
            this.loading = false;
          }).catch(() => {this.loading = false;})
      },
      cancel(row) {
        this.$confirm(row.job, '取消投递', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/resume/cancelResume', {params: {id: row.id}})
            .then(response => {
            if (response.data.status === 200) {
              this.$message.success(response.data.message);
              this.getJobResumes();
            } else {
              this.$message.error(response.data.message);
            }
          })
        })
      }
    },
    created() {
      this.getJobResumes();
    }
  }
</script>

<style scoped>

</style>
