import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'
import Home from '../views/home.vue'
import Layout from '../views/layout/layout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () =>
      import('../views/login/login.vue'),
    meta: {
      title: '登录',
      index: '/login'
    }
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
          title: '首页',
          index: '/',
        }
      },
      {
        path: '/carousel',
        name: 'carousel',
        component: () =>
          import('../views/carousel/carousel.vue'),
        meta: {
          title: "轮播图",
          index: '/carousel'
        }
      },
      {
        path: "/navs",
        name: "navs",
        component: () =>
          import("../views/navs/navs.vue"),
        meta: {
          title: "导航管理",
          index: '/navs'
        }
      },
      {
        path: "/recom",
        name: "recom",
        component: () =>
          import("../views/recom/recom.vue"),
        meta: {
          title: "推荐导航",
          index: '/recom'
        }
      },
      {
        path: "/user",
        name: "user",
        component: () =>
          import("../views/user/user.vue"),
        meta: {
          title: "用户管理",
          index: '/user'
        }
      },
      {
        path: "/goods",
        name: "goods",
        component: () =>
          import("../views/goods/goods.vue"),
        meta: {
          title: "商品管理",
          index: '/goods'
        }
      },
      {
        path: "/addGoods",
        name: "addGoods",
        component: () =>
          import("../views/goods/addGoods.vue"),
        meta: {
          title: "添加商品",
          index: '/addGoods'
        }
      },
      {
        path: "/categ",
        name: "categ",
        component: () =>
          import("../views/goods/categ.vue"),
        meta: {
          title: "商品分类",
          index: '/categ'
        }
      },
      {
        path: "/model",
        name: "model",
        component: () =>
          import("../views/goods/model.vue"),
        meta: {
          title: "商品模型",
          index: '/model'
        }
      },
      {
        path: "/goodsSpec",
        name: "goodsSpecg",
        component: () =>
          import("../views/goods/goodsSpec.vue"),
        meta: {
          title: "商品规格",
          index: '/goodsSpecg'
        }
      },
      {
        path: "/params",
        name: "params",
        component: () =>
          import("../views/goods/params.vue"),
        meta: {
          title: "商品参数",
          index: '/params'
        }
      },
      {
        path: "/specParams",
        name: "specParams",
        component: () =>
          import("../views/goods/specParams.vue"),
        meta: {
          title: "规格参数",
          index: '/specParams'
        }
      },
      {
        path: "/specParams",
        name: "specParams",
        component: () =>
          import("../views/goods/specParams.vue"),
        meta: {
          title: "规格参数",
          index: '/specParams'
        }
      },
      {
        path: "/splike",
        name: "splike",
        component: () =>
          import("../views/splike/splike.vue"),
        meta: {
          title: "秒杀管理",
          index: '/splike'
        }
      },
      {
        path: "/splike",
        name: "splike",
        component: () =>
          import("../views/splike/splike.vue"),
        meta: {
          title: "秒杀管理",
          index: '/splike'
        }
      },
      {
        path: "/coupon",
        name: "coupon",
        component: () =>
          import("../views/coupon/coupon.vue"),
        meta: {
          title: "优惠券管理",
          index: '/coupon'
        }
      },
      {
        path: "/order",
        name: "order",
        component: () =>
          import("../views/order/order.vue"),
        meta: {
          title: "订单管理",
          index: '/order'
        }
      },
      {
        path: "/notice",
        name: "notice",
        component: () =>
          import("../views/notice/notice.vue"),
        meta: {
          title: "通知管理",
          index: '/notice'
        }
      },
      {
        path: "/chat",
        name: "chat",
        component: () =>
          import("../views/chat/chat.vue"),
        meta: {
          title: "客服管理",
          index: '/chat'
        }
      },
    ]
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string
  const user = JSON.parse(localStorage.getItem('user')!)
  if (to.path === '/login') {
    next()
  } else {
    user ? next() : next('/login')
  }
})

export default router;