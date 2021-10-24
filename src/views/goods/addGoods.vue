<template>
  <div>
    <el-card v-if="!visible">
      <!-- 搜索 -->
      <div>
        <el-input
          placeholder="请输入"
          suffix-icon="el-icon-search"
          v-model="query"
          style="width: 300px; margin-right: 20px"
          @input="input"
        >
        </el-input>
        <el-button type="primary" @click="(visible = true), (activeIndex = '1')"
          >添加商品</el-button
        >
      </div>
      <div class="scrollY">
        <!-- 表格 -->
        <el-table
          :data="tableData"
          stripe
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column align="center" type="index" label="#">
          </el-table-column>
          <el-table-column align="center" prop="name" label="商品名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="originalPrice"
            label="商品原价"
            width="80"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="presentPrice"
            label="商品现价"
            width="80"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="isNewGood"
            label="是否新品"
            width="80"
          >
            <template #default="scoped">
              {{ scoped.row.isNewGood ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="isHot"
            label="是否热卖"
            width="80"
          >
            <template #default="scoped">
              {{ scoped.row.isHot ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="isRecommend"
            label="是否推荐"
            width="80"
          >
            <template #default="scoped">
              {{ scoped.row.isRecommend ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isShow" label="上下架">
            <template #default="scoped">
              <el-switch
                v-model="scoped.row.isShow"
                @change="change(scoped.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="250">
            <template #default="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)"
                type="primary"
                >编辑</el-button
              >
              <el-button size="mini" @click="look(scope.row)" plain
                >详情</el-button
              >
              <el-button
                size="mini"
                @click="handleDelete(scope.row)"
                plain
                type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="flex flex-r mrtb-20">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
    <!-- 添加商品显示 -->
    <div v-if="visible" class="mrtb-20">
      <el-card class="box-card">
        <template #header>
          <div class="card-header flex flex-b">
            <span class="f16">添加商品</span>
            <span class="f24 color-a0a0">×</span>
          </div>
        </template>
        <el-tabs v-model="activeIndex">
          <el-tab-pane label="基础设置" name="1">
            <goods1
              v-model:activeIndex="activeIndex"
              v-model:visible="visible"
              @data1="data1"
              :categList="categList"
            ></goods1>
          </el-tab-pane>
          <el-tab-pane
            label="媒体信息"
            name="2"
            :disabled="Number(activeIndex) < 2"
          >
            <goods2 v-model:activeIndex="activeIndex" @data1="data1"></goods2
          ></el-tab-pane>
          <el-tab-pane
            label="商品规格"
            name="3"
            :disabled="Number(activeIndex) < 3"
          >
            <goods3
              v-model:activeIndex="activeIndex"
              :modelList="model"
              v-if="model.length > 0"
              @data1="data1"
            ></goods3>
          </el-tab-pane>
          <el-tab-pane
            label="商品详情"
            name="4"
            :disabled="Number(activeIndex) < 4"
          >
            <goods4 v-model:activeIndex="activeIndex" @data1="data1"></goods4>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 弹出框 -->
    <el-dialog title="商品详情" v-model="visible1" width="40%">
      <div>商品名称：{{ ruleForm.name }}</div>
      <div>商品原价：{{ ruleForm.originalPrice }}</div>
      <div>商品现价：{{ ruleForm.presentPrice }}</div>
      <div>商品单位：{{ ruleForm.company }}</div>
      <div>商品库存：{{ ruleForm.stock }}</div>
      <div>
        封面图：
        <el-image :src="ruleForm.cover" class="img-100"></el-image>
      </div>
      <div>
        详情图：
        <el-image
          :src="item"
          v-for="(item, index) in ruleForm.pic"
          :key="index"
          class="img-100"
        ></el-image>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="visible1 = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../../http/api';
import goods1 from '../../components/addGoods/goods1.vue';
import goods2 from '../../components/addGoods/goods2.vue';
import goods3 from '../../components/addGoods/goods3.vue';
import goods4 from '../../components/addGoods/goods4.vue';
import { ElMessage } from 'element-plus';
import { resTips } from '../../utils/index';

interface RuleForm {
  discount: string;
  detail: string;
  spec: any;
  comment: string;
  isShow: boolean;
  productionDesc: string;
}

let categList = ref<any>();
let query = ref('');
let current = ref(1);
let pageSize = ref(5);
let visible = ref(false);
// 弹框显示
let visible1 = ref(false);
let activeIndex = ref('1');
let ruleForm = ref<any>({});
let model = ref<any[]>([]);
let obj = ref<any>({});
let total = ref(0);
let tableData = ref<any[]>([]);
// 添加商品确认
let data1 = (val: any) => {
  obj.value = { ...obj.value, ...val };
  if (activeIndex.value === '5') {
    visible.value = false;
    // console.log(obj.value);
    api
      .addGoods(obj.value)
      .then((res: any) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
          getTable();
        } else {
          ElMessage.error(res.msg);
        }
      })
      .catch(() => {
        console.log('添加商品请求失败');
      });
  }
};
// 编辑
let handleEdit = (val: any) => {
  ElMessage.error('暂无此功能');
  // console.log(val);
};
// 删除
let handleDelete = (val: any) => {
  api
    .delGoods(val._id)
    .then((res: any) => {
      resTips({ res: res, cb: getTable, tip: true });
    })
    .catch(() => {
      console.log('删除商品请求失败');
    });
};
// 查看
let look = (val: any) => {
  // console.log(val);
  visible1.value = true;
  ruleForm.value = { ...val };
};
// 上下架
let change = (val: any) => {
  ElMessage.error('暂无此功能');
};
// 每页条数改变
let handleSizeChange = (val: number) => {
  pageSize.value = val;
  getTable();
};
// 页数改变
let handleCurrentChange = (val: number) => {
  current.value = val;
  getTable();
};
// 搜索
let input = () => {
  getTable();
};
// 获取模型数据
let getModel = () => {
  api
    .getModel({
      current: 1,
      pageSize: 99,
      query: '',
    })
    .then((res: any) => {
      if (res.code === 200) {
        let arr: any = [];
        res.data.map((i: any) => {
          arr.push({
            value: i,
            label: i.name,
          });
        });
        model.value = arr;
      }
    })
    .catch(() => {
      console.log('商品模型请求失败');
    });
};
// 获取分类
let getData = () => {
  api
    .getCategory(query.value)
    .then((res: any) => {
      if (res.code === 200) {
        if (res.data) {
          let arr: any = [];
          res.data.map((i: any) => {
            let arr1: any = [];
            i.list.map((s: any) => {
              arr1.push({
                value: s,
                label: s.name,
              });
            });
            arr.push({
              value: i,
              label: i.name,
              children: arr1.length > 0 ? arr1 : null,
            });
          });
          categList.value = arr;
        }
      }
    })
    .catch(() => {
      console.log('分类请求失败');
    });
};
// 获取表格数据
let getTable = () => {
  api
    .getGoods({
      query: query.value,
      current: current.value,
      pageSize: pageSize.value,
    })
    .then((res: any) => {
      if (res.code === 200) {
        total.value = res.total;
        tableData.value = res.data;
      }
    })
    .catch(() => {
      console.log('获取商品数据请求失败');
    });
};
onMounted(() => {
  getData();
  getModel();
  getTable();
});
</script>

<style scoped>
</style>