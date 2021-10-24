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
        <el-button type="primary" @click="add(1)">添加用户</el-button>
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
            prop="url"
            label="用户头像"
            width="200"
          >
            <template #default="scoped">
              <img
                :src="scoped.row.avatar"
                alt=""
                style="width: 50px; height: 50px"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="username" label="用户名称">
          </el-table-column>
          <el-table-column align="center" prop="mobile" label="用户电话">
          </el-table-column>
          <el-table-column align="center" prop="email" label="用户邮箱">
          </el-table-column>
          <el-table-column align="center" prop="status" label="是否显示">
            <template #default="scoped">
              <el-switch
                v-model="scoped.row.status"
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
      :title="num ? '添加用户' : '编辑用户'"
      v-model="visible"
      width="40%"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm1"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="图片地址" prop="avator">
          <el-upload
            class="upload-demo"
            action="http://localhost:5000/admin/upload"
            list-type="picture"
            :headers="headers"
            :on-success="upload"
            :show-file-list="false"
          >
            <div class="color-blue">点击上传图片</div>
          </el-upload>
          <el-image
            v-if="imageUrl"
            :src="imageUrl"
            style="width: 100px; height: 100px"
            :preview-src-list="[imageUrl]"
          />
        </el-form-item>
        <el-form-item
          label="用户名称"
          prop="username"
          :rules="[
            { required: true, message: '用户名称不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleForm.username"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户密码"
          prop="password"
          :rules="[
            { required: true, message: '用户密码不能为空', trigger: 'blur' },
          ]"
          v-if="num"
        >
          <el-input
            v-model="ruleForm.password"
            show-password
            placeholder="请输入用户密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户电话" prop="mobile">
          <el-input
            v-model="ruleForm.mobile"
            placeholder="请输入用户电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="mobile">
          <el-input
            v-model="ruleForm.email"
            placeholder="请输入用户邮箱"
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
  username: string;
  avatar: string;
  email: string;
  mobile: string;
  status: boolean;
  password: string;
  _id: string;
}
interface RuleForm {
  username: string;
  avatar: string;
  email: string;
  mobile: string;
  password: string;
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
let ruleForm1 = ref<any>();
let ruleForm = ref<RuleForm>({
  username: '',
  avatar: '',
  email: '',
  mobile: '',
  password: '',
});
let num = ref(1);
// 点击添加
let add = (n: number) => {
  visible.value = true;
  num.value = n;
  ruleForm.value = {
    username: '',
    avatar: '',
    email: '',
    mobile: '',
    password: '',
  };
  imageUrl.value = '';
};
// 上传
let upload = (response: any, file: any, fileList: any) => {
  if (response.code === 200) {
    ruleForm.value.avatar = response.data;
    imageUrl.value = response.data;
  }
};
// 切换显示
let change = (row: any) => {
  api
    .showUser({ id: row._id, status: row.status })
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      console.log('切换用户失败');
    });
};
// 点击编辑
let handleEdit = (val: any) => {
  num.value = 0;
  visible.value = true;
  imageUrl.value = val.avatar;
  id.value = val._id;
  ruleForm.value = {
    username: val.username,
    avatar: imageUrl.value,
    email: val.email,
    mobile: val.mobile,
    password: '',
  };
};
// 删除
let handleDelete = (val: TableData) => {
  api
    .delUser(val._id)
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getData();
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      console.log('用户删除请求失败');
    });
};
// 弹框确认
let confirm = () => {
  ruleForm1.value.validate((valid: Boolean) => {
    if (valid) {
      visible.value = false;
      if (num.value) {
        api
          .addUser({
            username: ruleForm.value.username,
            avatar: ruleForm.value.avatar,
            email: ruleForm.value.email,
            mobile: ruleForm.value.mobile,
            status: true,
            password: ruleForm.value.password,
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
            console.log('用户请求失败');
          });
      } else {
        // 编辑
        api
          .updateUser({
            id: id.value,
            username: ruleForm.value.username,
            avatar: ruleForm.value.avatar,
            email: ruleForm.value.email,
            mobile: ruleForm.value.mobile,
            status: true,
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
            console.log('编辑用户请求失败');
          });
      }
    }
  });
};
let getData = () => {
  api
    .getUser({
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
      console.log('用户请求失败');
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