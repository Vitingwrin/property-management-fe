<template>
  <el-container style="min-width: 1350px">

    <!--顶栏-->
    <el-header height="5vh" style="text-align: right">
      <a class="brand" href="#">物业管理系统后台</a>
      <div class="right-header">
        <el-dropdown style="margin-right: 10vw" @command="handleCommand">
          <span class="dropdown">
            {{this.$store.state.user.name}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>

      <!--侧栏-->
      <el-aside style="text-align: center" width="auto">
        <el-menu :default-active="currentMenu" router class="menu">
          <el-submenu index="1" style="margin-top: 30px">
            <template slot="title"><span>小区管理</span></template>
            <el-menu-item index="/admin/residence/add">添加</el-menu-item>
            <el-menu-item index="/admin/residence/manage">管理</el-menu-item>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title"><span>用户管理</span></template>
            <el-menu-item index="/admin/user/add">添加</el-menu-item>
            <el-menu-item index="/admin/user/manage">管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><span>房产管理</span></template>
            <el-menu-item index="/admin/property/add">添加</el-menu-item>
            <el-menu-item index="/admin/property/manage">管理</el-menu-item>
            <el-menu-item index="/admin/property/checkIn">入住</el-menu-item>
          </el-submenu>
          <el-menu-item index="/admin/repair/manage">
            <span slot="title">报修管理</span>
          </el-menu-item>
          <el-submenu index="4">
            <template slot="title"><span>费用管理</span></template>
            <el-menu-item index="/admin/bill/add">新增缴费单</el-menu-item>
            <el-menu-item index="/admin/bill/manage">管理缴费单</el-menu-item>
          </el-submenu>
          <el-menu-item index="/admin/complaint/manage">
            <span slot="title">投诉建议</span>
          </el-menu-item>
          <el-submenu index="6">
            <template slot="title"><span>公告留言</span></template>
            <el-menu-item index="/admin/notice/add">发布公告</el-menu-item>
            <el-menu-item index="/admin/notice/manage">公告管理</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!--内容-->
      <el-main>
        <el-scrollbar style="height: 80vh; margin-top: 30px">
          <div style="margin-right: 10px; margin-left: 10px">
          <router-view></router-view>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        clicking: false,
        currentMenu: '/admin/news/publish'
      }
    },
    watch: {
      $route () {
        this.changeMenuFromUrl(window.location.href);
      }
    },
    mounted: function () {
      this.changeMenuFromUrl(window.location.href);
    },
    computed: {
      gutter: function() {
        return { "margin-right": this.collapse ? "0" : "1rem" }
      }
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'pwd':
            this.$router.push({name: 'adminPwd'});
            break;
          case 'logout':
            this.$store.commit('logout');
            this.$router.push({name: 'adminLogin'});
            break;
        }
      },
      changeMenuFromUrl: function(url) {
        url = url.substr(url.indexOf('//') + 2);
        this.currentMenu = url.substr(url.indexOf('/'));
      }
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #8cc4fd;
    color: #333;
    display: flex;
    padding: 0;
  }

  .dropdown {
    color: white;
    cursor: pointer;
    width: 100%;
  }

  .dropdown:hover {
    color: #5cb6ff;
    transition: color .15s linear;
  }

  .menu {
    min-height: 95vh;
    width: 20vw;
  }

  .brand {
    text-decoration: none;
    color: white;
    white-space: nowrap;
    line-height: 5vh;
    width: 20vw;
    text-align: center;
  }

  .right-header {
    width: 80vw;
    background-color: #8cc4fd;
    line-height: 5vh;
  }


</style>
<style>
  .search-bar > input {
    border-radius: 0;
    background-color: #505355;
    height: 5vh;
    line-height: 5vh;
    border: 0;
  }
  .search-bar > span {
    line-height: 5vh;
  }
  .search-bar > input:focus {
    background-color: white;
    box-shadow: 0 0 1rem black;
  }

  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
</style>
