<template>
  <div style="height: 100%">
    <el-table :data="tableData" v-loading="loading">
      <el-table-column align="center" label="应聘者">
        <template slot-scope="scope">
          <el-tooltip class="item" content="点击查看简历" placement="left">
            <el-button type="text" @click="previewResume(scope.$index, scope.row.resume)">{{scope.row.realName}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位名称" prop="job" />
      <el-table-column align="center" label="所属企业" prop="company" />
      <el-table-column align="center" label="投递时间" prop="createTime" />
      <el-table-column align="center" label="进度">
        <template slot-scope="scope">
          {{progress[scope.row.step - 1]}}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-tooltip class="item" content="进入下一阶段" placement="left">
            <el-button size="mini" circle icon="el-icon-caret-right" type="success" @click="toNext(scope.$index, scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination  layout="prev, pager, next" :total="total" v-show="show" style="text-align: center"
                    @current-change="handleCurrentChange" :current-page="page" />

    <el-dialog title="简历详情" :visible.sync="preview" v-loading="dialogLoading">
      <el-scrollbar style="height: 60vh" v-if="resume[resumeIndex]">
        <!--个人基本信息-->
        <el-card>
          <div slot="header">
            <span>个人基本信息</span>
          </div>
          <el-form label-width="100px" label-position="left">
            <el-form-item label="姓名" prop="name">
              <span>{{resume[resumeIndex].name}}</span>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <span>{{resume[resumeIndex].sex}}</span>
            </el-form-item>
            <el-form-item label="婚姻状况" prop="marriage">
              <span>{{resume[resumeIndex].marriage}}</span>
            </el-form-item>
            <el-form-item label="身份证号码" prop="identityNum">
              <span>{{resume[resumeIndex].identityNum}}</span>
            </el-form-item>
            <el-form-item label="籍贯" prop="nation">
              <span>{{resume[resumeIndex].nation}}</span>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <span>{{resume[resumeIndex].birthday}}</span>
            </el-form-item>
            <el-form-item prop="workYear" label="工作年限" style="width: 100%" ref="workYear">
              <span>{{resume[resumeIndex].workYear}}</span>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
              <span>{{resume[resumeIndex].address}}</span>
            </el-form-item>
          </el-form>
        </el-card>
        <!--教育背景-->
        <el-card>
          <div slot="header">
            <span>教育背景</span>
          </div>
            <el-form v-for="education in resume[resumeIndex].educations" :key="education.rowNum" :model="education"
                     label-width="100px" label-position="left">
              <el-form-item label="学校名称" prop="school" style="width: 500px">
                <span>{{education.school}}</span>
              </el-form-item>
              <el-form-item label="起止日期" prop="dateRange">
                <span>{{education.beginDate}} - {{education.endDate}}</span>
              </el-form-item>
              <el-form-item label="所属专业" prop="major">
                <span>{{education.major}}</span>
              </el-form-item>
              <el-form-item label="获得学历" prop="edu">
                <span>{{education.edu}}</span>
              </el-form-item>
              <el-form-item label="学历性质" prop="type">
                <span>{{education.type}}</span>
              </el-form-item>
              <div style="width: 100%; height: 10px; margin-bottom: 10px; border-bottom: solid 1px rgb(230, 230, 230)"></div>
            </el-form>
        </el-card>
        <!--工作经历-->
        <el-card>
          <div slot="header">
            <span>工作经历</span>
          </div>
          <div>
            <el-form v-for="experience in resume[resumeIndex].experiences" :key="experience.rowNum"
                     :model="experience" label-width="100px" label-position="left">
              <el-form-item label="公司名称" style="width: 500px">
                <span>{{experience.company}}</span>
              </el-form-item>
              <el-form-item label="起止日期">
                <span>{{experience.beginDate}} - {{experience.endDate}}</span>
              </el-form-item>
              <el-form-item label="工作类型">
                <span>{{experience.type}}</span>
              </el-form-item>
              <el-form-item label="所属岗位">
                <span>{{experience.post}}</span>
              </el-form-item>
              <el-form-item label="工作描述">
                <span>{{experience.description}}</span>
              </el-form-item>
              <div style="width: 100%; height: 10px; margin-bottom: 10px; border-bottom: solid 1px rgb(230, 230, 230)"></div>
            </el-form>
          </div>
        </el-card>
        <!--获奖情况-->
        <el-card>
          <div slot="header">
            <span>获奖情况</span>
          </div>
            <el-form v-for="award in resume[resumeIndex].awards" :key="award.rowNum" :model="award"
                     label-width="100px" label-position="left">
              <el-form-item label="获奖名称" style="width: 500px">
                <span>{{award.name}}</span>
              </el-form-item>
              <el-form-item label="获奖日期">
                <span>{{award.date}}</span>
              </el-form-item>
              <div style="width: 100%; height: 10px; margin-bottom: 10px; border-bottom: solid 1px rgb(230, 230, 230)"></div>
            </el-form>
        </el-card>
        <el-card>
          <div slot="header">
            <span>自我评价</span>
          </div>
          <el-form v-show="resume[resumeIndex].evaluation">
            <el-form-item label="自我评价">
              <span>{{resume[resumeIndex].evaluation}}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>

  import axios from 'axios'

  export default {
    name: "JobResumeManage",
    data() {
      return {
        jobResumes: [],
        displayData: [],
        resume: Array,
        resumeIndex: 0,
        loading: false,
        preview: false,
        dialogLoading: false,
        page: 1,
        total: 0,
        search: '',
        progress: ['投递', '笔试', '面试', '录用']
      }
    },
    watch: {
      page() {
        this.getJobResumes();
      }
    },
    computed: {
      show() {
        return this.total > 10;
      },
      tableData() {
        return this.search === '' ? this.displayData :
          this.jobResumes
            .filter(data => data.job.toLowerCase().includes(this.search.toLowerCase())
              || data.realName.toLowerCase().includes(this.search.toLowerCase()))
            .filter((item, index) => {
              return index < 10;
            })
      },
    },
    methods: {
      toNext(index, row) {
        axios.post('/resume/toNext', row)
          .then(response => {
            if (response.data.status === 200) {
              this.jobResumes.splice(index, 1, response.data.jobResume);
              this.displayData = this.jobResumes;
               this.$message.success(response.data.message);
            } else {
              this.$message.error(response.data.message);
            }
          }).catch(exception => {
            console.error(exception);
            this.$message.error("未知错误");
        })
      },
      previewResume(index, resumeId) {
        this.preview = true;
        this.dialogLoading = true;
        axios.get('/resume/getResumeByResumeId', {params: {resumeId: resumeId}})
          .then(response => {
            if (response.data.status === 200) {
              this.resume[index] = response.data.resume;
              this.resumeIndex = index;
            } else {
              this.$message.error(response.data.message);
            }
            this.dialogLoading = false;
          }).catch(() => {
            this.dialogLoading = false;
            this.$message.error("加载失败");
        })
      },
      getJobResumes() {
        this.loading = true;
        axios.get('/job/getAllJobResumes')
          .then(response => {
            if (response.data.status === 200) {
              this.jobResumes = response.data.jobResumes;
              this.total = this.jobResumes.length;
              this.resume = new Array(this.jobResumes.length);
              this.displayData = this.jobResumes.filter((item, index) => {
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
      handleCurrentChange(page) {
        this.page = page;
      }
    },
    created() {
      this.getJobResumes();
    }
  }
</script>

<style scoped>
  .el-card {
    margin-bottom: 20px;
    margin-right: 20px;
  }
</style>
