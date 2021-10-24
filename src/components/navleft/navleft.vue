<template>
  <el-menu
    :uniqueOpened="true"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    :default-active="route.path"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="collapse"
  >
    <template v-for="(item, index) in nav" :key="index">
      <el-sub-menu index="1" v-if="item.children">
        <template #title>
          <component :is="`el-icon${toLine(item.icon)}`"></component>
          <span>{{ $t(item.t) }}</span>
        </template>
        <el-menu-item
          :index="item1.index"
          v-for="(item1, index1) in item.children"
          :key="index1"
        >
          <component :is="`el-icon${toLine(item1.icon)}`"></component>
          <template #title>
            {{ $t(item1.t) }}
          </template>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item :index="item.index" v-else>
        <component :is="`el-icon${toLine(item.icon)}`"></component>
        <template #title>
          {{ $t(item.t) }}
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { toLine } from '../../utils/index';
import i18n from '../../language/index';

let props = defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

let route = useRoute();
let nav = ref<any>([
  {
    name: '首页',
    icon: 'HomeFilled',
    index: '/',
    t: 'home',
  },
  {
    name: '轮播图管理',
    icon: 'PictureFilled',
    index: '/carousel',
    t: 'Carousel_management',
  },
  {
    name: '导航管理',
    icon: 'Operation',
    index: '/navs',
    t: 'Navigation_management',
  },
  {
    name: '推荐导航',
    icon: 'Tickets',
    index: '/recom',
    t: 'Recommended_navigation',
  },
  {
    name: '用户管理',
    icon: 'UserFilled',
    index: '/user',
    t: 'User_Management',
  },
  {
    name: '商品管理',
    icon: 'Grid',
    index: '/goods',
    t: 'Goods_Management',
    children: [
      {
        name: '添加商品',
        icon: 'DocumentAdd',
        index: '/addGoods',
        t: 'Adding_goods',
      },
      {
        name: '商品分类',
        icon: 'List',
        index: '/categ',
        t: 'Categories',
      },
      {
        name: '商品模型',
        icon: 'Operation',
        index: '/model',
        t: 'Commodity_model',
      },
      {
        name: '商品规格',
        icon: 'Document',
        index: '/goodsSpec',
        t: 'Product_specifications',
      },
      {
        name: '商品参数',
        icon: 'Menu',
        index: '/params',
        t: 'Product_parameters',
      },
      {
        name: '规格参数',
        icon: 'Grid',
        index: '/specParams',
        t: 'Specifications',
      },
    ],
  },
  {
    name: '秒杀管理',
    icon: 'Stopwatch',
    index: '/splike',
    t: 'Spike_management',
  },
  {
    name: '优惠券管理',
    icon: 'Calendar',
    index: '/coupon',
    t: 'Coupon_management',
  },
  {
    name: '订单管理',
    icon: 'Operation',
    index: '/order',
    t: 'Order_management',
  },
  {
    name: '通知管理',
    icon: 'Bell',
    index: '/notice',
    t: 'Notification_management',
  },
  {
    name: '客服消息',
    icon: 'ChatDotRound',
    index: '/chat',
    t: 'Customer_Service_Management',
  },
]);
</script>

<style scoped lang='scss'>
svg {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}
.el-menu {
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-sub-menu .el-menu-item {
  min-width: 199px;
}
</style>