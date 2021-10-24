import { FieldErrorList } from 'async-validator'
import type { Emitter } from 'mitt'
interface Callback {
  (isValid?: boolean, invalidFields?: FieldErrorList): void,
}


export type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'array'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email'
  | 'any'

export interface ValidateOption {
  suppressWarning?: boolean
  first?: boolean
  firstFields?: boolean | string[]
}
export interface ValidateSource {
  [field: string]: any
}

export interface Rules {
  [field: string]: RuleItem | RuleItem[]
}

export interface RuleItem {
  type?: RuleType // default type is 'string'
  required?: boolean
  pattern?: RegExp | string
  min?: number // Range of type 'string' and 'array'
  max?: number // Range of type 'string' and 'array'
  len?: number // Length of type 'string' and 'array'
  enum?: Array<string | number | boolean | null | undefined> // possible values of type 'enum'
  whitespace?: boolean
  fields?: Rules // ignore when without required
  options?: ValidateOption,
  trigger?: 'change' | 'blur'
  defaultField?: RuleItem // 'object' or 'array' containing validation rules
  transform?: (value: any) => any
  message?: string | (() => string)
  asyncValidator?: (
    rule: Rules,
    value: any,
    callback: (error: string | string[] | void) => void,
    source: ValidateSource,
    options: ValidateOption,
  ) => void | Promise<void>
  validator?: (
    rule: Rules,
    value: any,
    callback: (error: string | string[] | void) => void,
    source: ValidateSource,
    options: ValidateOption,
  ) => void
}

export interface FormOptionItem {
  // 表单左侧提示内容
  label?: string,
  // 验证字段
  prop: string,
  // 组件类型
  type: 'input' | 'radio' | 'radio-group' | 'checkbox' | 'checkbox-group'
  | 'input-number' | 'select' | 'option' | 'cascader' | 'switch' | 'slider' | 'upload'
  | 'time-picker' | 'time-select' | 'date-picker' | 'rate' | 'color-picker',
  // 验证规则
  rules?: RuleItem[],
  value: any,
  children?: FormOptionItem[],
  attrs?: {
    disbaled?: boolean,
    showPassword?: boolean,
    placeholder?: string,
    clearable?: boolean,
    // ...
  }
}


export interface ValidateFieldCallback {
  (message?: string, invalidFields?: FieldErrorList): void,
}

export interface FormInstance {
  registerLabelWidth(width: number, oldWidth: number): void,
  deregisterLabelWidth(width: number): void,
  autoLabelWidth: string | undefined,
  formMitt: Emitter,
  emit: (evt: string, ...args: any[]) => void,
  labelSuffix: string,
  inline?: boolean,
  model?: Record<string, unknown>,
  size?: string,
  showMessage?: boolean,
  labelPosition?: string,
  labelWidth?: string,
  rules?: Record<string, unknown>,
  statusIcon?: boolean,
  hideRequiredAsterisk?: boolean,
  disabled?: boolean,
  validate: (callback?: Callback) => Promise<boolean>,
  resetFields: () => void,
  clearValidate: (props?: string | string[]) => void,
  validateField: (props: string | string[], cb: ValidateFieldCallback) => void,
}