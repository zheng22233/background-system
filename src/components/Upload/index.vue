<template>
    <div class="upload-container">
        <!-- 上传标题 -->
        <div>{{ uploadTitle }}</div>
        <!-- 上传图片 -->
        <!-- "/api/upload"接口需要授权，因此要携带token -->
        <el-upload class="avatar-uploader" action="/api/upload" :headers="header"
        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
export default {
    props:['uploadTitle','value'],
    computed:{
        imageUrl(){
            return this.value;
        },
        header(){
            return {
                //从本地获取token添加到headers里
                Authorization:'Bearer ' + localStorage.getItem('adminToken')
            }
        }
    },
    methods: {
        handleAvatarSuccess(res, file) {
            if(!res.code && res.data){
                this.$emit('input',res.data)
            }
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
}
</script>

<style lang="scss" scoped>
.upload-container{
    width: 178px;
}
.avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 178px;
    text-align: center;
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>