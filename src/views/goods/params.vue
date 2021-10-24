<template>
  <el-card>
    <el-form :model="ruleForm">
      <el-form-item
        label="所属商品"
        :rules="[
          { required: true, message: '所属商品不能为空', triggle: 'blur' },
        ]"
      >
        <el-select
          v-model="ruleForm.parentId"
          placeholder="请选择所属商品"
          @change="changeGoods"
        >
          <el-option
            v-for="item in options"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          >
          </el-option>
        </el-select>
        <el-button
          style="margin-left: 20px"
          :disabled="ruleForm.parentId == ''"
          @click="add(1)"
          >添加参数</el-button
        >
      </el-form-item>
    </el-form>
    <div class="scrollY">
      <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 100%; margin-top: 20px">
        <el-table-column align="center" type="index" label="#" width="80">
        </el-table-column>
        <el-table-column align="center" prop="url" label="图片" width="200">
          <template #default="scoped">
            <img
              :src="scoped.row.url"
              alt=""
              style="width: 30px; height: 30px"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="参数名称"
          width="400"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="desc"
          label="参数描述"
          width="200"
        >
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)" type="primary"
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
  <!-- 弹出层 -->
  <el-dialog
    :title="num ? '添加商品参数' : '编辑商品参数'"
    v-model="visible"
    width="40%"
  >
    <el-form
      :model="ruleFormm"
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
          style="width: 100px; height: 100px"
          :preview-src-list="[imageUrl]"
        />
      </el-form-item>
      <el-form-item
        label="参数名称"
        prop="name"
        :rules="[{ required: true, message: '参数名称不能为空' }]"
      >
        <el-input
          v-model="ruleFormm.name"
          placeholder="请输入参数名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="参数描述"
        prop="desc"
        :rules="[{ required: true, message: '参数描述不能为空' }]"
      >
        <el-input
          v-model="ruleFormm.desc"
          placeholder="请输入参数描述"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import api from '../../http/api';
import { resTips } from '../../utils/index';

interface RuleForm {
  parentId: string;
}
interface RuleFormm {
  parentId: string;
  url: string;
  name: string;
  desc: string;
}

let num = ref(0);
let visible = ref(false);
let ruleForm = ref<RuleForm>({
  parentId: '',
});
let imageUrl = ref('');
let ruleForm1 = ref();
let current = ref(1);
let pageSize = ref(5);
let total = ref(0);
let tableData = ref<any>([]);
let id = ref('');
let ruleFormm = ref<RuleFormm>({
  parentId: '',
  url: '',
  name: '',
  desc: '',
});
let headers = ref({
  Authorization: localStorage.getItem('token')!,
});
// 上传
let upload = (val: any) => {
  if (val.code === 200) {
    imageUrl.value = val.data;
    ruleFormm.value.url = val.data;
  }
};
let options = ref<any>();
// 选择所属商品
let changeGoods = (val: string) => {
  ruleFormm.value.parentId = val;
  getData();
};
// 编辑
let handleEdit = (val: any) => {
  num.value = 0;
  visible.value = true;
  ruleFormm.value = { ...val };
  imageUrl.value = val.url;
  id.value = val._id;
};
// 删除
let handleDelete = (val: any) => {
  console.log(val);
  api
    .delParams({
      parentId: ruleFormm.value.parentId,
      attrId: val._id,
    })
    .then((res: any) => {
      resTips({ res: res, cb: getData, tip: true });
    })
    .catch(() => {
      console.log('删除商品参数失败');
    });
};
// 添加
let add = (n: number) => {
  num.value = 1;
  visible.value = true;
};
// 确认
let submit = () => {
  ruleForm1.value.validate((valid: boolean) => {
    if (valid) {
      visible.value = false;
      // 添加
      if (num.value) {
        api.addParams(ruleFormm.value).then((res: any) => {
          resTips({ res: res, cb: getData, tip: true });
        });
      } else {
        ElMessage.error('暂无此功能');
      }
    }
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
let getData = () => {
  api
    .getParams({ parentId: ruleFormm.value.parentId })
    .then((res: any) => {
      if (res.code === 200) {
        tableData.value = res.data;
        total.value = res.total;
      }
    })
    .catch(() => {
      console.log('获取商品参数请求失败');
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
  getGood();
});
</script>

<style scoped>
</style>