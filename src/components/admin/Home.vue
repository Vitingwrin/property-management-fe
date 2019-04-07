<template>
  <el-container style="min-width: 1350px">

    <!--顶栏-->
    <el-header height="5vh" align="right">
      <a class="brand" href="#">招聘后台管理</a>
      <!--<el-input class="search-bar" type="text" placeholder="搜索...">-->
        <!--<template slot="prefix"><fa style="margin-left: .3rem" icon="search"></fa></template>-->
      <!--</el-input>-->
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
        <el-menu :default-active="currentMenu" :collapse="collapse" @open="handleOpen" @close="handleClose"
                 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router
                 @mouseenter.native="showSideBar" @mouseleave.native="hideSideBar" class="menu">
          <el-submenu index="1" style="margin-top: 30px">
            <template slot="title"><fa icon="file-alt" :style="gutter"></fa><span>新闻管理&emsp;&emsp;</span></template>
            <el-menu-item index="/admin/news/publish">添加&emsp;</el-menu-item>
            <el-menu-item index="/admin/news/published">已发布</el-menu-item>
            <el-menu-item index="/admin/news/trash">回收站</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><fa icon="tags" :style="gutter"></fa><span>职位管理&emsp;&emsp;</span></template>
            <el-menu-item index="/admin/job/add">添加</el-menu-item>
            <el-menu-item index="/admin/job/manage">管理</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><fa icon="tags" :style="gutter"></fa><span>系统用户管理</span></template>
            <el-menu-item index="/admin/user/add">添加用户</el-menu-item>
            <el-menu-item index="/admin/user/pwd">修改密码</el-menu-item>
            <el-menu-item index="/admin/user/manage">用户查看</el-menu-item>
          </el-submenu>
          <el-menu-item index="/admin/company/manage">
            <fa icon="tags" :style="gutter"></fa><span slot="title">企业信息管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/jobResume/manage">
            <fa icon="tags" :style="gutter"></fa><span slot="title">应聘信息管理</span>
          </el-menu-item>
          <el-menu-item index="0" class="lock">
            <div @mousedown="clicking=!clicking" @mouseup="clicking=!clicking" @click.stop="lock">
              <fa :style="lockStyle" :icon="lockIcon"></fa>
            </div>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!--内容-->
      <el-main>
        <el-card style="height: 85vh; width: 94%; margin-left: 3%; margin-top: 1%">
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
      },
      lockIcon: function() {
        return this.locked ? "lock" : "lock-open";
      },
      lockStyle: function() {
        const style = { transition: "color .2s" };
        style.color = this.clicking ? "#ffd04b" : "#aaaaaa";
        return style;
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
            this.$router.push({name: 'login'});
            break;
        }
      },
      changeMenuFromUrl: function(url) {
        url = url.substr(url.indexOf('//') + 2);
        this.currentMenu = url.substr(url.indexOf('/'));
      },
      handleOpen(key, keyPath) {
        console.log(key + '   ' + keyPath);
      },
      handleClose(key, keyPath) {

      },
      showSideBar() {
        this.collapse = false;
      },
      hideSideBar() {
        this.collapse = !this.locked;
      },
      lock() {
        this.locked = !this.locked;
      }
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #3c3f41;
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
  }

  .menu:not(.el-menu--collapse) {
    width: 20vw;
  }

  .lock {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .lock > div {
    margin-left: -20px;   /*抵消父元素*/
    margin-right: -20px;  /*抵消父元素*/
    width: inherit;
    height: inherit;
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
    background-color: #3c3f41;
    line-height: 5vh;
  }

  .search-bar {
    width: 80vw;
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
