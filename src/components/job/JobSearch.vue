<template>
  <el-container style="margin-top: 50px">
    <el-header>
      <el-input v-model="keyword" :prefix-icon="inputIcon" clearable
                placeholder="请输入关键字">
      </el-input>
    </el-header>
    <el-main>
      <el-table :data="tableData" v-show="total > 0" row-key="id"
                :expand-row-keys="expandData" @row-click="rowClick" row-class-name="table-row">
        <el-table-column align="center" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="工作地点">
                <span>{{ props.row.place }}</span>
              </el-form-item>
              <el-form-item label="所需工作年限">
                <span>{{ props.row.workYear }}</span>
              </el-form-item>
              <el-form-item label="性别要求">
                <span>{{ props.row.sex }}</span>
              </el-form-item>
              <el-form-item label="年龄要求">
                <span>{{ props.row.age1 + ' - ' + props.row.age2 }}</span>
              </el-form-item>
              <el-form-item label="学历要求">
                <span>{{ props.row.education }}</span>
              </el-form-item>
              <el-form-item label="岗位描述">
                <span>{{ props.row.intro }}</span>
              </el-form-item>
              <el-popover title="企业详情" width="500" trigger="hover" placement="top-start"
                          @mouseenter.native="getCompanyDetail(props.row)">
                <div style="width: 100%; height: 10px; margin-bottom: 10px; border-bottom: solid 1px rgb(230, 230, 230)"></div>
                <i v-if="props.row.companyDetail === undefined" class="el-icon-loading myIcon"></i>
                <el-form v-else label-position="left" inline class="table-expand" label-width="70px">
                  <el-form-item label="名称">
                    <span>{{ props.row.companyDetail.name }}</span>
                  </el-form-item>
                  <el-form-item label="电子邮箱">
                    <span>{{ props.row.companyDetail.email }}</span>
                  </el-form-item>
                  <el-form-item label="类型">
                    <span>{{ props.row.companyDetail.type }}</span>
                  </el-form-item>
                  <el-form-item label="地址">
                    <span>{{ props.row.companyDetail.address }}</span>
                  </el-form-item>
                  <el-form-item label="简介">
                    <span>{{ props.row.companyDetail.intro }}</span>
                  </el-form-item>
                </el-form>
                <el-form-item class="company" label="所属企业" slot="reference" style="width: auto">
                  <span>{{ props.row.company }}</span>
                </el-form-item>
              </el-popover>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="所属企业" prop="company" />
        <el-table-column align="center" label="工作地点" prop="place" />
        <el-table-column align="center" label="招聘人数" prop="requireCount" />
        <el-table-column align="center" label="发布时间" prop="createTime" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" content="投递" placement="right">
              <el-button size="mini" type="primary" icon="el-icon-message" circle
                         @click.stop="sendResume(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination  layout="prev, pager, next" :total="total" v-show="show" style="text-align: center"
                      @current-change="handleCurrentChange" :current-page="page" />
    </el-main>

  </el-container>
</template>

<script>
  import axios from 'axios'
  import * as qs from 'querystring'
  const STATIC = 'el-icon-search';
  const SEARCHING = 'el-icon-loading';
  import _ from 'lodash'
  export default {
    name: "JobSearch",
    data() {
      return {
        loading: false,
        keyword: this.$route.params.keyword,
        inputIcon: 'el-icon-search',
        answer: '',
        jobs: [],
        expandData:[],
        page: 1,
      }
    },
    computed: {
      total() {
        return this.jobs.length;
      },
      show() {
        return this.total > 10;
      },
      tableData() {
        return this.jobs.filter((item, index) => {
          return index < this.page * 10 && index >= this.page * 10 - 10;
        })
      }
    },
    watch: {
      keyword: function() {
        this.debouncedSearch();
      }
    },
    created() {
      this.debouncedSearch();
    },
    methods: {
      debouncedSearch: _.debounce(function() {
        if (this.keyword === undefined) this.keyword = '';
        this.inputIcon = SEARCHING;
        axios.get('/job/getJobsByKeyword', {params: {keyword: this.keyword}})
          .then(response => {
            if (response.data.status === 200) {
              this.jobs = response.data.jobs;
            } else {
              this.$message.error(response.data.message);
            }
          }).catch(exception => {
            this.$message.error('未知错误');
            console.log(exception);
          }).finally(() => {
            this.inputIcon = STATIC;
          })
      }, 300),
      handleCurrentChange: function(page) {
        this.page = page;
      },
      rowClick(row) {
        const index = this.expandData.indexOf(row.id);
        if (index !== -1) {
          this.expandData.splice(index, 1);
        } else {
          this.expandData.push(row.id);
        }
      },
      getCompanyDetail(row) {
        if (row.companyDetail !== undefined && row.companyDetail !== null) {
          return;
        }
        axios.get('/company/getCompanyByName', {params: {name: row.company}})
          .then(response => {
            if (response.data.status === 200) {
              this.$set(row, 'companyDetail', response.data.company)
            }
          })
      },
      sendResume(row) {
        if (!this.$store.getters.isLogin) {
          this.$message.info("请先登录");
          this.$router.push({name: 'login'});
          return;
        }
        this.$confirm(row.name, '投递', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          axios.post('/resume/sendResume', qs.stringify({
              userId: this.$store.state.user.id,
              jobId: row.id
          })).then(response => {
              if (response.data.status === 200) {
                this.$message.success(response.data.message);
              } else {
                this.$message.error(response.data.message);
              }
            })
        })
      }
    }
  }
</script>

<style scoped>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .myIcon {
    font-size: 25px;
    margin: 20px 20px 20px 242px;
  }
  .company span {
    color: #409EFF;
    font-weight: bold;
  }
</style>
