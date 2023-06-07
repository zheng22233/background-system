<template>
    <div class="app-container">
        <el-table :data="data" border style="width: 100%">
            <el-table-column prop="date" label="序号" width="60" align="center">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="title" label="标题" width="150" align="center">
                <template slot-scope="scope">{{ scope.row.title }}</template>
            </el-table-column>
            <el-table-column prop="description" label="描述" align="center">
                <template slot-scope="scope">{{ scope.row.description }}</template>
            </el-table-column>
            <el-table-column label="中图预览" width="180" align="center">
                <template slot-scope="scope">
                    <el-image style="width: 100px; height: 100px" :src="scope.row.midImg" fit="fill">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column label="大图预览" width="180" align="center">
                <template slot-scope="scope">
                    <el-image style="width: 100px; height: 100px" :src="scope.row.bigImg" fit="fill">
                    </el-image>
                </template>
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
                </template>
            </el-table-column>
        </el-table>
         <!-- 弹出框 -->
        <!-- 编辑首页标语 -->
        <el-dialog title="请编辑信息" :visible.sync="dialogFormVisible" top="5vh">
            <el-form :model="form">
                <!-- 标题 -->
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <!-- 描述 -->
                <el-form-item label="描述">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <!-- 中图 -->
                        <el-form-item label="首页中图">
                            <Upload v-model="form.midImg" />
                        </el-form-item>
                    </el-col>
                        <!-- 大图 -->
                    <el-col :span="12">
                        <el-form-item label="首页大图">
                            <Upload v-model="form.bigImg" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editBannerConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getBanner,setBanner} from '@/api/banner.js';
import Upload from '@/components/Upload/index.vue'
export default {
    components:{
        Upload,
    },
    data() {
        return {
            data:[],
            dialogFormVisible: false, //编辑对话框是否显示
            form: {
                id: '',
                bigImg: '',
                midImg: '',
                title: '',
                description: '',
            },
            //弹出框宽度
            formLabelWidth: '120px'
        }
    },
    created(){
        this.fetchData();
    },
    methods:{
        fetchData(){
            getBanner().then(res => {
                this.data = res.data;
                // for (const item of this.data) {
                //     if(!item.midImg.includes(server_URL)){
                //         item.midImg2 = server_URL + item.midImg;
                //     }else{
                //         item.midImg2 = item.midImg;
                //     }
                //     if(!item.bigImg.includes(server_URL)){
                //         item.bigImg2 = server_URL + item.bigImg;
                //     }else{
                //         item.bigImg2 = item.bigImg;
                //     }
                // }
            })
        },
        editEvent(bannerInfo){
            //1、将bannerInfo的数据给from 
            //{...bannerInfo} 新创建一个对象给form
            this.form = {...bannerInfo}
            //2、显示表单
            this.dialogFormVisible = true;
        },
        //点击确定时，关闭并保存表单
        editBannerConfirm(){
            //从表单获取数据，并发送到服务器，再返回渲染
            //修改时，api文档需要将三个首页标语都发送过去
            let arr = [...this.data];
            for(let i=0;i<arr.length;i++){
                if(arr[i].id === this.form.id){
                    //找到被编辑的首页标语
                    arr[i] = this.form
                }
            }

            setBanner(arr).then( () => {
                this.dialogFormVisible = false;
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                this.fetchData();
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>