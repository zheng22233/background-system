<template>
    <div class="app-container">
        <el-table :data="data" border style="width: 100%">
            <el-table-column prop="date" label="序号" width="60" align="center">
                <template slot-scope="scope">{{ scope.$index + (currentPage-1) * pageSizes + 1}}</template>
            </el-table-column>
            <el-table-column prop="title" label="文章名称" width="150" align="center">
                <template slot-scope="scope">
                    <el-popover
                    placement="top-start"
                    title="博客浏览图"
                    width="230"
                    trigger="hover"
                    slot="reference" >
                        <el-image style="width: 200px;"
                        :src="scope.row.thumb"
                        fit="contain"
                        :preview-src-list="thumbList">
                        </el-image>
                        <a href="#" target="_blank" slot="reference" @click.prevent="goToTitleHandle(scope.row)">{{ scope.row.title }}</a>
                    </el-popover>
            </template>
            </el-table-column>
            <el-table-column prop="description" label="文章描述" align="center">
                <template slot-scope="scope">{{ scope.row.description }}</template>
            </el-table-column>
            <el-table-column prop="scanNumber" label="浏览数" align="center">
                <template slot-scope="scope">{{ scope.row.scanNumber }}</template>
            </el-table-column>
            <el-table-column prop="commentNumber" label="评论量" align="center">
                <template slot-scope="scope">{{ scope.row.commentNumber }}</template>
            </el-table-column>
            <el-table-column prop="category.name" label="所属分类" align="center">
                <template slot-scope="scope">{{ scope.row.category === null ? "未分类" : scope.row.category.name }}</template>
            </el-table-column>
            <el-table-column prop="createDate" label="创建日期" align="center">
                <template slot-scope="scope">{{ scope.row.createDate }}</template>
            </el-table-column>
                <!-- 编辑 -->
            <el-table-column prop="date" label="操作" align="center">
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

        <!-- 分页 -->
        <el-pagination
            class="pager"
            background
            @prev-click="handlePrevClick"
            @next-click="handleNextClick"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[5,10,15,20]"
            :page-size="51"
            layout=" prev, pager, next,total,->, sizes, jumper"
            :total="count">
        </el-pagination>
    </div>
</template>

<script>
import {deleteBlog,getBlog} from '@/api/blog.js';
import {formatDate} from '@/utils/tools.js';
export default {
    data() {
        return {
            data: [],
            //预览图链接数组
            thumbList:[],
            visible: false,
            formLabelWidth: '120px',
            //当前页码
            currentPage:1,
            //每页显示条数
            pageSizes:5,
            //总数据数
            count:0,
            totalPage:0,
        }
    },
    computed:{
    },
    methods: {
        //删除
        handleDelete(blogInfo) {
            this.$confirm('删除该文章会将下面的评论一并删除, 是否继续?', '是否删除此篇文章', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBlog(blogInfo.id).then(()=>{
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
        //编辑
        editEvent(info) {
            this.$router.push(`/editBlog/${info.id}`)
        },
        //跳转到具体文章
        goToTitleHandle(blogInfo){
            //点开对应链接
            window.open(`/article/${blogInfo.id}`)
        },
        fetchData(){
            getBlog(this.currentPage,this.pageSizes).then(({data}) => {
                this.data = data.rows;
                for(let i=0;i<this.data.length;i++){
                    this.data[i].createDate = formatDate(this.data[i].createDate);
                    this.thumbList.push(this.data[i].thumb);
                }
                this.count = data.total;
                this.totalPage = Math.ceil(this.count / this.pageSizes);
                //将最后一页的数据全部删除时触发
                if(this.currentPage > this.totalPage) {
                    this.currentPage = this.totalPage;
                    this.fetchData();
                }
            })
        },
        handleSizeChange(pagerNum){
            this.pageSizes = pagerNum;
            this.currentPage = 1;
            this.fetchData()
        },
        handleCurrentChange(pageNum){
            this.currentPage = pageNum;
            this.fetchData();
        },
        //下一页，会触发current-change事件
        handleNextClick(){
            this.currentPage++;
        },
        //上一页，会触发current-change事件
        handlePrevClick(){
            this.currentPage--;
        }
    },
    created(){
        this.fetchData();
    }
}
</script>

<style lang="scss" scoped>
.pager{
    margin-top: 30px;
}
</style>