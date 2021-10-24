<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm1"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="商品图片"
        prop="pic"
        :rules="[
          { required: true, message: '商品图片不能为空', trigger: 'blur' },
        ]"
      >
        <el-upload
          class="upload-demo"
          action="http://localhost:5000/admin/upload"
          :headers="headers"
          list-type="picture-card"
          :on-preview="handlePreview"
          :on-success="upload"
          multiple
        >
          <el-icon-plus class="color-a0a0 img-20"></el-icon-plus>
        </el-upload>
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="quit">取消</el-button>
      <el-button class="mrl-20" type="primary" @click="comfirm">确认</el-button>
    </div>
    <!-- 预览图片 -->
    <div v-if="previsible" class="mask" @click="previsible = false">
      <img :src="imgUrl" alt="" style="width: 400px; height: 400px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
interface RuleForm {
  pic: string[];
}
let props = defineProps({
  activeIndex: {
    type: String,
    required: true,
  },
});
let emits = defineEmits(['update:activeIndex', 'data1']);
let imgUrl = ref('');
let ruleForm = ref<RuleForm>({
  pic: [],
});
let ruleForm1 = ref();
let previsible = ref(false);
// 头部
let headers = ref({
  Authorization: localStorage.getItem('token')!,
});
// 上传
let upload = (response: any, file: any, fileList: any) => {
  if (response.code === 200) {
    ruleForm.value.pic = response.data;
  }
};
// 预览
let handlePreview = (file: any) => {
  previsible.value = true;
  console.log(file);
  imgUrl.value = file.response.data;
};
// 取消
let quit = () => {
  emits('update:activeIndex', '1');
};
// 确认
let comfirm = () => {
  ruleForm1.value.validate((valid: any) => {
    if (valid) {
      emits('update:activeIndex', '3');
      emits('data1', ruleForm.value);
    }
  });
};
</script>

<style scoped>
</style>