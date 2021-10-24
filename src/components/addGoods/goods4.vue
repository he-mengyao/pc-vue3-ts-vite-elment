<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm1"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="商品详情"
        prop="detail"
        :rules="[
          { required: true, message: '商品图片不能为空', trigger: 'blur' },
        ]"
      >
        <div id="div1"></div>
      </el-form-item>
    </el-form>
    <div class="mrtb-20">
      <el-button @click="quit">取消</el-button>
      <el-button class="mrl-20" type="primary" @click="comfirm">确认</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import E from 'wangeditor';
interface RuleForm {
  detail: any;
}
let props = defineProps({
  activeIndex: {
    type: String,
    required: true,
  },
});
let editor = ref<any>();
let emits = defineEmits(['update:activeIndex', 'data1']);
let ruleForm = ref<RuleForm>({
  detail: '',
});
let ruleForm1 = ref();
let previsible = ref(false);
// 取消
let quit = () => {
  emits('update:activeIndex', '3');
};
// 确认
let comfirm = () => {
  ruleForm1.value.validate((valid: any) => {
    if (valid) {
      emits('update:activeIndex', '5');
      emits('data1', ruleForm.value);
    }
  });
};
onMounted(() => {
  let editor1 = new E(document.getElementById('div1'));
  if (editor1) {
    editor.value = editor1;
    editor.value.create();
    editor.value.config.onchange = function (newHtml: any) {
      ruleForm.value.detail = newHtml;
    };
  }
});
</script>

<style scoped>
</style>