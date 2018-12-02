<template>
    <el-card class="my_card">
        <!-- 面包屑导航 -->
        <my-bread level1="权限管理" level2="权限列表"></my-bread>
        <!-- 搜索框 -->
        <el-button type="success" class="addRight">添加权限</el-button>
        <!-- 权限列表显示 -->
        <el-table
            height="400px"
            :data="rightlist"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            label="#"
            width="80">
            </el-table-column>
            <el-table-column
            prop="authName"
            label="权限名称"
            width="280">
            </el-table-column>
            <el-table-column
            prop="path"
            label="权限路径"
            width="280">
            </el-table-column>
            <el-table-column
            label="权限等级">
                <template slot-scope="scope">
                    <span v-if="scope.row.level === '0'">一级</span>
                    <span v-if="scope.row.level === '1'">二级</span>
                    <span v-if="scope.row.level === '2'">三级</span>
                </template>
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                </template>
            </el-table-column>
        </el-table>

    </el-card>
</template>

<script>
export default {
    data() {
        return {
            query: '',
            pagenum: 1,
            pagesize: 2,
            rightlist: [],
            total: -1,
            
        }
    },
    created() {
        this.getRightLists();
    },
    methods: {
       
        //获取权限列表
        async getRightLists() {
            const res = await this.$http.get(`rights/list`);
            this.rightlist = res.data.data
            console.log(res)
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
.addRight {
    margin-top: 20px;
}
</style>

