<template>
  <div class="flex flex-b ai-c mrtb-20 pdrl-10">
    <div @click="toggle">
      <el-icon-fold v-if="!props.collapse"></el-icon-fold>
      <el-icon-expand v-else></el-icon-expand>
    </div>
    <div class="center">
      <iframe
        width="235"
        height="18"
        frameborder="0"
        scrolling="no"
        hspace="0"
        src="https://i.tianqi.com/?c=code&id=10"
      ></iframe>
      <img src="../../static/avator.png" alt="" class="img-30 mrrl-10" />
      <el-popconfirm title="是否要退出登录？" @confirm="quit">
        <template #reference>
          <div>{{ user }}</div>
        </template>
      </el-popconfirm>
      <!-- 切换语言 -->
      <el-dropdown>
        <img src="../../static/a.png" alt="" class="img-30 mrl-20" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="setLangCondition('zh-CN')"
              >中文</el-dropdown-item
            >
            <el-dropdown-item @click="setLangCondition('en-US')"
              >英文</el-dropdown-item
            >
            <el-dropdown-item @click="setLangCondition('zh-TW')"
              >中文繁体</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

let props = defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});
const { locale } = useI18n();
let router = useRouter();
let emits = defineEmits(['update:collapse']);
let toggle = () => {
  emits('update:collapse', !props.collapse);
};
let quit = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  ElMessage.success('退出成功');
  router.push('/login');
};
let user = ref(JSON.parse(localStorage.getItem('user')!).username);
// 切换语言
const setLangCondition = (val: any) => {
  locale.value = val;
  localStorage.setItem('language', locale.value);
};
</script>

<style scoped>
svg {
  width: 20px;
  height: 20px;
}
</style>