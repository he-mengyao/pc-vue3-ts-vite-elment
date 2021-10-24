import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import store from './store/index'
import router from './router/index'
import * as Icons from '@element-plus/icons'
import { toLine } from './utils/index'
import i18n from './language/index';



const app = createApp(App)

for (let i in Icons) {
  app.component(`el-icon${toLine(i)}`, (Icons as any)[i])
}

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(store)
app.use(router)
app.use(i18n);
app.mount('#app')



