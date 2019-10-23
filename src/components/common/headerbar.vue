<template>
  <div id="wrapper">
    <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
      <div class="navbar-header">
        <button
          type="button"
          class="navbar-toggle"
          data-toggle="collapse"
          data-target=".navbar-collapse"
        >
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="javascript:void(0)">
          <img id="logoimage" src="../../assets/logo.svg" alt />
          SMI供应链管理平台
        </a>
      </div>
      <!-- /.navbar-header -->
      <ul class="nav navbar-top-links navbar-right">
        <li class="dropdown">
          <a class="dropdown-toggle" data-toggle="dropdown" href="#">
            <i class="fa fa-user fa-fw"></i>管理员
            <i class="fa fa-caret-down"></i>
          </a>
          <ul class="dropdown-menu dropdown-user">
            <li>
              <a href="/login">
                <i class="fa fa-sign-out fa-fw"></i> 退出登录
              </a>
              <!-- <router-link to="/login">
                <i class="fa fa-sign-out fa-fw"></i> 退出登录
              </router-link>-->
            </li>
          </ul>
          <!-- /.dropdown-user -->
        </li>
        <!-- /.dropdown -->
      </ul>
      <!-- /.navbar-top-links -->

      <div class="navbar-default sidebar" role="navigation">
        <div class="sidebar-nav navbar-collapse">
          <ul class="nav" id="side-menu">
            <li v-for="(item, index) in menuList2" :key="index">
              <a href="#">
                <i class="fa fa-folder fa-fw"></i> {{item.name}}
                <span class="fa arrow"></span>
              </a>
              <ul class="nav nav-second-level">
                <li v-for="(j, i) in item.menuT" :key="i">
                  <a :href="j.url">{{j.name}}</a>
                </li>
              </ul>
              <!-- /.nav-second-level -->
            </li>
         
          </ul>

          <!-- <ul class="nav" id="side-menu">
            <li v-for="(item, index) in menuList" :key="index">
              <a href="#">
                <i class="fa fa-male fa-fw"></i> {{item.menuName}}
                <span class="fa arrow"></span>
              </a>
              <ul class="nav nav-second-level">
                <li v-for="(j, index) in item.menus" :key="index">
                  <a :href="j.url">{{j.menuName}}</a>
                </li>
              </ul>
            </li> -->
          <!-- </ul> -->
        </div>
        <!-- /.sidebar-collapse -->
      </div>
      <!-- /.navbar-static-side -->
    </nav>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        menuList: [],
        menuList2: [
          {
            name: '用户管理',
            menuT: [
              { name: '用户管理', url: '/usermanage/index' },
              { name: '用户角色管理', url: '/usermanage/group' },
              { name: '菜单管理', url: '/usermanage/menu' },
              { name: '行为管理', url: '/usermanage/behavior' },
            ],
          },
          {
            name: '仓库管理',
            menuT: [
              { name: '仓库管理', url: '/warehouse/index' },
              { name: '实时库存', url: '/warehouse/stock' },
              { name: '盘点单列表', url: '/warehouse/invlist' },
              { name: '入库单列表', url: '/warehouse/enterlist' },
              { name: '出库单列表', url: '/warehouse/outlist' },
            ],
          },
          {
            name: '商品管理',
            menuT: [
              { name: 'SKU管理', url: '/goods/skumanage' },
              { name: 'SKU分类管理', url: '/goods/skucategory' },
              { name: 'SKU关联关系', url: '/goods/skurelevance' },
              { name: '商品管理', url: '/goods/manage' },
              { name: '商品分类管理', url: '/goods/category' },
              { name: '供应商管理', url: '/goods/supmanage' },

            ],
          },
          {
            name: '采购中心',
            menuT: [
              { name: '采购中心', url: '/purchase/center' },
              { name: '采购订单列表', url: '/purchase/orderlist' },
              { name: '采购入库单列表', url: '/purchase/recieve' },
              { name: '采购退货单列表', url: '/purchase/return' },
            ],
          },
          {
            name: '影院管理',
            menuT: [
              { name: '影院管理', url: '/cinema/index' },
            ],
          },
          {
            name: 'POS广告配置',
            menuT: [
              { name: 'POS广告配置', url: '/posad/index' },
            ],
          },
          {
            name: '订单中心',
            menuT: [
              { name: '订单中心', url: '/order/index' },
            ],
          }
        ],
      }
    },
    methods: {
      getList () {
        this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/supermenu`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.menuList = res.data.data;
            if (res.data.data.list.length == 0) {
              layer.msg("暂无数据");
            }
          } else {
            //失败
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
      }
    },
    mounted() {
      // this.getList();
    },
  }
</script>
<style>
.sidebar ul li a.active {
  background: inherit;
}
/* 侧边栏二级菜单选中时高亮样式 */

#side-menu .nav-second-level > li > a[class="active"] {
  background-color: rgba(255, 255, 255, 0.4);
}
</style>