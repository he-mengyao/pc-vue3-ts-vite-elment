<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="addFormRules"
      ref="addFormRef"
      class="demo-ruleForm"
      label-width="100px"
    >
      <el-form-item label="商品名称:" prop="name">
        <el-input
          v-model="ruleForm.name"
          placeholder="请输入商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="category">
        <el-cascader
          v-model="ruleForm.category"
          :options="props.categList"
          style="width: 100%"
          placeholder="请选择商品分类"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="商品原价:" prop="originalPrice">
        <el-input
          v-model="ruleForm.originalPrice"
          placeholder="请输入商品原价"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品现价:" prop="presentPrice">
        <el-input
          v-model="ruleForm.presentPrice"
          placeholder="请输入商品现价"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="封面图:" prop="cover">
        <el-upload
          class="upload-demo"
          action="http://localhost:5000/admin/upload"
          list-type="picture"
          :headers="headers"
          :on-success="upload"
          :show-file-list="false"
        >
          <div class="color-blue mrl-20">点击上传图片</div>
        </el-upload>
        <el-image
          v-if="imageUrl"
          :src="imageUrl"
          style="width: 100px; height: 100px"
          :preview-src-list="[imageUrl]"
        />
      </el-form-item>
      <el-form-item label="商品单位:" prop="company">
        <el-input
          v-model="ruleForm.company"
          placeholder="请输入商品单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品库存:" prop="stock">
        <el-input
          v-model="ruleForm.stock"
          placeholder="请输入商品库存"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品简介:" prop="introduction">
        <el-input
          v-model="ruleForm.introduction"
          placeholder="请输入商品简介"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="推荐介绍:" prop="sellDesc">
        <el-input
          v-model="ruleForm.sellDesc"
          placeholder="请输入推荐介绍"
          type="textarea"
          rows="3"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否新品:" prop="isNewGood">
        <el-switch v-model="ruleForm.isNewGood"></el-switch>
      </el-form-item>
      <el-form-item label="是否热销:" prop="isHot">
        <el-switch v-model="ruleForm.isHot"></el-switch>
      </el-form-item>
      <el-form-item label="是否推荐:" prop="isRecommend">
        <el-switch v-model="ruleForm.isRecommend"></el-switch>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div>
      <el-button @click="quit">取消</el-button>
      <el-button class="mrl-20" type="primary" @click="comfirm">确认</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface RuleForm {
  name: string;
  category: any;
  originalPrice: string;
  presentPrice: string;
  cover: string;
  company: string;
  stock: string;
  introduction: string;
  sellDesc: string;
  isNewGood: boolean;
  isHot: boolean;
  isRecommend: boolean;
}
let props = defineProps({
  categList: {
    type: Array,
    requried: true,
  },
  activeIndex: {
    type: String,
    requried: true,
  },
  visible: {
    type: Boolean,
    requried: true,
  },
});
// 头部
let headers = ref({
  Authorization: localStorage.getItem('token')!,
});
let imageUrl = ref('');
let addFormRef = ref();
let ruleForm = ref<RuleForm>({
  name: '',
  category: '',
  originalPrice: '',
  presentPrice: '',
  cover: '',
  company: '',
  stock: '',
  introduction: '',
  sellDesc: '',
  isNewGood: true,
  isHot: true,
  isRecommend: true,
});
let addFormRules = ref({
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
  originalPrice: [
    { required: true, message: '请输入商品原价', trigger: 'blur' },
  ],
  presentPrice: [
    { required: true, message: '请输入商品现价', trigger: 'blur' },
  ],
  cover: [{ required: true, message: '请上传商品图片', trigger: 'blur' }],
  company: [{ required: true, message: '请输入商品单位', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
  introduction: [
    { required: true, message: '请输入商品简介', trigger: 'blur' },
  ],
  sellDesc: [{ required: true, message: '请输入推荐介绍', trigger: 'blur' }],
});
// 上传
let upload = (response: any, file: any, fileList: any) => {
  if (response.code === 200) {
    ruleForm.value.cover = response.data;
    imageUrl.value = response.data;
  }
};
let emits = defineEmits(['update:visible', 'update:activeIndex', 'data1']);
// 点击取消
let quit = () => {
  emits('update:visible', false);
};
// 点击确认
let comfirm = () => {
  addFormRef.value.validate((valid: boolean) => {
    if (valid) {
      ruleForm.value.category =
        ruleForm.value.category.length === 1
          ? ruleForm.value.category[0]._id
          : ruleForm.value.category[1]._id;
      emits('update:activeIndex', '2');
      emits('data1', ruleForm.value);
    }
  });
};
</script>

<style scoped>
</style>