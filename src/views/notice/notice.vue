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
        <el-button type="primary" @click="add(1)">添加通知</el-button>
      </div>
      <div>
        <!-- 表格 -->
        <el-table
          :data="tableData"
          stripe
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column align="center" type="index" label="#">
          </el-table-column>
          <el-table-column align="center" prop="content" label="通知内容">
          </el-table-column>
          <el-table-column align="center" prop="isShow" label="是否显示">
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
      :title="num ? '添加通知' : '编辑通知'"
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
          label="通知内容"
          prop="content"
          :rules="[
            { required: true, message: '通知内容不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleForm.content"
            placeholder="请输入通知内容"
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

interface TableData {
  content: string;
  _id: string;
  isShow: boolean;
}
interface RuleForm {
  content: string;
}

let query = ref('');
let current = ref(1);
let pageSize = ref(5);
let visible = ref(false);
let tableData = ref<TableData>();
let imageUrl = ref('');
let total = ref(0);
let headers = ref({
  Authorization: localStorage.getItem('token')!,
});
let id = ref('');
let ruleForm1 = ref();
let ruleForm = ref<RuleForm>({
  content: '',
});
let num = ref(1);
// 点击添加
let add = (n: number) => {
  visible.value = true;
  num.value = n;
  ruleForm.value = {
    content: '',
  };
  imageUrl.value = '';
};
// 切换显示
let change = (row: any) => {
  api
    .showNotice({ id: row._id, isShow: row.isShow })
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      console.log('切换通知失败');
    });
};
// 点击编辑
let handleEdit = (val: any) => {
  num.value = 0;
  visible.value = true;
  imageUrl.value = val.avatar;
  id.value = val._id;
  ruleForm.value = { ...val };
};
// 删除
let handleDelete = (val: TableData) => {
  api
    .delNotice({ id: val._id })
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getData();
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      console.log('通知删除请求失败');
    });
};
// 弹框确认
let confirm = () => {
  ruleForm1.value.validate((valid: Boolean) => {
    if (valid) {
      visible.value = false;
      if (num.value) {
        api
          .addNotice({
            content: ruleForm.value.content,
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
            console.log('通知请求失败');
          });
      } else {
        // 编辑
        api
          .updateNotice({
            id: id.value,
            content: ruleForm.value.content,
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
            console.log('编辑通知请求失败');
          });
      }
    }
  });
};
let getData = () => {
  api
    .getNotice({
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
      console.log('通知请求失败');
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