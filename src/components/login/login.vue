<template>
    <div class="mycontainer">
        <el-form label-position="top" label-width="80px" :model="formdata" class="myform">
            <el-form-item label="用户名">
                <el-input v-model="formdata.username"></el-input>
            </el-form-item>
            <el-form-item label="用户密码">
                <el-input v-model="formdata.password"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" class="mybtn" @click="checkLogin()">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formdata: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        //用户登录验证
       async checkLogin() {
           const res = await this.$http.post(`login`,this.formdata);
           const {data,meta:{msg,status}} = res.data;
           if(status === 200) {
               //登录成功提示
               this.$message.success(msg);
               //本地存储保存用户token
               localStorage.setItem('token',data.token)
               //跳转到首页
               this.$router.push({name: 'home'})
           }
           console.log(res);
        }
    }
}
</script>

<style>
.mycontainer {
    height: 100%;
    background: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
}
.myform {
    width: 400px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
}
.mybtn {
    width: 100%;
    margin-top: 20px;
}
</style>
