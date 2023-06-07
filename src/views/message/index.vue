<template>
    <div class="app-container">
        <el-table :data="data" border style="width: 100%" v-loading="loading" element-loading-text="加载数据中" highlight-current-row>
            <el-table-column prop="date" label="序号" width="100" align="center">
                <template slot-scope="scope">{{ scope.$index + (currentPage-1) * limit + 1}}</template>
            </el-table-column>
            <el-table-column prop="title" label="头像" width="150" align="center">
                <template slot-scope="scope">
                    <el-avatar shape="square" size="small" :src="scope.row.avatar"></el-avatar>
            </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称"  width="200" align="center">
                <template slot-scope="scope">{{ scope.row.nickname }}</template>
            </el-table-column>
            <el-table-column prop="content" label="内容" align="center">
                <template slot-scope="scope">{{ scope.row.content }}</template>
            </el-table-column>
            <el-table-column prop="createDate" label="创建日期" width="250" align="center">
                <template slot-scope="scope">{{ scope.row.createDate }}</template>
            </el-table-column>
                <!-- 编辑 -->
            <el-table-column prop="date" label="操作" align="center" width="120">
                <template slot-scope="scope">
                    <!-- 提示信息 -->
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
            :page-size="5"
            layout=" prev, pager, next,total,->, sizes, jumper"
            :total="count">
        </el-pagination>
    </div>
</template>

<script>
import {getMessage,deleteMessage} from '@/api/message.js';
import {formatDate} from '@/utils/tools.js'
export default{
    data() {
        return {
            data: [],
            //预览图链接数组
            avatarList:[],
            loading: false,
            //当前页码
            currentPage:1,
            //每页显示条数
            limit:5,
            //总数据数
            count:0,
            totalPage:0,
        }
    },
    methods: {
        //删除
        handleDelete(Info) {
            this.$confirm('是否删除此条留言？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteMessage(Info.id).then(()=>{
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
        fetchData(){
            this.loading = true;
            getMessage(this.currentPage,this.limit).then(({data}) => {
                this.loading = false;
                console.log(data)
                this.data = data.rows;
                for(let i=0;i<this.data.length;i++){
                    this.data[i].createDate = formatDate(this.data[i].createDate);
                    this.avatarList.push(this.data[i].avatar);
                }
                this.count = data.total;
                this.totalPage = Math.ceil(this.count / this.limit);
                //将最后一页的数据全部删除时触发
                if(this.currentPage > this.totalPage) {
                    this.currentPage = this.totalPage;
                    this.fetchData();
                }
            })
        },
        handleSizeChange(pagerNum){
            this.limit = pagerNum;
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