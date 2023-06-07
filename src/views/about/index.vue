<template>
    <div class="app-container">
        <div class="about">关于我</div>
        <el-input v-model="input" placeholder="请输入内容" :disabled="isDisabled"></el-input>
        <el-button type="primary" @click="handleClick" style="margin-top: 15px;">{{ btnContent }}</el-button>
    </div>
</template>

<script>
import { getAbout,editAbout } from '@/api/about.js';
export default {
    data(){
        return {
            data:[],
            input:"",
            //是否禁用
            isDisabled:true,
            btnContent:'编辑',
        }
    },
    created(){
        this.fetchData()
    },
    methods:{
        fetchData(){
            getAbout().then(({data}) => {
                this.input = data;
            })
        },
        handleClick(){
            if( this.btnContent === '编辑'){
                this.btnContent = '完成';
                this.isDisabled = !this.isDisabled;
            }
            else{
                if(this.input){
                    //用户完成编辑，更新内容
                    this.btnContent = '编辑';
                    this.isDisabled = !this.isDisabled;
                    editAbout({url:this.input}).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '编辑成功!'
                        });
                    })
                }else{
                    this.$message({
                        type: 'warning',
                        message: '输入框不能为空'
                    });
                }
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.about{
    margin-bottom: 15px;
}
</style>