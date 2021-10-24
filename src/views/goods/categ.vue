<template>
  <div>
    <el-card>
      <div>
        <el-input
          placeholder="请输入"
          suffix-icon="el-icon-search"
          v-model="query"
          style="width: 300px; margin-right: 20px"
          @input="input"
        >
        </el-input>
      </div>
      <div class="flex flex-b mrtb-20">
        <!-- 左边 -->
        <div class="left" style="width: 400px">
          <el-tree :data="data" :props="defaultProps">
            <template #default="{ node, data }">
              <span class="custom-tree-node w-100 flex flex-b">
                <span>{{ node.label }}</span>
                <span class="span none">
                  <a v-if="!data.parentId" @click="addTree(data)"> 新增 </a>
                  <a @click="ban(data)"> 禁用 </a>
                  <a @click="del(data)" v-if="!data.parentId"> 删除 </a>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
        <!-- 右边 -->
        <div class="right">
          <el-card class="box-card" style="width: 600px">
            <template #header>
              <div class="card-header flex ai-c flex-b">
                <span class="f14">新增分类</span>
                <el-button class="button" type="text" @click="comfirm"
                  >确认</el-button
                >
              </div>
            </template>
            <div>
              <el-form
                :model="ruleForm"
                ref="ruleForm1"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item
                  label="分类名称"
                  prop="name"
                  :rules="[
                    {
                      required: true,
                      message: '分类名称不能为空',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="ruleForm.name"
                    placeholder="请输入分类名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="上级分类" prop="parentId">
                  <el-select
                    v-model="ruleForm.parentname"
                    placeholder="请选择"
                    style="width: 100%"
                    @change="change"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分类别名" prop="short_name">
                  <el-input
                    v-model="ruleForm.short_name"
                    placeholder="请输入分类别名"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import api from '../../http/api';

interface RuleForm {
  name: string;
  short_name: string;
  isShow: boolean;
  parentId: string;
  parentname: string;
}
interface Data {
  isShow: boolean;
  list: string;
  short_name: string;
  _id: string;
}

let query = ref('');
let options = ref<any>();
let ruleForm1 = ref();
let data = ref<Data[]>([]);
let defaultProps = ref({
  children: 'list',
  label: 'name',
});
let ruleForm = ref<RuleForm>({
  name: '',
  short_name: '',
  isShow: true,
  parentId: '',
  parentname: '',
});
// 选择分类
let change = (val: any) => {
  ruleForm.value.parentId = val.value._id;
  ruleForm.value.parentname = val.label;
};
// 搜索
let input = () => {
  getData();
};
// 删除
let del = (val: any) => {
  api
    .delCategory(val._id)
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getData();
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      console.log('删除分类请求失败');
    });
};
// 禁用
let ban = (val: any) => {
  ElMessage.error('暂无此功能');
};
// 树形结构新增
let addTree = (val: any) => {
  ruleForm.value.parentname = val.name;
  ruleForm.value.parentId = val._id;
};
// 确认
let comfirm = () => {
  ruleForm1.value.validate((valid: boolean) => {
    if (valid) {
      if (!ruleForm.value.parentId) {
        api
          .addCategory({
            name: ruleForm.value.name,
            short_name: ruleForm.value.name,
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
            console.log('添加一级分类请求失败');
          });
      } else {
        // 添加二级分类
        api
          .addSecondCategory({
            name: ruleForm.value.name,
            parentId: ruleForm.value.parentId,
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
            console.log('添加二级分类失败');
          });
      }
      ruleForm.value = {
        name: '',
        short_name: '',
        isShow: true,
        parentId: '',
        parentname: '',
      };
    }
  });
};
// 获取分类
let getData = () => {
  api
    .getCategory(query.value)
    .then((res: any) => {
      if (res.code === 200) {
        // console.log(res);
        if (res.data) {
          data.value = res.data;
          let arr: any = [];
          res.data.map((i: any) => {
            arr.push({
              value: i,
              label: i.name,
            });
          });
          options.value = arr;
        }
      }
    })
    .catch(() => {
      console.log('分类请求失败');
    });
};
onMounted(() => {
  getData();
});
</script>

<style scoped lang='scss'>
.custom-tree-node {
  &:hover {
    .span {
      display: block;
    }
  }
}
</style>