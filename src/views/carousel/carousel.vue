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
        <el-button type="primary" @click="add(1)">添加轮播图</el-button>
      </div>
      <div class="">
        <!-- 表格 -->
        <el-table
          :data="tableData"
          stripe
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column align="center" type="index" label="#">
          </el-table-column>
          <el-table-column align="center" prop="url" label="图片" width="180">
            <template #default="scoped">
              <img :src="scoped.row.url" alt="" class="img-200" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="url" label="路径" width="180">
          </el-table-column>
          <el-table-column align="center" prop="title" label="标题">
          </el-table-column>
          <el-table-column align="center" prop="link" label="链接">
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
      :title="num ? '添加轮播图' : '编辑轮播图'"
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
          label="图片地址"
          prop="url"
          :rules="[{ required: true, message: '图片不能为空' }]"
        >
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
            style="width: 250px; height: 100px"
            :preview-src-list="[imageUrl]"
          />
        </el-form-item>
        <el-form-item label="图片标题" prop="title">
          <el-input
            v-model="ruleForm.title"
            placeholder="请输入图片标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片链接" prop="name">
          <el-input
            v-model="ruleForm.link"
            placeholder="请输入图片链接"
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

interface RuleForm {
  url: string;
  title: string;
  link: string;
}
interface TableData {
  isShow: boolean;
  link: string;
  title: string;
  url: string;
  _id: string;
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
  url: '',
  title: '',
  link: '',
});
let num = ref(1);
// 点击添加轮播图
let add = (n: number) => {
  visible.value = true;
  num.value = n;
  ruleForm.value = {
    url: '',
    title: '',
    link: '',
  };
  imageUrl.value = '';
};
// 上传
let upload = (response: any, file: any, fileList: any) => {
  if (response.code === 200) {
    ruleForm.value.url = response.data;
    imageUrl.value = response.data;
  }
};
// 切换显示
let change = (row: any) => {
  api
    .showBanner({ id: row._id, isShow: row.isShow })
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      console.log('切换轮播图失败');
    });
};
// 点击编辑
let handleEdit = (val: TableData) => {
  num.value = 0;
  visible.value = true;
  imageUrl.value = val.url;
  id.value = val._id;
  ruleForm.value = { ...val };
};
// 删除
let handleDelete = (val: TableData) => {
  api
    .delBanner(val._id)
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getData();
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      console.log('轮播图删除请求失败');
    });
};
// 弹框确认
let confirm = () => {
  ruleForm1.value.validate((valid: Boolean) => {
    if (valid) {
      visible.value = false;
      if (num.value) {
        api
          .addBanner(ruleForm.value)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success(res.msg);
              getData();
            } else {
              ElMessage.error(res.msg);
            }
          })
          .catch(() => {
            console.log('添加轮播图请求失败');
          });
      } else {
        // 编辑
        api
          .updateBanner({
            id: id.value,
            url: ruleForm.value.url,
            title: ruleForm.value.title,
            link: ruleForm.value.link,
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
            console.log('编辑轮播图请求失败');
          });
      }
    }
  });
};
let getData = () => {
  api
    .getBanner({
      query: query.value,
      pageSize: pageSize.value,
      current: current.value,
    })
    .then((res: any) => {
      if (res.code === 200) {
        total.value = res.total;
        tableData.value = res.data;
      }
    })
    .catch((err: any) => {
      console.log('轮播图请求失败');
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