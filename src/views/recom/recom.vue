<template>
  <div>
    <el-card>
      <!-- 搜索 -->
      <div>
        <el-input
          suffix-icon="el-icon-search"
          style="width: 300px"
          v-model="query"
          @input="input"
        ></el-input>
        <el-button type="primary" style="margin-left: 20px" @click="add"
          >添加推荐导航</el-button
        >
      </div>
      <div>
        <!-- 表格 -->
        <el-table
          :data="tableData"
          stripe
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column align="center" prop="name" label="导航名称">
          </el-table-column>
          <el-table-column align="center" prop="desc" label="导航描述">
          </el-table-column>
          <el-table-column align="center" prop="isShow" label="是否禁用">
            <template #default="scoped">
              <el-switch
                v-model="scoped.row.isShow"
                @change="change(scoped.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template #default="scope">
              <el-button size="mini" @click="look(scope.row)"
                >查看商品</el-button
              >
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
    <!-- 弹框 -->
    <el-dialog
      :title="num ? '添加推荐导航' : '编辑推荐导航'"
      v-model="visible"
      width="40%"
    >
      <el-form :rules="rules" :model="ruleForm" ref="ruleForm1">
        <el-form-item prop="name" label="导航名称"
          ><el-input
            placeholder="请输入导航名称"
            v-model="ruleForm.name"
          ></el-input
        ></el-form-item>
        <el-form-item prop="desc" label="导航描述"
          ><el-input
            placeholder="请输入导航描述"
            v-model="ruleForm.desc"
          ></el-input
        ></el-form-item>
        <el-form-item prop="goods" label="下属商品">
          <el-select
            v-model="ruleForm.goods"
            placeholder="请选择"
            style="width: 100%"
            multiple
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.name"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 查看弹框 -->
    <el-dialog title="分类下属商品" v-model="visible1" width="40%">
      <div v-for="(i, s) in item.goods" :key="s">商品名称：{{ i.name }}</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="visible1 = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from 'vue';
import api from '../../http/api';
import { resTips } from '../../utils/index';

interface RuleForm {
  name: string;
  desc: string;
  goods: any;
  id: string;
}

interface TableData {
  desc: string;
  goods: any;
  isShow: boolean;
  name: string;
  _id: string;
}

let query = ref('');
let current = ref(1);
let pageSize = ref(5);
let total = ref(0);
let visible = ref(false);
let visible1 = ref(false);
let num = ref(1);
let options = ref<any>();
let item = ref<TableData>({
  desc: '',
  goods: [],
  isShow: true,
  name: '',
  _id: '',
});
let tableData = ref<TableData[]>([]);
let ruleForm1 = ref();
let ruleForm = ref<RuleForm>({
  name: '',
  desc: '',
  goods: [],
  id: '',
});
let rules = ref({
  // goods: [{ required: true, message: '下属商品不能为空', triggle: 'blur' }],
  name: [{ required: true, message: '请输入导航名称', trigger: 'blur' }],
  desc: [{ required: true, message: '导航描述不能为空', triggle: 'blur' }],
});
// 点击添加
let add = () => {
  visible.value = true;
  num.value = 1;
  nextTick(() => {
    ruleForm1.value.clearValidate();
    ruleForm1.value.resetFields();
  });
};
// 搜索
let input = () => {
  getData();
};
// 查看
let look = (val: any) => {
  item.value = val;
  visible1.value = true;
};
// 编辑
let handleEdit = (val: any) => {
  num.value = 0;
  visible.value = true;
  item.value = val;
  ruleForm.value = {
    name: val.name,
    desc: val.desc,
    goods: val.goods,
    id: '',
  };
};
// 删除
let handleDelete = (val: any) => {
  api
    .delRecommendNav(val._id)
    .then((res: any) => {
      resTips({ res: res, cb: getData, tip: true });
    })
    .catch(() => {
      console.log('删除推荐导航失败');
    });
};
// 是否禁用
let change = (val: any) => {
  api
    .showRecommendNav({ id: val._id, isShow: val.isShow })
    .then((res: any) => {
      resTips({ res: res, cb: getData, tip: true });
    })
    .catch(() => {
      console.log('切换推荐导航失败');
    });
};
// 弹框确认
let confirm = () => {
  ruleForm1.value.validate((valid: any) => {
    if (valid) {
      visible.value = false;
      ruleForm.value.goods = options.value.filter((i: any) => {
        return ruleForm.value.goods.some((q: string) => {
          return i._id === q;
        });
      });
      // 添加
      if (num.value) {
        api
          .addRecommendNav(ruleForm.value)
          .then((res: any) => {
            resTips({ res: res, cb: getData, tip: true });
          })
          .catch(() => {
            console.log('添加推荐导航请求失败');
          });
      } else {
        api
          .updateRecommendNav({
            desc: ruleForm.value.desc,
            goods: ruleForm.value.goods,
            id: item.value._id,
            name: ruleForm.value.name,
          })
          .then((res: any) => {
            resTips({ res: res, cb: getData, tip: true });
          })
          .catch(() => {
            console.log('添加推荐导航请求失败');
          });
      }
    }
  });
};
let getData = () => {
  api
    .getRecommendNav({
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
      console.log('推荐导航请求失败');
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

onMounted(() => {
  getData();
  getGood();
});
</script>

<style scoped>
</style>