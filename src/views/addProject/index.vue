<template>
    <div class="app-container">
        <el-form :model="form">
            <!-- 标题 -->
            <el-form-item label="项目名称">
                <el-input v-model="form.name" placeholder="请输入项目的名称"></el-input>
            </el-form-item>

            <!-- 描述 -->
            <el-form-item label="项目描述(每一项描述以英文逗号分隔)">
                <el-input v-model="form.description" placeholder="请输入项目的描述，每一项描述以英文逗号分割"></el-input>
            </el-form-item>

            <!-- 项目链接 -->
            <el-form-item label="项目链接">
                <el-input v-model="form.url" placeholder="请输入项目的链接"></el-input>
            </el-form-item>

            <!-- github地址 -->
            <el-form-item label="github地址">
                <el-input v-model="form.github" placeholder="请输入项目的 github 地址"></el-input>
            </el-form-item>
                
            <!-- 预览图 -->
            <el-form-item label="项目预览图地址">
                <Upload v-model="form.thumb" />
            </el-form-item>

            <!--排序等级 -->
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
            <el-button type="primary" @click="publishProject">发布项目</el-button>
        </div>
    </div>
</template>

<script>
import {addProject} from '@/api/project.js';
import Upload from '@/components/Upload/index.vue';
export default {
    components:{
        Upload,
    },
    data(){
        return{
            form:{
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
        publishProject(){
            let obj = {...this.form};
            obj.description = this.form.description.split(',');
            obj.order = parseInt(this.form.order);
            addProject(obj).then(()=>{
                this.$router.push('/projectsList');
                this.$message({
                    message: '添加项目成功',
                    type: 'success'
                });
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>