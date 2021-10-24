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
        <el-button type="primary" @click="add(1)">添加优惠券</el-button>
      </div>
      <div>
        <!-- 表格 -->
        <el-table
          :data="tableData"
          stripe
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column align="center" prop="name" label="优惠券名称">
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
          <el-table-column align="center" prop="amount" label="优惠金额">
          </el-table-column>
          <el-table-column align="center" prop="threshold" label="使用门槛">
          </el-table-column>
          <el-table-column align="center" prop="number" label="发放数量">
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
      :title="num ? '添加优惠券' : '编辑优惠券'"
      v-model="visible"
      width="40%"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm1"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="优惠券名称"
          prop="name"
          :rules="[
            { required: true, message: '优惠券名称不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入优惠券名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="使用门槛"
          prop="threshold"
          :rules="[
            { required: true, message: '使用门槛不能为空', trigger: 'blur' },
          ]"
          v-if="num"
        >
          <el-input
            v-model="ruleForm.threshold"
            type="number"
            placeholder="请输入使用门槛"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="优惠金额"
          prop="amount"
          :rules="[
            { required: true, message: '优惠金额不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleForm.amount"
            placeholder="请输入优惠金额"
            type="number"
          ></el-input>
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
          label="发放数量"
          prop="number"
          :rules="[
            { required: true, message: '发放数量不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleForm.number"
            placeholder="请输入发放数量"
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
  name: string;
  amount: string;
  threshold: string;
  start_time: string;
  end_time: string;
  number: string;
}

let query = ref('');
let current = ref(1);
let pageSize = ref(5);
let visible = ref(false);
let tableData = ref<TableData>();
let total = ref(0);
let headers = ref({
  Authorization: localStorage.getItem('token')!,
});
let id = ref('');
let ruleForm1 = ref();
let ruleForm = ref<RuleForm>({
  name: '',
  amount: '',
  threshold: '',
  start_time: '',
  end_time: '',
  number: '',
});
let num = ref(1);
// 点击添加
let add = (n: number) => {
  visible.value = true;
  num.value = n;
  ruleForm.value = {
    name: '',
    amount: '',
    threshold: '',
    start_time: '',
    end_time: '',
    number: '',
  };
};
// 切换显示
let change = (row: any) => {
  api
    .showCoupon({ id: row._id, isShow: row.isShow })
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
};
// 删除
let handleDelete = (val: TableData) => {
  api
    .delCoupon(val._id)
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
            .addCoupon({
              name: ruleForm.value.name,
              amount: ruleForm.value.amount,
              threshold: ruleForm.value.threshold,
              start_time: ruleForm.value.start_time,
              end_time: ruleForm.value.end_time,
              number: ruleForm.value.number,
              isShow: true,
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
            .updateCoupon({
              name: ruleForm.value.name,
              amount: ruleForm.value.amount,
              threshold: ruleForm.value.threshold,
              start_time: ruleForm.value.start_time,
              end_time: ruleForm.value.end_time,
              number: ruleForm.value.number,
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
              console.log('编辑优惠券请求失败');
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
    .getCoupon({
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
});
</script>

<style scoped>
</style>