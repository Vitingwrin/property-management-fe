<template>
  <div>
    <el-table v-loading="loading" :data="companies" row-key="id"
              :expand-row-keys="expandData" @row-click="rowClick">
      <el-table-column align="center" type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand" :model="props.row" :ref="'company' + props.$index">
            <el-form-item label="名称" ref="name" prop="name" :rules="props.row.editing ? rules.name : null">
              <span v-show="!props.row.editing">{{ props.row.name }}</span>
              <el-input v-show="props.row.editing" v-model="props.row.name" clearable />
            </el-form-item>
            <el-form-item label="类型" ref="type" prop="type" :rules="props.row.editing ? rules.type : null">
              <span v-show="!props.row.editing">{{ props.row.type }}</span>
              <el-input v-show="props.row.editing" v-model="props.row.type" clearable />
            </el-form-item>
            <el-form-item label="电子邮箱" ref="email" prop="email" :rules="props.row.editing ? rules.email : null">
              <span v-show="!props.row.editing">{{ props.row.email }}</span>
              <el-input v-show="props.row.editing" v-model="props.row.email" clearable />
            </el-form-item>
            <el-form-item label="创建人" ref="creator" prop="creator">
              <span>{{ props.row.creator }}</span>
            </el-form-item>
            <el-form-item label="简介" ref="intro" prop="intro" :rules="props.row.editing ? rules.intro : null">
              <span v-show="!props.row.editing">{{ props.row.intro }}</span>
              <el-input type="textarea" autosize v-show="props.row.editing" v-model="props.row.intro" clearable />
            </el-form-item>
            <el-form-item label="地址" ref="address" prop="address">
              <span v-show="!props.row.editing">{{ props.row.address }}</span>
              <el-input v-show="props.row.editing" v-model="props.row.address" clearable />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="name" />
      <el-table-column align="center" label="类型" prop="type" />
      <el-table-column align="center" label="电子邮箱" prop="email" />
      <el-table-column align="center" label="创建人" prop="creator" />
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <el-tooltip class="item" content="新增" placement="left-end">
            <el-button type="success" icon="el-icon-plus" circle size="mini" @click.stop="addCompany" />
          </el-tooltip>
          <el-tooltip class="item" content="刷新" placement="right-end">
            <el-button icon="el-icon-refresh" circle size="mini" @click.stop="getCompaniesByPaging" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <transition name="el-fade-in">
          <el-tooltip class="item" content="编辑" placement="left" v-show="!scope.row.editing">
            <el-button size="mini" type="primary" icon="el-icon-edit" circle
              @click.stop="editCompany(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          </transition>
          <el-tooltip class="item" content="删除" placement="right" v-show="!scope.row.editing">
            <el-button size="mini" type="danger" icon="el-icon-delete" circle
                       @click.stop="deleteCompany(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <transition name="el-fade-in">
          <el-tooltip class="item" content="保存" placement="left" v-show="scope.row.editing">
            <el-button size="mini" type="success" icon="el-icon-check" circle
                       :disabled="expandData.indexOf(scope.row.id) === -1"
                       @click.stop="saveCompany(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          </transition>
          <el-tooltip class="item" content="取消" placement="right" v-show="scope.row.editing">
            <el-button size="mini" type="info" icon="el-icon-close" circle
                       @click.stop="cancelSave(scope.$index, scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination  layout="prev, pager, next" :total="total" v-show="show" style="margin-top: 30px; text-align: center"
                    @current-change="handleCurrentChange" :current-page="page" />
  </div>
</template>

