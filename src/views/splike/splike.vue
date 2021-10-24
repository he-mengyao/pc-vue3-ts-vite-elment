<template>
  <div>
    <el-card class="box-card">
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
        <el-button type="primary" @click="add(1)">添加秒杀</el-button>
      </div>
      <div>
        <!-- 表格 -->
        <el-table
          :data="tableData"
          stripe
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column
            align="center"
            prop="goods"
            label="秒杀商品"
            width="200"
          >
            <template #default="scoped">
              {{ scoped.row.goods.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="start_time"
            label="开始时间"
            width="180"
          >
            <template #default="scoped">
              {{ dayjs(scoped.row.start_time).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="end_time"
            label="结束时间"
            width="180"
          >
            <template #default="scoped">
              {{ dayjs(scoped.row.end_time).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="秒杀价格">
          </el-table-column>
          <el-table-column align="center" prop="goods_number" label="秒杀数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="isShow"
            label="是否禁用"
            width="80"
          >
            <template #default="scoped">
              <el-switch
                v-model="scoped.row.isShow"
                @change="change(scoped.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)"
                type="primary"
                >编辑</el-button
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
    <!-- 弹出框 -->
    <el-dialog
      :title="num ? '添加秒杀' : '编辑秒杀'"
      v-model="visible"
      width="40%"
    >
      <div v-if="goods" style="margin-left: 30px">
        商品原价:{{ goods.originalPrice }}
      </div>
      <el-form
        :model="ruleForm"
        ref="ruleForm1"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="秒杀商品"
          prop="goods"
          :rules="[
            { required: true, message: '秒杀商品不能为空', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="ruleForm.goods"
            placeholder="请选择秒杀商品"
            style="width: 100%"
            @change="change1"
          >
            <el-option
              v-for="item in options"
              :key="item._id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="开始时间"
          prop="start_time"
          :rules="[
            { required: true, message: '开始时间不能为空', trigger: 'blur' },
          ]"
        >
          <el-date-picker
            v-model="ruleForm.start_time"
            type="datetime"
            placeholder="选择开始日期时间"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束时间"
          prop="end_time"
          :rules="[
            { required: true, message: '结束时间不能为空', trigger: 'blur' },
          ]"
        >
          <el-date-picker
            v-model="ruleForm.end_time"
            type="datetime"
            placeholder="选择结束日期时间"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="秒杀价格"
          prop="price"
          :rules="[
            { required: true, message: '秒杀价格不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleForm.price"
            placeholder="请输入秒杀价格"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="秒杀数量"
          prop="goods_number"
          :rules="[
            { required: true, message: '秒杀数量不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleForm.goods_number"
            placeholder="请输入秒杀数量"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../http/api';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';

interface TableData {
  name: string;
  amount: string;
  threshold: string;
  start_time: string;
  end_time: string;
  number: number;
  isShow: boolean;
  _id: string;
}
interface RuleForm {
  start_time: string;
  end_time: string;
  goods_number: string;
  goods: any;
  isShow: boolean;
  price: string;
}

let query = ref('');
let current = ref(1);
let pageSize = ref(5);
let visible = ref(false);
let tableData = ref<TableData>();
let options = ref<any>([]);
let goods = ref<any>();
let total = ref(0);
let headers = ref({
  Authorization: localStorage.getItem('token')!,
});
let id = ref('');
let ruleForm1 = ref();
let ruleForm = ref<RuleForm>({
  start_time: '',
  end_time: '',
  goods_number: '',
  goods: undefined,
  isShow: true,
  price: '',
});
let num = ref(1);
// 点击添加
let add = (n: number) => {
  visible.value = true;
  num.value = n;
  ruleForm.value = {
    start_time: '',
    end_time: '',
    goods_number: '',
    goods: undefined,
    isShow: true,
    price: '',
  };
};
// 选择商品
let change1 = (val: any) => {
  goods.value = options.value.find((i: any) => {
    return i.name === val;
  });
};
// 切换显示
let change = (row: any) => {
  api
    .showSeckill({ id: row._id, isShow: row.isShow })
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      console.log('切换优惠券失败');
    });
};
// 点击编辑
let handleEdit = (val: any) => {
  num.value = 0;
  visible.value = true;
  id.value = val._id;
  ruleForm.value = { ...val };
  goods.value = val.goods;
  ruleForm.value.goods = val.goods.name;
};
// 删除
let handleDelete = (val: any) => {
  api
    .delSeckill({
      id: val._id,
      goodsId: val.goods._id,
    })
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getData();
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      console.log('优惠券删除请求失败');
    });
};
// 弹框确认
let confirm = () => {
  ruleForm1.value.validate((valid: Boolean) => {
    if (valid) {
      if (
        dayjs(ruleForm.value.end_time).valueOf() >
        dayjs(ruleForm.value.start_time).valueOf()
      ) {
        visible.value = false;
        if (num.value) {
          api
            .addSeckill({
              start_time: ruleForm.value.start_time,
              end_time: ruleForm.value.end_time,
              goods_number: ruleForm.value.goods_number,
              goods: goods.value,
              isShow: true,
              price: ruleForm.value.price,
            })
            .then((res: any) => {
              if (res.code === 200) {
                ElMessage.success(res.msg);
                getData();
              } else {
                ElMessage.error(res.msg);
              }
            })
            .catch(() => {
              console.log('添加优惠券请求失败');
            });
        } else {
          // 编辑
          api
            .updateSeckill({
              start_time: ruleForm.value.start_time,
              end_time: ruleForm.value.end_time,
              goods_number: ruleForm.value.goods_number,
              goods: goods.value,
              isShow: true,
              id: id.value,
            })
            .then((res: any) => {
              if (res.code === 200) {
                ElMessage.success(res.msg);
                getData();
              } else {
                ElMessage.error(res.msg);
              }
            })
            .catch(() => {
              console.log('添加优惠券请求失败');
            });
        }
      } else {
        ElMessage.error('结束时间需大于开始时间');
      }
    }
  });
};
let getData = () => {
  api
    .getSeckill({
      query: query.value,
      pageSize: pageSize.value,
      current: current.value,
    })
    .then((res: any) => {
      if (res.code === 200) {
        // console.log(res.data);
        total.value = res.total;
        tableData.value = res.data;
      }
    })
    .catch((err: any) => {
      console.log('优惠券请求失败');
    });
};
// 获取商品
let getGood = () => {
  api
    .getGoods({
      query: '',
      current: 1,
      pageSize: 99,
    })
    .then((res: any) => {
      if (res.code === 200) {
        options.value = res.data;
      }
    })
    .catch(() => {
      console.log('获取商品数据请求失败');
    });
};
// 每页条数改变
let handleSizeChange = (val: number) => {
  pageSize.value = val;
  getData();
};
// 页数改变
let handleCurrentChange = (val: number) => {
  current.value = val;
  getData();
};
// 搜索
let input = () => {
  getData();
};
onMounted(() => {
  getData();
  getGood();
});
</script>

<style scoped>
</style>