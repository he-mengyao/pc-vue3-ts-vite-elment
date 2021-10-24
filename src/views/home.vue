<template>
  <div class="color-333">
    <el-card>
      <!-- 顶部 -->
      <div class="flex flex-b color-fff f18">
        <div class="flex-1 ipt ipt1 mrr-20">
          <div>{{ orderCount }}</div>
          <div>订单总数</div>
        </div>
        <div class="flex-1 ipt ipt2 mrr-20">
          <div>{{ goodsCount }}</div>
          <div>商品总数</div>
        </div>
        <div class="flex-1 ipt ipt3">
          <div>{{ userCount }}</div>
          <div>用户总数</div>
        </div>
      </div>
      <!-- 今日订单 -->
      <div class="flex flex-b mrt-20">
        <!-- 今日订单 -->
        <div class="l" id="l"></div>
        <!-- 今日销售额 -->
        <div class="l" id="r"></div>
      </div>
      <!-- 饼图 -->
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../http/api';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

let orderCount = ref(0);
let goodsCount = ref(0);
let userCount = ref(0);
let xAxis1 = ref([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
]);

let get1 = () => {
  let arr = new Array(24).fill(0);
  let arr1 = new Array(24).fill(0);
  api
    .getOrder()
    .then((res: any) => {
      if (res.code === 200) {
        let chartDom: any = document.getElementById('l');
        let chartDom1: any = document.getElementById('r');
        res.data.map((i: any) => {
          let start = dayjs(dayjs().format('YYYY-MM-DD') + '0:00:00').valueOf();
          let end = dayjs(dayjs().format('YYYY-MM-DD') + '23:59:59').valueOf();
          if (i.pay_time >= start && i.pay_time <= end) {
            let n = dayjs(Number(i.pay_time)).hour();
            arr[n] += 1;
            arr1[n] += Number(i.price);
          }
          init1(arr, chartDom, '今日订单', ['订单量合计']);
          init1(arr1, chartDom1, '今日销售额', ['销售额合计']);
        });
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
let init1 = (arr: any, chartDom: any, title: string, legend: any) => {
  let myChart = echarts.init(chartDom);
  let option;

  option = {
    tooltip: {
      trigger: 'axis',
    },
    title: {
      text: title,
    },
    legend: {
      data: legend,
    },
    xAxis: {
      type: 'category',
      data: xAxis1.value,
    },
    yAxis: {
      type: 'value',
    },
    color: title === '今日订单' ? ['#79bbd9'] : ['#f9df80'],
    series: [
      {
        name: legend[0],
        data: arr,
        type: 'line',
      },
    ],
  };

  option && myChart.setOption(option);
};
// 饼图
let get2 = () => {
  api
    .getCategory('')
    .then((res: any) => {
      if (res.code === 200) {
        let arr: any = [];
        res.data.map((i: any) => {
          arr.push({
            value: i.list.length,
            name: i.name,
          });
        });
        init2(arr);
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
let init2 = (arr: any) => {
  var chartDom: any = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    title: {
      text: '商品分类',
      left: 'left',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '12%',
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '50%',
        data: arr,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  option && myChart.setOption(option);
};
onMounted(() => {
  api
    .getIndex()
    .then((res: any) => {
      if (res.code === 200) {
        // console.log(res.data);
        orderCount.value = res.data.orderCount;
        goodsCount.value = res.data.goodsCount;
        userCount.value = res.data.userCount;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
  // 第一个表格
  get1();
  // 饼图
  get2();
});
</script>

<style scoped>
.ipt {
  height: 100px;
  padding: 20px;
}
.ipt1 {
  background-color: #d54f49;
}
.ipt2 {
  background-color: #5db666;
}
.ipt3 {
  background-color: #222d3b;
}
.l {
  width: 48%;
  height: 400px;
}
#main {
  height: 600px;
  width: 100%;
}
</style>