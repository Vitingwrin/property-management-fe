<template>
  <el-container style="min-width: 1350px">

    <!--顶栏-->
    <el-header height="5vh" style="text-align: right">
      <a class="brand" href="#">超级管理员后台</a>
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
          <el-menu-item index="/super/adminAdd/add">
            <fa icon="tags" :style="gutter"></fa><span slot="title">管理员添加</span>
          </el-menu-item>
          <el-menu-item index="/super/adminManage/manage">
            <fa icon="tags" :style="gutter"></fa><span slot="title">管理员管理</span>
          </el-menu-item>
          <el-menu-item index="/super/password/changePwd">
            <fa icon="tags" :style="gutter"></fa><span slot="title">修改密码</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!--内容-->
      <el-main>
        <el-card style="height: 85vh; width: 94%; margin-left: 3%; margin-top: 1%" shadow="never">
          <el-scrollbar style="height: 80vh">
            <div style="margin-right: 10px; margin-left: 10px">
              <router-view></router-view>
            </div>
          </el-scrollbar>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        collapse: false,
        locked: true,
        clicking: false,
        currentMenu: '/admin/adminAdd'
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
            this.$router.push({name: 'superPwd'});
            break;
          case 'logout':
            this.$store.commit('logout');
            this.$router.replace('/admin/login');
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
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .el-select-dropdown__wrap {
    overflow-x: scroll !important;
  }
</style>