<script>
  import axios from 'axios'
  const NEW = -1;
  export default {
    name: "Company",
    data() {
      return {
        loading: false,
        companies: [],
        cache: [],
        expandData:[],
        page: 1,
        total: 0,
        rules: {
          type: [{required: true, message: '请填写类型', trigger: 'blur'}],
          email: [{required: true, type: 'email', message: '请填写正确的邮箱地址', trigger: 'blur'}],
          intro: [{required: true, message: '请填写简介', trigger: 'blur'}],
          name: [{required: true, message: '请填写名称', trigger: 'blur'}]
        },
      }
    },
    watch: {
      page: function () {
        this.getCompaniesByPaging();
      }
    },
    computed: {
      show: function () {
        return this.total > 10;
      }
    },
    created: function () {
      this.getCompaniesByPaging();
    },
    methods: {
      requestSave (index, row) {
        let param = Object.assign({}, row);
        delete param.editing;
        axios.post('/company/saveCompany', param)
          .then(response => {
            if (response.data.status === 200) {
              this.$message.success(response.data.message);
              // this.getCompaniesByPaging();
              // 改成局部刷新
              this.cache[index] = response.data.company;
              let company = Object.assign({}, response.data.company);
              company.editing = false;
              this.companies.splice(index, 1, company);
              // 展开数据删除NEW
              if (param.id === NEW) {
                this.expandData.splice(this.expandData.indexOf(NEW), 1);
              }
            } else {
              this.$message.error(response.data.message);
            }
            this.loading = false;
          }).catch(exception => {
          console.log(exception);
          this.$message.error("未知错误");
          this.loading = false;
        })
      },
      getCompaniesByPaging: function () {
        this.loading = true;
        axios.get('/company/getCompaniesByPaging', {params: {page: this.page, status: 1}})
          .then(response => {
            if (response.data.status === 200) {
              this.companies = response.data.companies;
              this.cache = new Array(10);
              this.expandData.splice(0, this.expandData.length);
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
      },
      editCompany(index, row) {
        this.cache[index] = Object.assign({}, row);
        row.editing = true;
        this.companies.splice(index, 1, row);
        this.expandRow(row.id);
      },
      deleteCompany(index) {
        this.$confirm('确定删除此企业？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/company/deleteCompany', {params: {id: this.companies[index].id}})
            .then(response => {
              if (response.data.status === 200) {
                this.getCompaniesByPaging();
                this.$message.success(response.data.message);
              } else {
                this.$message.error(response.data.message);
              }
              this.loading = false;
            })
        })
      },
      saveCompany(index, row) {
        this.loading = true;
        this.$refs['company' + index].validate(valid => {
          if (valid) {
            // 新增数据或修改过名字需要校验名称唯一性
            if (row.id === NEW || (row.id !== NEW && row.name !== this.cache[index].name)) {
              this.checkCompanyName(row.name, valid => {
                if (valid) {
                  this.requestSave(index, row);
                } else {
                  this.loading = false;
                }
              })
            } else {
              this.requestSave(index, row);
            }
          } else {
            this.loading = false;
          }
        });
      },
      addCompany() {
        if (this.companies[0].id === NEW) {
          this.$message.warning("请先保存新增数据");
          return;
        }
        let company = {id: NEW, creator: this.$store.state.user.username, editing: true};
        this.companies.unshift(company);
        this.expandRow(company.id);
      },
      checkCompanyName(name, callback) {
        axios.get('/company/checkCompanyName', {params: {name: name}})
          .then(response => {
            if (response.data.status === 500) {
              this.$message.error(response.data.message);
              callback(false);
            } else {
              callback(true);
            }
          }).catch(exception => {
            console.log(exception);
            this.$message.error("未知错误");
            callback(false);
        })
      },
      cancelSave(index, row) {
        // 先判断是否新增数据
        if (row.id === NEW) {
          this.companies.splice(index, 1);
          this.expandData.splice(this.expandData.indexOf(NEW), 1);
          return;
        }
        this.cache[index].editing = false;
        this.companies.splice(index, 1, this.cache[index]);
        this.$refs['company' + index].clearValidate();
      },
      rowClick(row) {
        const index = this.expandData.indexOf(row.id);
        if (index !== -1) {
          this.expandData.splice(index, 1);
        } else {
          this.expandData.push(row.id);
        }
      },
      expandRow(id) {
        if (this.expandData.indexOf(id) === -1) {
          this.expandData.push(id);
        }
      }
    }
  }
</script>
<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
     margin-right: 0;
     margin-bottom: 1rem;
     width: 48%;
   }

</style>
