<template>
  <div>
    <el-card>
      <el-form :model="ruleform" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="所属商品"
          prop="parentId"
          :rules="[
            { required: true, message: '商品模型不能为空', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="ruleform.parentId"
            placeholder="请选择"
            @change="change($event)"
            clearable
            style="width: 300px"
          >
            <el-option
              v-for="item in goods"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div id="div1" class="pr" style="z-index: 1"></div>
      <div class="mrtb-20 flex flex-r">
        <el-button type="primary" @click="comfirm">确定</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api from '../../http/api';
import { onMounted, ref } from 'vue';
import E from 'wangeditor';
import { resTips } from '../../utils/index';

interface RuleForm {
  parentId: string;
  specParams: any;
}

let ruleform = ref<RuleForm>({
  parentId: '',
  specParams: '',
});
let goods = ref<any[]>([]);
let editor = ref<any>();
let change = (val: any) => {
  api
    .getSpecParams({ parentId: val })
    .then((res: any) => {
      resTips({ res: res, cb: getData });
      editor.value.txt.html(res.data);
    })
    .catch(() => {
      console.log('获取商品规格参数失败');
    });
};
let getData = () => {
  api
    .getGoods({
      query: '',
      current: 1,
      pageSize: 99,
    })
    .then((res: any) => {
      if (res.code === 200) {
        goods.value = res.data;
      }
    })
    .catch(() => {
      console.log('获取商品数据请求失败');
    });
};
// 点击确认
let comfirm = () => {
  api
    .addSpecParams(ruleform.value)
    .then((res: any) => {
      resTips({ res: res, cb: empty, tip: true });
    })
    .catch(() => {
      console.log('添加规格参数失败');
    });
};
let empty = () => {
  ruleform.value.parentId = '';
  editor.value.txt.html('');
};
onMounted(() => {
  getData();
  const editor1 = new E('#div1');
  if (editor1) {
    editor.value = editor1;
    editor.value.create();
    editor.value.config.onchange = function (newHtml: any) {
      ruleform.value.specParams = newHtml;
    };
  }
});
</script>

<style scoped lang='scss'>
</style>