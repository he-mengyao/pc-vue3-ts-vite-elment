<template>
  <div>
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
      <el-button type="primary" @click="add">添加模型</el-button>
    </div>
    <!-- 表格 -->
    <div class="scrollY">
      <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 100%; margin-top: 20px">
        <el-table-column align="center" type="index" label="#" width="80">
        </el-table-column>
        <el-table-column align="center" prop="name" label="模型名称">
        </el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)" type="primary"
              >编辑</el-button
            >
            <el-button size="mini" @click="addspec(scope.row)" type="primary"
              >添加规格</el-button
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
    <!-- 弹出框 -->
    <el-dialog
      :title="num ? '添加模型' : '编辑模型'"
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
          label="模型名称"
          prop="name"
          :rules="[
            { required: true, message: '模型名称不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入模型名称"
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
import { onMounted, ref } from 'vue';
import api from '../../http/api';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

interface RuleForm {
  name: string;
}
interface TableData {
  attribute: [];
  name: string;
  specifications: [];
  _id: string;
}
let router = useRouter();
let query = ref('');
let current = ref(1);
let pageSize = ref(5);
let total = ref(0);
let num = ref(1);
let id = ref('');
let visible = ref(false);
let ruleForm1 = ref();
let ruleForm = ref<RuleForm>({
  name: '',
});
let tableData = ref<TableData>();
let input = () => {
  getData();
};
// 编辑
let handleEdit = (val: TableData) => {
  visible.value = true;
  id.value = val._id;
  num.value = 0;
  ruleForm.value = {
    name: val.name,
  };
};
// 删除
let handleDelete = (val: TableData) => {
  api
    .delModel(val._id)
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getData();
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      console.log('删除商品模型请求失败');
    });
};
// 添加规格
let addspec = (val: TableData) => {
  router.push('/goodsSpec');
  localStorage.setItem('model', JSON.stringify(val));
};
// 添加
let add = () => {
  visible.value = true;
};
let confirm = () => {
  ruleForm1.value.validate((valid: boolean) => {
    if (valid) {
      if (num.value) {
        // 添加
        api.addModel(ruleForm.value).then((res: any) => {
          if (res.code === 200) {
            ElMessage.success(res.msg);
            visible.value = false;
            getData();
          } else {
            ElMessage.error(res.msg);
          }
        });
      } else {
        // 编辑
        api
          .updateModel({
            id: id.value,
            name: ruleForm.value.name,
          })
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success(res.msg);
              getData();
              visible.value = false;
            } else {
              ElMessage.error(res.msg);
            }
          })
          .catch(() => {
            console.log('商品模型编辑失败');
          });
      }
    }
  });
};
let getData = () => {
  api
    .getModel({
      current: current.value,
      pageSize: pageSize.value,
      query: query.value,
    })
    .then((res: any) => {
      if (res.code === 200) {
        tableData.value = res.data;
        total.value = res.total;
      }
    })
    .catch(() => {
      console.log('商品模型请求失败');
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
onMounted(() => {
  getData();
});
</script>

<style scoped>
</style>