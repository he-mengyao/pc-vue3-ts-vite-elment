<template>
  <div>
    <el-card>
      <!-- 搜索 -->
      <div>
        <el-form :model="ruleform" label-width="100px" class="demo-ruleForm">
          <el-form-item
            label="商品模型"
            prop="parentId"
            :rules="[
              { required: true, message: '商品模型不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              v-model="ruleform.parentId"
              placeholder="请选择"
              @change="change($event, 1)"
              clearable
            >
              <el-option
                v-for="item in model"
                :key="item.value"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-button type="primary" @click="reset" style="margin-left: 20px"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <el-button type="info" plain :disabled="!ruleform.parentId" @click="add"
        >添加规格</el-button
      >
      <!-- 表格 -->
      <div class="scrollY">
        <!-- 表格 -->
        <el-table
          :data="tableData"
          stripe
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column align="center" type="index" label="#" width="80">
          </el-table-column>
          <el-table-column align="center" prop="name" label="规格名称">
          </el-table-column>
          <el-table-column align="center" prop="model" label="所属模型">
          </el-table-column>
          <el-table-column align="center" prop="mode" label="展现方式">
          </el-table-column>
          <el-table-column align="center" prop="spec_item" label="规格项">
          </el-table-column>
          <el-table-column align="center" label="操作" width="300px">
            <template #default="scope">
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
      </div>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog
      :title="num ? '添加规格' : '编辑规格'"
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
          label="规格名称"
          prop="name"
          :rules="[
            { required: true, message: '规格名称不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleFormm.name"
            placeholder="请输入规格名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属类型"
          prop="parentId"
          :rules="[
            { required: true, message: '所属类型不能为空', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="ruleform.parentId"
            placeholder="请选择"
            @change="change"
            style="width: 100%"
          >
            <el-option
              v-for="item in model"
              :key="item.value"
              :label="item.label"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="规格项"
          prop="spec_item"
          :rules="[
            {
              required: true,
              message: '规格项不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            type="textarea"
            placeholder="请输入规格项，一行一个"
            v-model="ruleFormm.spec_item"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="展示文字"
          prop="mode"
          :rules="[
            { required: true, message: '展示文字不能为空', trigger: 'blur' },
          ]"
        >
          <el-radio-group v-model="ruleFormm.mode">
            <el-radio label="文字">文字</el-radio>
            <el-radio label="图片">图片</el-radio>
            <el-radio label="颜色">颜色</el-radio>
          </el-radio-group>
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
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';
import api from '../../http/api';

interface Ruleform {
  parentId: string;
}
interface RuleFormm {
  name: string;
  model: string;
  spec_item: any;
  mode: string;
  parentId: string;
}
interface TableData {
  name: string;
  model: string;
  spec_item: any;
  mode: string;
  parentId: string;
  _id: string;
}

let query = ref('');
let current = ref(1);
let pageSize = ref(5);
let total = ref(0);
let num = ref(1);
let visible = ref(false);
let parentId = ref('');
let ruleform = ref<Ruleform>({
  parentId: '',
});
let tableData = ref<TableData[]>();
let ruleForm1 = ref();
let ruleFormm = ref<RuleFormm>({
  name: '',
  model: '',
  spec_item: '',
  mode: '',
  parentId: '',
});
let model = ref<any[]>([]);
let reset = () => {
  ruleform.value.parentId = '';
  tableData.value = [];
};

// 选择模型
let change = (val: any, n: number) => {
  parentId.value = val.value._id;
  ruleFormm.value.parentId = val.value._id;
  ruleFormm.value.model = val.label;
  // 表格页面选择模型
  if (n) getData();
};
// 删除
let handleDelete = (val: TableData) => {
  api
    .delSpec({
      parentId: val.parentId,
      attrId: val._id,
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
      console.log('删除规格请求失败');
    });
};
// 点击添加
let add = () => {
  visible.value = true;
  ruleFormm.value.name = '';
  ruleFormm.value.spec_item = '';
  ruleFormm.value.mode = '';
};
// 确认
let confirm = () => {
  ruleForm1.value.validate((valid: boolean) => {
    if (valid) {
      if (num) {
        let arr = ruleFormm.value.spec_item.split('\n').filter((i: any) => {
          return i !== '';
        });
        ruleFormm.value.spec_item = arr.join('\n');
        api
          .addSpec(ruleFormm.value)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success(res.msg);
              visible.value = false;
              getData();
            } else {
              ElMessage.error(res.msg);
            }
          })
          .catch(() => {
            console.log('添加规格请求失败');
          });
      }
    }
  });
};
// 获取表单数据
let getData = () => {
  api
    .getSpec({ parentId: parentId.value })
    .then((res: any) => {
      if (res.code === 200) {
        tableData.value = res.data;
        console.log(tableData.value);
      }
    })
    .catch(() => {
      console.log('获取规格请求失败');
    });
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
onMounted(() => {
  getModel();
  let model = JSON.parse(localStorage.getItem('model')!);
  ruleFormm.value.parentId = model._id;
  ruleFormm.value.model = model.name;
  tableData.value = model.specifications;
  parentId.value = model._id;
  ruleform.value.parentId = model.name;
});
</script>

<style scoped>
</style>