<template>
  <div class="pf-center">
    <div class="f26 fw">小米Lite</div>
    <div class="color-666 f14 mrtb-20">欢迎来到小米Lite后台管理系统</div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm1"
      label-width="0"
      class="form"
    >
      <el-form-item prop="username" class="center">
        <el-input placeholder="请输入账户名" v-model="ruleForm.username">
          <template #prefix>
            <el-icon-user></el-icon-user>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          placeholder="请输入密码"
          v-model="ruleForm.password"
          show-password
        >
          <template #prefix>
            <el-icon-unlock></el-icon-unlock>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" class="w-100"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../../http/api';
import { useRouter } from 'vue-router';

interface RuleForm {
  username: string;
  password: string;
}
let router = useRouter();
let ruleForm1 = ref();
let ruleForm = ref<RuleForm>({
  username: '',
  password: '',
});
let rules = ref<any>({
  username: [{ required: true, message: '请输入账户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});
let submitForm = () => {
  ruleForm1.value.validate((valid: boolean) => {
    if (valid) {
      api
        .login(ruleForm.value)
        .then((res: any) => {
          if (res.code === 200) {
            ElMessage.success(res.msg);
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('token', res.token);
            router.push('/');
          } else {
            ElMessage.error(res.msg);
          }
        })
        .catch((err: any) => {
          console.log('登录请求失败');
        });
    } else {
      ElMessage.error('表单填写有误，请检查');
      return false;
    }
  });
};
</script>

<style scoped lang='scss'>
svg {
  width: 20px;
  height: 20px;
}
.form {
  width: 400px;
}
</style>