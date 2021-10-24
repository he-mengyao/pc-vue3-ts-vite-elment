<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm1"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="商品模型"
        prop="model"
        :rules="[
          { required: true, message: '商品模型不能为空', trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="ruleForm.model"
          placeholder="请选择"
          @change="change"
          clearable
          style="width: 400px"
        >
          <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格" prop="spec">
        <template v-for="(item, index) in specData" :key="index">
          <el-checkbox
            :indeterminate="indeterminate"
            v-model="item.checked"
            @change="handleCheckAllChange($event, item)"
            :label="item.name"
          ></el-checkbox>
          <el-checkbox-group
            v-model="item.checkList"
            @change="handleCheckedCitiesChange($event, item)"
          >
            <el-checkbox
              v-for="(item1, index1) in item.spec_item1"
              :label="item1"
              :key="index1"
            ></el-checkbox>
          </el-checkbox-group>
        </template>
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="quit">取消</el-button>
      <el-button class="mrl-20" type="primary" @click="comfirm">确认</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '../../http/api';
interface Ruleform {
  model: Model;
  spec: any;
}
interface Model {
  label: string;
  value: any;
}

let ruleForm1 = ref();
let props = defineProps({
  activeIndex: {
    type: String,
    required: true,
  },
  modelList: {
    type: Array,
    required: true,
  },
});
let indeterminate = ref(false);
let checkAll = ref(false);
let checkedCities = ref([]);
let list = ref<Model[]>(props.modelList as any);
let specData = ref<any[]>([]);
let ruleForm = ref<Ruleform>({
  model: {
    label: '',
    value: {},
  },
  spec: [],
});
let emits = defineEmits(['update:activeIndex', 'data1']);
let quit = () => {
  emits('update:activeIndex', '2');
};
// 选择模型
let change = (val: any) => {
  api
    .getSpec({ parentId: val.value._id })
    .then((res: any) => {
      if (res.code === 200) {
        res.data.map((i: any) => {
          i.checked = false;
          i.checkList = [];
          i.spec_item1 = i.spec_item.split('\n');
        });
        specData.value = res.data;
      }
    })
    .catch(() => {
      console.log('获取规格请求失败');
    });
};
// 全选
let handleCheckAllChange = (val: boolean, item: any) => {
  item.checkList = val ? [...item.spec_item1] : [];
};
// 单选
let handleCheckedCitiesChange = (val: any, item: any) => {
  item.checked = val.length === item.spec_item1.length;
};
// 确认
let comfirm = () => {
  ruleForm1.value.validate((valid: any) => {
    if (valid) {
      ruleForm.value.spec = specData.value.map((i: any) => {
        if (i.checkList.length > 0) {
          return {
            name: i.name,
            checked: i.checkList,
          };
        }
      });
      emits('update:activeIndex', '4');
      emits('data1', ruleForm.value);
    }
  });
};
</script>

<style scoped>
</style>