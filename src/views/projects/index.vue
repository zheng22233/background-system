<template>
    <div class="app-container">
        <el-table :data="data" style="width: 100%" v-loading="isLoading">
            <!-- 序号 -->
            <el-table-column prop="date" label="序号" width="60" align="center">
                <template slot-scope="scope">{{ scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="项目名称"  align="center" width="150">
                <template slot-scope="scope">
                    <a href="scope.row.url"><span style="margin-left: 10px">{{ scope.row.name}}</span></a>
                </template>
            </el-table-column>
            <el-table-column label="项目描述"  align="center">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.description.toString() }}</span>
                </template>
            </el-table-column>
            <el-table-column label="预览图"  align="center" width="150">
                <template slot-scope="scope">
                    <el-image style="width: 200px;"
                        :src="scope.row.thumb"
                        fit="contain"
                        :preview-src-list="thumbList"
                    >
                    </el-image>
                </template>
            </el-table-column>

            <!-- 编辑 -->
            <el-table-column prop="date" label="操作" align="center">
                <template slot-scope="scope">
                    <!-- github -->
                    <el-tooltip class="item" effect="dark" content="github" placement="top" :hide-after="2000">
                        <el-button type="primary" icon="iconfont icon-github" class="github" circle size="small" @click="handleGithub(scope.row)">
                        </el-button>
                    </el-tooltip>

                    <!-- 编辑 -->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="2000">
                        <el-button type="primary" icon="el-icon-edit" circle size="small" @click="editEvent(scope.row)">
                        </el-button>
                    </el-tooltip>

                    <!-- 删除 -->
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="2000">
                        <el-button type="danger" icon="el-icon-delete" circle size="small" @click="handleDelete(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

         <!-- 弹出框 -->
        <el-dialog name="请编辑该项目信息" :visible.sync="dialogFormVisible" top="5vh" fullscreen>
            <el-form :model="form">
                <!-- 标题 -->
                <el-form-item label="项目名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <!-- 描述 -->
                <el-form-item label="项目描述(每一项描述以英文逗号分隔)">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>

                 <!-- 项目链接 -->
                 <el-form-item label="项目链接">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>

                <!-- github地址 -->
                <el-form-item label="github地址">
                    <el-input v-model="form.github"></el-input>
                </el-form-item>
                
                <!-- 预览图 -->
                <el-form-item label="预览图">
                    <Upload v-model="form.thumb" />
                </el-form-item>

                <!--排序等级 -->
                <el-form-item label="排序等级">
                    <el-select v-model="form.order" placeholder="请选择">
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
                <el-button type="primary" @click="editProjectConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getProject,deleteProject,addProject,editProject} from '@/api/project.js';
import Upload from '@/components/Upload/index.vue';
export default {
    components:{
        Upload,
    },
    data(){
        return{
            //储存数据
            data:[],
            isLoading:false,
            thumbList:[],
            dialogFormVisible:false,
            form:{
                id:'',
                name:'',
                description:'',
                thumb:'',
                url:'',
                github:'',
                order:1,
            }
        }
    },
    methods:{
        fetchData(){
            this.isLoading = true;
            getProject().then(({data})=>{
                this.data = data;
                for (let item of this.data) {
                    this.thumbList.push(item.thumb);
                }
                this.isLoading = false;
            })
        },
        editProjectConfirm(){
            let obj = {...this.form};
            obj.description = this.form.description.split(',');
            obj.order = parseInt(this.form.order);
            editProject(obj.id,obj).then(()=>{
                this.fetchData();
                this.dialogFormVisible = false;
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
            })
        },
        //点击编辑要做的事
        editEvent(editInfo){
            //回填数据
            this.form = {...editInfo,description:editInfo.description.toString()}
            this.form.thumb = editInfo.thumb
            //打开表单
            this.dialogFormVisible = true;
        },
        handleDelete(blogInfo) {
            this.$confirm('确定要删除该项目吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteProject(blogInfo.id).then(()=>{
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
        handleGithub(Info){
            window.open(Info.github);
        }
    },
    created(){
        this.fetchData()
    },
}
</script>

<style lang="scss" scoped>
.github{
    background-color: rgb(163,163,163);
    border: 1px solid rgb(163,163,163);
}
</style>