<template>
  <el-container v-loading="loading">
    <el-aside width="250px" style="margin-top: 20px; max-height: 80vh">
      <el-menu default-active="1" style="width: 200px; height: 100%">
        <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">基本信息</span>
        </el-menu-item>
        <el-menu-item index="2" :disabled="!psnInfoComplete">
          <i class="el-icon-date"></i>
          <span slot="title">教育背景</span>
        </el-menu-item>
        <el-menu-item index="3" :disabled="!psnInfoComplete">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">工作经历</span>
        </el-menu-item>
        <el-menu-item index="4" :disabled="!psnInfoComplete">
          <i class="el-icon-document"></i>
          <span slot="title">获奖情况</span>
        </el-menu-item>
        <el-menu-item index="5" :disabled="!psnInfoComplete">
          <i class="el-icon-star-off"></i>
          <span slot="title">自我评价</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="">
      <el-scrollbar style="height: 80vh">
        <!--个人基本信息-->
        <el-card v-loading="baseInfoLoading" id="1">
          <div slot="header">
            <span>个人基本信息</span>
            <el-button v-show="psnEditing" type="text" class="box-op" @click="saveResume">保存</el-button>
            <el-button v-show="psnEditing" style="margin-right: 10px" type="text" class="box-op" @click="cancelBaseInfo">取消</el-button>
            <el-button v-show="!psnEditing" type="text" class="box-op" @click="psnEditing = true">修改</el-button>
          </div>
          <el-form :model="baseInfo" :rules="baseInfoRules" ref="baseInfo"
                   label-width="100px" label-position="left">
            <el-form-item label="姓名" prop="name">
              <el-input v-if="psnEditing" style="width: 300px" v-model="baseInfo.name" />
              <span v-else>{{baseInfo.name}}</span>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-if="psnEditing" v-model="baseInfo.sex">
                <el-radio label="男" value="男"></el-radio>
                <el-radio label="女" value="女"></el-radio>
              </el-radio-group>
              <span v-else>{{baseInfo.sex}}</span>
            </el-form-item>
            <el-form-item label="婚姻状况" prop="marriage">
              <el-radio-group v-if="psnEditing" v-model="baseInfo.marriage">
                <el-radio label="未婚" value="未婚"></el-radio>
                <el-radio label="已婚" value="已婚"></el-radio>
                <el-radio label="离异" value="离异"></el-radio>
              </el-radio-group>
              <span v-else>{{baseInfo.marriage}}</span>
            </el-form-item>
            <el-form-item label="身份证号码" prop="identityNum">
              <el-input v-if="psnEditing" style="width: 300px" v-model="baseInfo.identityNum" />
              <span v-else>{{baseInfo.identityNum}}</span>
            </el-form-item>
            <el-form-item label="籍贯" prop="nation">
              <el-input v-if="psnEditing" style="width: 300px" v-model="baseInfo.nation" />
              <span v-else>{{baseInfo.nation}}</span>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker style="width: 300px" v-if="psnEditing" v-model="baseInfo.birthday"
                              type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
              <span v-else>{{baseInfo.birthday}}</span>
            </el-form-item>
            <el-form-item prop="workYear" label="工作年限" style="width: 100%" ref="workYear">
              <el-slider v-if="psnEditing" v-model="baseInfo.workYear" :max="50" style="width: 60%" show-input
                         :show-input-controls="false" input-size="mini" />
              <span v-else>{{baseInfo.workYear}}</span>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
              <el-input v-if="psnEditing" style="width: 500px" v-model="baseInfo.address" />
              <span v-else>{{baseInfo.address}}</span>
            </el-form-item>
          </el-form>
        </el-card>
        <!--教育背景-->
        <el-card v-show="psnInfoComplete" v-loading="eduLoading" id="2">
          <div slot="header">
            <span>教育背景</span>
            <el-button v-show="eduEditing" type="text" class="box-op"
                       @click="saveRecord('Education', educations, delEducations, () => {eduLoading = true},
                                           () => {eduLoading = false; eduEditing = false}, () => {eduLoading = false})" >
              保存
            </el-button>
            <el-button v-show="eduEditing" style="margin-right: 10px"
                       type="text" class="box-op"
                       @click="cancel('education', educations, delEducations, resumeCache.educations, () => {eduEditing = false})">
              取消
            </el-button>
            <el-button v-show="!eduEditing && educations.length > 0"
                       type="text" class="box-op" @click="eduEditing = true">
              修改
            </el-button>
          </div>
          <div v-show="educations.length > 0">
            <el-form v-for="(education, index) in educations" :key="education.rowNum"
                     :model="education" :rules="educationRules" :ref="'education' + index"
                     label-width="100px" label-position="left">
              <el-button v-show="eduEditing" type="text" class="box-op" @click="deleteRecord(educations, delEducations, index)">
                删除
              </el-button>
              <el-form-item label="学校名称" prop="school" style="width: 500px">
                <el-input v-if="eduEditing" style="width: 300px" v-model="education.school" />
                <span v-else>{{education.school}}</span>
              </el-form-item>
              <el-form-item label="起止日期" prop="dateRange">
                <el-date-picker v-if="eduEditing" v-model="education.dateRange" type="daterange" unlink-panels
                                range-separator=" - " start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
                <span v-else>{{education.dateRange[0]}} - {{education.dateRange[1]}}</span>
              </el-form-item>
              <el-form-item label="所属专业" prop="major">
                <el-input v-if="eduEditing" style="width: 300px" v-model="education.major" />
                <span v-else>{{education.major}}</span>
              </el-form-item>
              <el-form-item label="获得学历" prop="edu">
                <el-select v-if="eduEditing" v-model="education.edu" placeholder="请选择">
                  <el-option
                    v-for="item in eduOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{education.edu}}</span>
              </el-form-item>
              <el-form-item label="学历性质" prop="type">
                <el-select v-if="eduEditing" v-model="education.type" placeholder="请选择">
                  <el-option
                    v-for="item in tchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{education.type}}</span>
              </el-form-item>
              <div style="width: 100%; height: 10px; margin-bottom: 10px; border-bottom: solid 1px rgb(230, 230, 230)"></div>
            </el-form>
          </div>

          <el-button class="add" icon="el-icon-circle-plus-outline"
                     @click="addRecord(educations, eduTemplate, () => {eduEditing = true})">
            点击增加一条教育背景
          </el-button>
        </el-card>
        <!--工作经历-->
        <el-card v-show="psnInfoComplete" v-loading="expLoading" id="3">
          <div slot="header">
            <span>工作经历</span>
            <el-button v-show="expEditing" type="text" class="box-op"
                       @click="saveRecord('Experience', experiences, delExperiences, () => {expLoading = true},
                                           () => {expLoading = false; expEditing = false}, () => {expLoading = false})" >
              保存
            </el-button>
            <el-button v-show="expEditing" style="margin-right: 10px"
                       type="text" class="box-op"
                       @click="cancel('experience', experiences, delExperiences, resumeCache.experiences, () => {expEditing = false})">
              取消
            </el-button>
            <el-button v-show="!expEditing && experiences.length > 0"
                       type="text" class="box-op" @click="expEditing = true">
              修改
            </el-button>
          </div>
          <div v-show="experiences.length > 0">
            <el-form v-for="(experience, index) in experiences" :key="experience.rowNum"
                     :model="experience" :rules="experienceRules" :ref="'experience' + index"
                     label-width="100px" label-position="left">
              <el-button v-show="expEditing" type="text" class="box-op" @click="deleteRecord(experiences, delExperiences, index)">
                删除
              </el-button>
              <el-form-item label="公司名称" prop="company" style="width: 500px">
                <el-input v-if="expEditing" style="width: 300px" v-model="experience.company" />
                <span v-else>{{experience.company}}</span>
              </el-form-item>
              <el-form-item label="起止日期" prop="dateRange">
                <el-date-picker v-if="expEditing" v-model="experience.dateRange" type="daterange" unlink-panels
                                range-separator=" - " start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
                <span v-else>{{experience.dateRange[0]}} - {{experience.dateRange[1]}}</span>
              </el-form-item>
              <el-form-item label="工作类型" prop="type">
                <el-select v-if="expEditing" v-model="experience.type" placeholder="请选择">
                  <el-option
                    v-for="item in expOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{experience.type}}</span>
              </el-form-item>
              <el-form-item label="所属岗位" prop="post">
                <el-input v-if="expEditing" style="width: 300px" v-model="experience.post" />
                <span v-else>{{experience.post}}</span>
              </el-form-item>
              <el-form-item label="工作描述" prop="description">
                <el-input style="width: 500px" type="textarea" v-if="expEditing" v-model="experience.description" :rows="7" />
                <span v-else>{{experience.description}}</span>
              </el-form-item>
              <div style="width: 100%; height: 10px; margin-bottom: 10px; border-bottom: solid 1px rgb(230, 230, 230)"></div>
            </el-form>
          </div>

          <el-button class="add" icon="el-icon-circle-plus-outline"
                     @click="addRecord(experiences, expTemplate, () => {expEditing = true})">
            点击增加一条工作经历
          </el-button>
        </el-card>
        <!--获奖情况-->
        <el-card v-show="psnInfoComplete" v-loading="awardLoading" id="4">
          <div slot="header">
            <span>获奖情况</span>
            <el-button v-show="awardEditing" type="text" class="box-op"
                       @click="saveRecord('Award', awards, delAwards, () => {awardLoading = true},
                                           () => {awardLoading = false; awardEditing = false}, () => {awardLoading = false})" >
              保存
            </el-button>
            <el-button v-show="awardEditing" style="margin-right: 10px"
                       type="text" class="box-op" @click="cancel('award', awards, delAwards, resumeCache.awards, () => {awardEditing = false})">
              取消
            </el-button>
            <el-button v-show="!awardEditing && awards.length > 0"
                       type="text" class="box-op" @click="awardEditing = true">
              修改
            </el-button>
          </div>
          <div v-show="awards.length > 0">
            <el-form v-for="(award, index) in awards" :key="award.rowNum"
                     :model="award" :rules="awardRules" :ref="'award' + index"
                     label-width="100px" label-position="left">
              <el-button v-show="awardEditing" type="text" class="box-op" @click="deleteRecord(awards, delAwards, index)">
                删除
              </el-button>
              <el-form-item label="获奖名称" prop="name" style="width: 500px">
                <el-input v-if="awardEditing" style="width: 300px" v-model="award.name" />
                <span v-else>{{award.name}}</span>
              </el-form-item>
              <el-form-item label="获奖日期" prop="date">
                <el-date-picker v-if="awardEditing" v-model="award.date" placeholder="选择日期"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
                <span v-else>{{award.date}}</span>
              </el-form-item>
              <div style="width: 100%; height: 10px; margin-bottom: 10px; border-bottom: solid 1px rgb(230, 230, 230)"></div>
            </el-form>
          </div>

          <el-button class="add" icon="el-icon-circle-plus-outline"
                     @click="addRecord(awards, awardTemplate, () => {awardEditing = true})">
            点击增加一条获奖情况
          </el-button>
        </el-card>
        <el-card v-show="psnInfoComplete" v-loading="evaLoading" id="5">
          <div slot="header">
            <span>自我评价</span>
            <el-button v-show="evaEditing" type="text" class="box-op" @click="saveEva" >
              保存
            </el-button>
            <el-button v-show="evaEditing" style="margin-right: 10px"
                       type="text" class="box-op" @click="cancelEva">
              取消
            </el-button>
            <el-button v-show="!evaEditing"
                       type="text" class="box-op" @click="evaEditing = true">
              修改
            </el-button>
          </div>
          <el-form v-show="baseInfo.evaluation || evaEditing">
            <el-form-item label="自我评价">
              <el-input style="width: 500px" type="textarea" v-if="evaEditing" v-model="baseInfo.evaluation" :rows="7" />
              <span v-else>{{baseInfo.evaluation}}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
  import axios from 'axios'
  import * as qs from 'querystring'
  export default {
    name: "MyResume",
    data() {
      return {
        psnEditing: false,
        eduEditing: false,
        expEditing: false,
        awardEditing: false,
        evaEditing: false,
        psnInfoComplete: false,
        loading: false,
        baseInfoLoading: false,
        eduLoading: false,
        awardLoading: false,
        expLoading: false,
        evaLoading: false,
        baseInfo: {
          name: '',
          sex: '',
          identityNum: '',
          birthday: '',
          marriage: '',
          nation: '',
          workYear: 0,
          address: '',
          evaluation: '',
          userId: this.$store.state.user.id
        },
        resume: {},
        resumeCache: {},
        educations: [],
        experiences: [],
        awards: [],
        delEducations: [],
        delExperiences: [],
        delAwards: [],
        eduOptions: [
          {label: '无', value: '无'},
          {label: '高中', value: '高中'},
          {label: '本科', value: '本科'},
          {label: '研究生', value: '研究生'},
          {label: '博士生', value: '博士生'}
        ],
        tchOptions: [
          {label: '统招全日制', value: '统招全日制'},
          {label: '在职教育', value: '在职教育'},
          {label: '其他', value: '其他'}
        ],
        expOptions: [
          {label: '全职', value: '全职'},
          {label: '兼职', value: '兼职'},
          {label: '实习', value: '实习'}
        ],
        eduTemplate: {
          id: -1,
          school: '',
          dateRange: [],
          edu: '',
          major: '',
          type: ''
        },
        expTemplate: {
          id: -1,
          company: '',
          dateRange: [],
          type: '',
          description: '',
          post: ''
        },
        awardTemplate: {
          id: -1,
          name: '',
          date: ''
        },
        baseInfoRules: {
          name: [{required: true, message: '请填写姓名', trigger: 'blur'}],
          sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
          identityNum: [{required: true, message: '请填写身份证号码', trigger: 'blur'}],
          birthday: [{required: true, message: '请选择出生日期', trigger: 'blur'}],
          marriage: [{required: true, message: '请选择婚姻状况', trigger: 'blur'}],
          nation: [{required: true, message: '请填写籍贯', trigger: 'blur'}]
        },
        educationRules: {
          school: [{required: true, message: '请填写学校名称', trigger: 'blur'}],
          dateRange: [{required: true, message: '请选择起止日期', trigger: 'blur'}],
          edu: [{required: true, message: '请选择学历', trigger: 'blur'}],
          major: [{required: true, message: '请填写所属专业', trigger: 'blur'}],
          type: [{required: true, message: '请选择学历类型', trigger: 'blur'}],
        },
        experienceRules: {
          company: [{required: true, message: '请填写公司名称', trigger: 'blur'}],
          dateRange: [{required: true, message: '请选择起止日期', trigger: 'blur'}],
          type: [{required: true, message: '请选择工作类型', trigger: 'blur'}],
        },
        awardRules: {
          name: [{required: true, message: '请填写获奖名称', trigger: 'blur'}],
          date: [{required: true, message: '请选择获奖日期', trigger: 'blur'}]
        }
      }
    },
    methods: {
      getResume() {
        this.loading = true;
        axios.get('/resume/getResumeByUserId', {params: {userId: this.$store.state.user.id}})
          .then(response => {
            if (response.data.status === 200) {
              if (response.data.resume === undefined) {
                this.psnEditing = true;
                this.$message.info("请完善简历个人信息");
              } else {
                this.enDate(response.data.resume.educations);
                this.enDate(response.data.resume.experiences);
                this.resumeCache = Object.assign({}, response.data.resume);
                this.resume = response.data.resume;
                this.resumeCache.educations = this.arrayCopy(this.resume.educations);
                this.resumeCache.experiences = this.arrayCopy(this.resume.experiences);
                this.resumeCache.awards = this.arrayCopy(this.resume.awards);
                this.baseInfo = Object.assign({}, this.resume);
                delete this.baseInfo.educations;
                delete this.baseInfo.experiences;
                delete this.baseInfo.awards;
                this.educations = this.resume.educations;
                this.experiences = this.resume.experiences;
                this.awards = this.resume.awards;
                this.psnInfoComplete = true;
              }
              this.loading = false;
            }
          }).catch(exception => {
            console.error(exception);
            this.$message.error("未知错误");
            this.loading = false;
        })
      },
      saveResume() {
        this.baseInfoLoading = true;
        this.$refs['baseInfo'].validate(valid => {
          if (valid) {
            axios.post('/resume/saveResume', this.baseInfo)
              .then(response => {
                if (response.data.status === 200) {
                  this.$message.success(response.data.message);
                  this.getBaseInfo();
                  this.psnEditing = false;
                } else {
                  this.$message.error(response.data.message);
                }
                this.baseInfoLoading = false;
              }).catch(exception => {
              console.error(exception);
              this.baseInfoLoading = false;
            })
          } else {
            this.baseInfoLoading = false;
          }
        })
      },
      getBaseInfo() {
        axios.get('/resume/getBaseInfoByUserId', {params: {userId: this.$store.state.user.id}})
          .then(response => {
            this.baseInfo = response.data.baseInfo;
            let cache = Object.assign({}, this.baseInfo);
            cache.educations = this.resumeCache.educations;
            cache.experiences = this.resumeCache.experiences;
            cache.awards = this.resumeCache.awards;
            this.resumeCache = cache;
          }).catch(exception => {
            this.$message.error("刷新基本信息失败");
            console.error(exception);
        })
      },
      cancelBaseInfo() {
        this.baseInfo = Object.assign({}, this.resumeCache);
        delete this.baseInfo.educations;
        delete this.baseInfo.experiences;
        delete this.baseInfo.awards;
        this.$refs['baseInfo'].clearValidate();
      },
      addRecord(items, template, onFinish) {
        let row = 1;
        if (items.length > 0) {
          row = items[items.length - 1].rowNum + 1;
        }
        let newRecord = Object.assign({}, template);
        newRecord.resumeId = this.resume.id;
        newRecord.rowNum = row;
        items.push(newRecord);
        onFinish();
      },
      cancel(refName, items, delItems, cache, onFinish) {
        for (let i = 0; i < items.length; i++) {
          this.$refs[refName + i][0].clearValidate();
        }
        delItems.splice(0, delItems.length);
        items.splice(0, items.length);
        cache.forEach(item => {
          items.push(item);
        });
        onFinish();
      },
      deleteRecord(items, delItems, index) {
        delItems.push(items[index]);
        items.splice(index, 1);
      },
      saveRecord(urlSuffix, items, delItems, onPrepare, onFinish, onFail) {
        onPrepare();
        let refName = urlSuffix.toLowerCase();
        let isValid = false;
        for (let i = 0; i < items.length; i++) {
          console.log(this.$refs[refName + i]);
          this.$refs[refName + i][0].validate(valid => {
            isValid = valid;
          })
        }
        if (isValid) {
          let itemsCopy = this.arrayCopy(items);
          let delItemsCopy = this.arrayCopy(delItems);
          axios.all([
            axios.post('/resume/save' + urlSuffix, this.deDate(itemsCopy)),
            axios.delete('/resume/delete' + urlSuffix, {data: this.deDate(delItemsCopy)})
          ]).then(axios.spread((pRes, dRes) => {
            if (pRes.data.status === 200 && dRes.data.status === 200) {
              this.$message.success("保存成功");
              delItems.splice(0, delItems.length);
              axios.get('/resume/get' + urlSuffix, {params: {resumeId: this.resume.id}})
                .then(response => {
                  items = response.data.contents;
                  onFinish();
                }).catch(() => {
                this.$message.error("刷新信息失败");
                onFinish();
              });
            } else {
              this.$message.error("保存失败，请稍后重试");
              console.log('saveLog: ' + pRes.data.message, + '  deleteLog: ' + dRes.data.message);
              onFail();
            }
          })).catch(exception => {
            this.$message.error("未知错误");
            console.error(exception);
            onFail();
          })
        } else {
          onFail();
        }
      },
      enDate(items) {
        if (items === undefined || items.length === 0) return items;
        if (items[0].beginDate === undefined) return items;
        for (let i = 0; i < items.length; i++) {
          items[i].dateRange = [items[i].beginDate, items[i].endDate];
        }
        return items;
      },
      deDate(items) {
        if (items === undefined || items.length === 0) return items;
        if (items[0].dateRange === undefined) return items;
        for (let i = 0; i < items.length; i++) {
          items[i].beginDate = items[i].dateRange[0];
          items[i].endDate = items[i].dateRange[1];
          delete items[i].dateRange;
        }
        return items;
      },
      saveEva() {
        this.evaLoading = true;
        axios({
          url: '/resume/saveEvaluation',
          method: 'POST',
          data: qs.stringify({
            resumeId: this.resume.id,
            evaluation: this.baseInfo.evaluation
          })
        }).then(response => {
          if (response.data.status === 200) {
            this.resumeCache.evaluation = this.baseInfo.evaluation;
            this.$message.success(response.data.message);
            this.evaEditing = false;
          } else {
            this.$message.error(response.data.message);
          }
          this.evaLoading = false;
        }).catch(exception => {
          console.error(exception);
          this.$message.error('未知错误');
          this.evaLoading = false;
        });
      },
      cancelEva() {
        this.baseInfo.evaluation = this.resumeCache.evaluation;
        this.evaEditing = false;
      }
    },
    created() {
      this.getResume();
    }
  }
</script>

<style scoped>
  .box-op {
    float: right;
    padding: 3px 0;
    cursor: pointer;
  }
  .el-card {
    margin-top: 20px;
    margin-right: 20px;
  }
  .add {
    font-size: 16px;
    border: dashed 1px darkgrey;
    color: darkgrey;
    margin-left: 301px;
  }
</style>
