import { FormInstance } from './form';
import { ElMessage } from 'element-plus';
import { Ref } from 'vue'

export const toLine = (str: string) => {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase()
}
export const resTips = ({ res, cb, tip }: { res: any, cb: any, tip?: boolean }) => {
  if (res.code === 200) {
    if (tip) ElMessage.success(res.msg)
    cb()
  } else {
    if (tip) ElMessage.error(res.msg)
  }
}

export const useValidate = (form: Ref<FormInstance>, cb: () => void) => {
  form.value.validate((valid: any) => {
    if (valid) cb()
  })
}
