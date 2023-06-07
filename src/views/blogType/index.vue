<template>
    <div class="app-container">
        <!-- 1、搜索框 -->
        <div style="margin-top: 15px;" class="addType">
            <el-input placeholder="请输入要添加的分类，左边选择该分类等级" v-model="input" class="input-with-select">
                <el-select v-model="select" slot="prepend">
                    <el-option label="1" value="1"></el-option>
                    <el-option label="2" value="2"></el-option>
                    <el-option label="3" value="3"></el-option>
                    <el-option label="4" value="4"></el-option>
                    <el-option label="5" value="5"></el-option>
                </el-select>
            </el-input>
            <el-button class="addButton" slot="append" type="primary" @click="addBlogTypeHandle"> 添加</el-button>
        </div>

        <!-- 2、表格 -->
        <el-table :data="data" border style="width: 100%">
            <el-table-column prop="date" label="序号" width="100" align="center">
                <template slot-scope="scope">{{ scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="description" label="博客类别" align="center">
                <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column prop="scanNumber" label="文章数量" align="center">
                <template slot-scope="scope">{{ scope.row.articleCount }}</template>
            </el-table-column>
            <!-- 编辑 -->
            <el-table-column prop="date" label="操作" align="center" width="250">
                <template slot-scope="scope">
                    <!-- 提示信息 -->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="2000">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" circle size="small" @click="editEvent(scope.row)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="2000">
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" circle size="small" @click="handleDelete(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 3、编辑弹出框 -->
        <el-dialog title="请编辑该分类信息" :visible.sync="dialogFormVisible" top="5vh" width="30%">
            <el-form :model="form">
                <!-- 分类名称 -->
                <el-form-item label="分类名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <!-- 排序等级 -->
                <el-form-item label="排序等级">
                    <el-select v-model="form.order" placeholder="分类等级">
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editBlogTypeConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getBlogType,addBlogType,deleteBlogType,findBlogType,updateBlogType} from '@/api/blogType.js'
export default { 
    data() {
        return {
            input: '',
            //默认等级1
            select: '1',
            listLoading:false,
            data:[],
            dialogFormVisible: false, //编辑对话框是否显示
            form:{
                name:'',
                order:'',
            },
        }
    },
    created(){
        this.fetchData();
    },
    methods:{
        fetchData(){
            this.listLoading = true;
            getBlogType().then(res=>{
                this.listLoading = false;
                this.data = res.data;
            })
        },
        //编辑
        editEvent(Info){
            //回填到表单
            findBlogType(Info.id).then(res => {
                this.form = res.data;
            })
            //显示弹出框
            this.dialogFormVisible = true;
        },
        //确定编辑
        editBlogTypeConfirm(){
            updateBlogType({id:this.form.id,data:this.form}).then(()=>{
                this.fetchData();
                this.$message({
                    type: 'success',
                    message: '更新信息成功'
                });
                this.dialogFormVisible = false;
            });
        },
        //删除
        handleDelete(Info){
            this.$confirm('删除该分类后，该分类下面的所有文章将变为未分类状态, 是否继续?', '是否删除该分类', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBlogType(Info.id).then(()=>{
                    this.fetchData();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //添加文章分类
        addBlogTypeHandle(){
            if(this.input){
                addBlogType({name:this.input,order:this.select}).then(()=>{
                    this.fetchData();
                    this.input = '';
                    this.$message.success('添加成功')
                })
            }else{
                this.$message.error('分类名称不能为空')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.addType{
    display: flex;     
    width: 500px;
    margin-bottom: 20px;   
}
.addButton{
    margin-left: 10px;
}
</style>