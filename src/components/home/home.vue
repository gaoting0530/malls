<template>
    <el-container class="my_container">
        <el-header class="header">
            <el-row>
                <el-col :span="6"><a href="#"><img src="@/assets/logo.png" alt=""></a></el-col>
                <el-col :span="16"><h2>电商后台管理系统</h2></el-col>
                <el-col :span="2"><a href="#" class="logout" @click="logout()">退出</a></el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside width="200px" class="aside">
                 <el-menu
                    default-active="2"
                    :unique-opened="true"
                    :router="true"
                    class="el-menu-vertical-demo">
                    <el-submenu :index="''+item.order" v-for="(item,i) in menulist" :key="i">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="item1.path" v-for="(item1,i) in item.children" :key="i">
                             <template>
                                <i class="el-icon-setting"></i>
                                <span>{{item1.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menulist:[]

        }
    },
    created() {
        this.getMenus();
    },
    methods: {
        //动态获取左侧菜单栏
        async getMenus() {
            //设置token,在发送请求之前设置头部信息
            const res = await this.$http.get(`menus`);
            this.menulist = res.data.data;
        },
        //退出登录
        logout() {
            //删除本地数据
            localStorage.removeItem('token');
            //跳转到登录页面
            this.$router.push({name:'login'});
            //提示用户退出成功
            this.$message.warning('退出登录');
        }
    }
}
</script>

<style>
.el-container {
    height: 100%;
}
.my_container {
    height: 100%;
}
.header {
    background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
  height: 100% !important;
}
.header h2 {
    text-align:center;
    margin: 0;
    padding: ;
    color: #fff;
    line-height: 60px;  
}
.logout {
    line-height: 60px;
}
</style>
