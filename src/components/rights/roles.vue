<template>
    <el-card class="my_card">
        <!-- 面包屑导航 -->
        <my-bread level1="权限管理" level2="角色列表"></my-bread>
        <!-- 搜索框 -->
        <el-button type="success" class="addRole">添加角色</el-button>
        <!-- 角色列表显示 -->
        <el-table
            height="400px"
            :data="rolelist"
            stripe
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <span v-if="scope.row.children.length === 0">没有相关权限</span>
                    <el-row v-for="(item,i) in scope.row.children" :key="i">
                        <el-col :span="4">
                            <el-tag @close="delRole(scope.row,item.id)" closable>{{item.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row v-for="(item1,index) in item.children" :key="index">
                                <el-col :span="4">
                                    <el-tag @close="delRole(scope.row,item1.id)" type="success" closable>{{item1.authName}}</el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="20"><el-tag @close="delRole(scope.row,item2.id)" type="danger" closable v-for="(item2,index) in item1.children" :key="index">{{item2.authName}}</el-tag></el-col>
                            </el-row>
                        </el-col>
                    </el-row>                    
                </template>
            </el-table-column>
            <el-table-column
            type="index"
            label="#"
            width="80">
            </el-table-column>
            <el-table-column
            prop="roleName"
            label="角色名称"
            width="380">
            </el-table-column>
            <el-table-column
            prop="roleDesc"
            label="角色描述"
            width="380">
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                    <el-button @click="addRightShow(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加权限" :visible.sync="dialogFormVisibleRight">
            <!-- :default-expanded-keys="[2, 3]" -->
                <!-- :default-checked-keys="[5]" -->
            <el-tree
                ref="tree"
                :data="rightsData"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="checkedArr"
                :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
                <el-button type="primary" @click="addRights()">确 定</el-button>
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
            rolelist: [],
            rightsData:[],
            dialogFormVisibleRight:false,
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            checkedArr:[],
            roleId: -1
            
        }
    },
    created() {
        this.getRoleLists();
    },
    methods: {
        //权限增加
        async addRights() {
            this.dialogFormVisibleRight = false
            // roles/:roleId/rights
            var arr1 = this.$refs.tree.getCheckedKeys();
            var arr2 = this.$refs.tree.getHalfCheckedKeys();
            var arr = [...arr1,...arr2];
            const res = await this.$http.post(`roles/${this.roleId}/rights`,{rids:arr.join(',')});
            this.$message.success(res.data.meta.msg)
            this.getRoleLists()
        },
        async addRightShow(user) {
            var tmparr = []
            this.dialogFormVisibleRight = true
            const res = await this.$http.get(`rights/tree`);
            this.rightsData = res.data.data
            this.roleId = user.id
            //获取选中id
            user.children.forEach(item => {
                // this.checkedArr.push(item.id)
                item.children.forEach(item1 => {
                    // this.checkedArr.push(item1.id)
                    item1.children.forEach(item2 => {
                        tmparr.push(item2.id)
                    })
                })
            })
            this.checkedArr = tmparr;
        },

        //权限删除时触发
        async delRole(role,rightId) {
            //roles/:roleId/rights/:rightId
            const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            role.children = res.data.data
            this.$message.success(res.data.meta.msg)
        },       
        //获取角色列表
        async getRoleLists() {
            const res = await this.$http.get(`roles`);
            this.rolelist = res.data.data
        }
    }
}
</script>

<style>
.my_card {
    height: 100%;
}
.addRole {
    margin-top: 20px;
}
</style>


