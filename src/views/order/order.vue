<template>
  <div>
    <el-card>
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="user_id" label="用户id " align="center">
        </el-table-column>
        <el-table-column prop="pay_time" label="订单日期" align="center">
          <template #default="scoped">
            <div>
              {{
                dayjs(Number(scoped.row.pay_time)).format('YYYY-MM-DD HH:mm:ss')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="订单数量"
          align="center"
          width="50"
        >
        </el-table-column>
        <el-table-column prop="price" label="订单价格" align="center">
        </el-table-column>
        <el-table-column prop="goods_list" label="商品名称" align="center">
          <template #default="scoped">
            <div
              v-for="(item, index) in scoped.row.goods_list"
              :key="index"
              class="flex col ai-c"
            >
              {{ item.goods.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="订单地址" align="center">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../../http/api';
import dayjs from 'dayjs';
let list = ref<any>([]);

onMounted(() => {
  api
    .getOrder()
    .then((res: any) => {
      if (res.code === 200) {
        list.value = res.data;
        // console.log(list.value);
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
});
</script>

<style scoped>
</style>