<template>
    <div>
        <!-- 文章标题 -->
        <div class="block">文章标题</div>
        <div style="margin-bottom:15px">
            <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
        </div>

        <!-- 文章编辑 -->
        <div class="block">文章编辑</div>
        <editor  
            ref="toastuiEditor"
            :initialValue="form.editorText"
            height="500px"
            :options="editorOption"
        />

        <!-- 文章描述 -->
        <div class="block">文章描述</div>
        <el-input
            type="textarea"
            placeholder="请输入内容"
            :autosize="{minRows: 3}"
            v-model="form.description">
        </el-input>

        <!-- 文章头图 -->
        <div class="block">文章头图</div>
        <Upload v-model="form.thumb" class="UploadStyle"/>

        <!-- 文章分类 -->
        <div class="block">文章分类</div>
        <el-select v-model="form.select" slot="prepend" @change="handleChange">
            <el-option v-for="item in BlogType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>

        <!-- 发布按钮 -->
        <div class="block">
            <el-button type="primary" @click="submit">{{ buttonContent }}</el-button>
        </div>
    </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import Upload from '@/components/Upload/index.vue';
import {getBlogType} from '@/api/blogType.js';
import {findBlog,editBlog,publishBlog} from '@/api/blog.js';
import "@toast-ui/editor/dist/i18n/zh-cn";
export default {
    props:["mode"],
    components:{
        editor:Editor,
        Upload,
    },
    data(){
        return {
            //存储传递过来的id
            id:'',
            form:{
                title:'',
                // 用户编辑的markdown内容
                editorText:'',
                description:'',
                thumb:'',
                select:'',
            },
            BlogType:[],
            editorOption:{
                language:"zh-CN"
            },
            buttonContent:"发布文章"
        }
    },
    methods:{
        //提交表单
        submit(){
            let html = this.$refs.toastuiEditor.invoke('getHTML');
            let markdown = this.$refs.toastuiEditor.invoke('getMarkdown');
            let obj = {
                title: this.form.title,
                description: this.form.description,
                createDate: new Date().getTime(),
                categoryId: this.form.select,
                // toc 传递一个空数组过去，之后在服务器根据 markdown 的内容来生成 toc 目录
                toc: [],
                htmlContent: html,
                thumb: this.form.thumb,
                markdownContent: markdown
            };
            if(this.mode === 'edit'){
                if(obj.title && obj.description && obj.htmlContent && obj.categoryId){
                    editBlog({id:this.form.id,data:obj}).then(()=>{
                        //跳转到文章列表
                        this.$router.push('/blogList')
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                    })
                }else{
                    this.$message({
                        message: '请填写所有内容',
                        type: 'error'
                    });
                }
            }else{
                if(obj.title && obj.description && obj.htmlContent && obj.categoryId){
                    publishBlog(obj).then(()=>{
                        //跳转到文章列表
                        this.$router.push('/blogList')
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                    })
                }else{
                    this.$message({
                        message: '请填写所有内容',
                        type: 'error'
                    });
                }
            }
        },
        handleChange(){
            //强制更新
            this.$forceUpdate();
        }
    },
    created() {
        getBlogType().then(({ data }) => {
            this.BlogType = data;
        });
        //编辑文章
        if (this.mode === 'edit') {
            this.buttonContent = "确认修改";
            //拿到当前编辑文章的id
            this.id = this.$route.params.id;
            findBlog(this.id).then(({ data }) => {
                this.form = data;
                this.form.select = data.category === null ? "" : data.category.id;
                this.$refs.toastuiEditor.invoke('setHTML', data.htmlContent)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.block{
    font-weight: 100;
    margin: 15px 0;
}
</style>