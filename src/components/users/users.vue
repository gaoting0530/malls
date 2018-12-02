<template>
    <el-card class="my_card">
        <!-- 面包屑导航 -->
        <my-bread level1="用户管理" level2="用户列表"></my-bread>
        <!-- 搜索框 -->
        <el-input placeholder="请输入内容" v-model="query" class="inputselect" clearable @clear="clearquery()">
            <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button type="success" @click="addUsersShow()">添加用户</el-button>
        <!-- 用户列表显示 -->
        <el-table
            height="300px"
            :data="userlist"
            style="width: 100%">
            <el-table-column
                type="index"
                label="#"
                width="80">
            </el-table-column>
            <el-table-column
                prop="username"
                label="用户名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机号">
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="创建时间">
            </el-table-column>
            <el-table-column
                label="用户状态">
                <template slot-scope="scope">
                    <el-switch
                    @change="changeState(scope.row)"
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                    </el-switch>
                </template> 
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="editUsersShow(scope.row)" type="primary" plain size="mini" icon="el-icon-edit" circle></el-button>
                    <el-button @click="delUser(scope.row.id)" type="danger" plain size="mini" icon="el-icon-delete" circle></el-button>  
                    <el-button @click="setRoleShow(scope.row)" type="success" plain size="mini" icon="el-icon-check" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页搜索 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!-- 用户添加对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="form.username" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editUser(currentId)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog title="角色分配" :visible.sync="dialogFormVisibleRole">
            <el-form :model="form">
                <el-form-item label="用户" :label-width="formLabelWidth">
                    {{currentUser}}
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                    {{roleId}}
                <el-select v-model="roleId" placeholder="请选择活动区域">
                    <el-option label="请选择" :value="-1" disabled></el-option>
                    <el-option v-for="(item,i) in rolelist" :key="i" :label="item.roleName" :value="item.id"></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
                <el-button type="primary" @click="setRole()">确 定</el-button>
            </div>
        </el-dialog>

    </el-card>
</template>

<script>
export default {
    data() {
        return {
            query: '',
            pagenum: 1,
            pagesize: 2,
            userlist: [],
            total: -1,
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            dialogFormVisibleRole: false,
            form: {
                password : '',
                email : '',
                username : '',
                mobile : ''
            },
            formLabelWidth: '120px',
            currentId: -1,
            currentUser:'',
            rolelist:[],
            roleId: -1,
            userId: -1
        }
    },
    created() {
        this.getUserLists();
    },
    methods: {
        //分配角色功能实现
        async setRole() {
            const res = await this.$http.put(`users/${this.userId}/role`,{rid: this.roleId});
            this.$message.success(res.data.meta.msg)
            this.dialogFormVisibleRole = false
        },
        //分配角色对话框显示
        async setRoleShow(user) {
            this.currentUser = user.username
            this.userId = user.id
            //获取所有角色列表
            const res = await this.$http.get(`roles`);
            this.rolelist = res.data.data;
            //根据id查询用户信息
            const res1 = await this.$http.get(`users/${user.id}`);
            this.roleId = res1.data.data.rid;
            this.dialogFormVisibleRole = true
        },
        //编辑用户提交
        async editUser(id) {
            //users/:id
            const res = await this.$http.put(`users/${id}`,{email:this.form.email,mobile: this.form.mobile})
            this.$message.success(res.data.meta.msg);

            this.dialogFormVisibleEdit = false
        },
        //修改用户对话框显示
        editUsersShow(user) {
            this.form = user;
            this.currentId = user.id
            this.dialogFormVisibleEdit = true
        },
        //添加用户功能实现
        async addUser() {
            const res = await this.$http.post(`users`,this.form);
            const {meta:{msg,status}} = res.data
            if(status === 201) {
                this.$message.success(msg);
                this.getUserLists();
            } else {
                this.$message.warning(msg)
            }
            //关闭对话框
            this.dialogFormVisibleAdd = false
        },
        //添加用户弹窗显示
        addUsersShow() {
            //清空弹窗中的表单数据
            this.form = {}
            //关闭对话框
            this.dialogFormVisibleAdd = true;
        },
        //用户状态设置
        async changeState(user) {
            //users/:uId/state/:type
           const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
           const {meta:{msg,status}} = res.data
           if(status === 200) {
               this.$message.success(msg);
           }
        },
        //根据id删除用户
        async delUser(id) {
              const res = await this.$http.delete(`users/${id}`);
              //提示删除成功
              this.$message.success(res.data.meta.msg);
              //当前页设置为1
              this.pagenum = 1;
              //重载数据
              this.getUserLists();
        },
        //根据搜索框中的关键字query搜索相关用户
        searchUser() {
            this.getUserLists();
        },
        //搜索框清空时触发
        clearquery() {
            this.getUserLists()
        },
        //每页多少条数据发生变化时触发
         handleSizeChange(val) {
             this.pagesize = val;
             this.pagenum = 1;//每次发生变化都从第一页开始显示
             this.getUserLists()
        },
        //当前是页码发生变化时触发
        handleCurrentChange(val) {
            this.pagenum = val;
            this.getUserLists();
        },
        //获取用户列表
        async getUserLists() {
            const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
            this.userlist = res.data.data.users;
            this.total = res.data.data.total;
        }
    }
}
</script>

<style>
.my_card {
    height: 100%;
}
.inputselect {
    margin-top: 20px;
    width: 400px;
}
</style>
