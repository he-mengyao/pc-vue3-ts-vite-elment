<template>
  <div class="h-100">
    <el-container>
      <el-aside width="auto">
        <navleft :collapse="collapse"></navleft>
      </el-aside>
      <el-container>
        <el-header>
          <navhead v-model:collapse="collapse"></navhead>
        </el-header>
        <el-main style="background: #f5f5f5">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import navhead from '../../components/navhead/navhead.vue';
import navleft from '../../components/navleft/navleft.vue';

let collapse = ref(false);
</script>

<style scoped>
</style>