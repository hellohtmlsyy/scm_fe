import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
// import Login from '@/components/login'


//用户管理
import usermanage_home from '@/components/usermanage/home' //顶栏侧栏公共部分 + 路由展示区
import usermanage_index from '@/components/usermanage/index' //用户管理主页
import usermanage_add from '@/components/usermanage/add' //新增用户
import usermanage_menu from '@/components/usermanage/menu' //菜单管理
import usermanage_group from '@/components/usermanage/group' //用户组管理
import usermanage_rights from '@/components/usermanage/rights' //设置权限
import usermanage_behavior from '@/components/usermanage/behavior' //行为管理


// 仓库管理
import warehouse_home from '@/components/warehouse/home';
import warehouse_index from '@/components/warehouse/index'; //仓库管理
import warehouse_edit from '@/components/warehouse/edit'; //添加/编辑
import warehouse_stock from '@/components/warehouse/stock'; //库存
import warehouse_operation from '@/components/warehouse/operation'; //库存操作
import warehouse_inv_list from '@/components/warehouse/inv_list'; //盘点单列表
import warehouse_inv_detail from '@/components/warehouse/inv_detail'; //盘点单详情
import warehouse_enter_list from '@/components/warehouse/enter_list'; //入库单列表
import warehouse_enter_detail from '@/components/warehouse/enter_detail'; //入库单详情
import warehouse_out_list from '@/components/warehouse/out_list'; //出库单列表
import warehouse_out_detail from '@/components/warehouse/out_detail'; //出库单详情

// 商品管理
import goods_home from '@/components/goods/home';
import goods_sku_manage from '@/components/goods/sku_manage'; //SKU管理
import goods_sku_edit from '@/components/goods/sku_edit'; //添加/编辑SKU
import goods_sku_category from '@/components/goods/sku_category'; //SKU分类管理
import goods_sku_relevance from '@/components/goods/sku_relevance'; //SKU关联关系
import goods_manage from '@/components/goods/manage'; //商品管理
import goods_edit from '@/components/goods/edit'; //添加/编辑商品
import goods_category from '@/components/goods/category'; //商品分类管理
import goods_sup_manage from '@/components/goods/sup_manage'; //供应商管理
import goods_sup_edit from '@/components/goods/sup_edit'; //添加/编辑供应商
import goods_sup_sku from '@/components/goods/sup_sku'; //供应商SKU对照表列表

//采购中心
import purchase_home from '@/components/purchase/home'; //公共部分 + 路由展示
import purchase_apply from '@/components/purchase/apply'; //采购申请
import purchase_center from '@/components/purchase/center'; //采购中心
import purchase_orderlist from '@/components/purchase/orderlist'; //采购订单列表
import purchase_detail from '@/components/purchase/detail'; //订单详情
import purchase_recieve from '@/components/purchase/recieve'; //采购入库单列表
import purchase_return from '@/components/purchase/return'; //采购订退货单列表

// 影院管理
import cinema_home from '@/components/cinema/home';
import cinema_index from '@/components/cinema/index'; //影院列表管理
import cinema_add from '@/components/cinema/add'; //新建影院
import cinema_edit_basicinfo from '@/components/cinema/edit_basicinfo'; //影院编辑-基础信息
import cinema_edit_equipment from '@/components/cinema/edit_equipment'; //影院编辑-设备
import cinema_edit_user from '@/components/cinema/edit_user'; //影院编辑-用户
import cinema_edit_warehouse from '@/components/cinema/edit_warehouse'; //影院编辑-仓库
import cinema_edit_goodsprice from '@/components/cinema/edit_goodsprice'; //影院编辑-商品定价

// pos广告配置
import posad_home from '@/components/advertisement/home';
import posad_index from '@/components/advertisement/index'; //pos广告配置列表
import posad_edit from '@/components/advertisement/edit'; //pos广告配置编辑

// 订单中心
import order_home from '@/components/order/home';
import order_index from '@/components/order/index'; //订单中心列表
import order_detail from '@/components/order/detail'; //订单详情


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        { path: '/', redirect: { name: 'index' } },
        // { path: '/login', name: 'login', component: Login, },
        { path: '/index', name: 'index', component: Index, },
        // 用户管理
        {
            path: '/usermanage',
            name: 'usermanage',
            component: usermanage_home,
            redirect: '/user/index',
            children: [
                { path: '/usermanage/index', name: 'usermanage.index', component: usermanage_index },
                { path: '/usermanage/add', name: 'usermanage.add', component: usermanage_add },
                { path: '/usermanage/menu', name: 'usermanage.menu', component: usermanage_menu },
                { path: '/usermanage/group', name: 'usermanage.group', component: usermanage_group },
                { path: '/usermanage/rights', name: 'usermanage.rights', component: usermanage_rights },
                { path: '/usermanage/behavior', name: 'usermanage.behavior', component: usermanage_behavior },
            ]
        },
        // 仓库管理
        {
            path: '/warehouse',
            name: 'warehouse',
            component: warehouse_home,
            redirect: '/user/index',
            children: [
                { path: '/warehouse/index', name: 'warehouse.index', component: warehouse_index },
                { path: '/warehouse/edit', name: 'warehouse.edit', component: warehouse_edit },
                { path: '/warehouse/stock', name: 'warehouse.stock', component: warehouse_stock },
                { path: '/warehouse/invlist', name: 'warehouse.invlist', component: warehouse_inv_list },
                { path: '/warehouse/invdetail', name: 'warehouse.invdetail', component: warehouse_inv_detail },
                { path: '/warehouse/enterlist', name: 'warehouse.enterlist', component: warehouse_enter_list },
                { path: '/warehouse/enterdetail', name: 'warehouse.enterdetail', component: warehouse_enter_detail },
                { path: '/warehouse/outlist', name: 'warehouse.outlist', component: warehouse_out_list },
                { path: '/warehouse/outdetail', name: 'warehouse.outdetail', component: warehouse_out_detail },
                { path: '/warehouse/operation', name: 'warehouse.operation', component: warehouse_operation },

            ]
        },
        // 商品管理
        {
            path: '/goods',
            name: 'goods',
            component: goods_home,
            // redirect: '/goods',
            children: [
                { path: '/goods/skumanage', name: 'goods.skumanage', component: goods_sku_manage },
                { path: '/goods/skuedit', name: 'goods.skuedit', component: goods_sku_edit },
                { path: '/goods/skucategory', name: 'goods.skucategory', component: goods_sku_category },
                { path: '/goods/skurelevance', name: 'goods.skurelevance', component: goods_sku_relevance },
                { path: '/goods/manage', name: 'goods.manage', component: goods_manage },
                { path: '/goods/edit', name: 'goods.edit', component: goods_edit },
                { path: '/goods/category', name: 'goods.category', component: goods_category },
                { path: '/goods/supmanage', name: 'goods.supmanage', component: goods_sup_manage },
                { path: '/goods/supedit', name: 'goods.supedit', component: goods_sup_edit },
                { path: '/goods/supsku', name: 'goods.supsku', component: goods_sup_sku },
            ]
        },
        // 采购中心
        {
            path: '/purchase',
            name: 'purchase',
            component: purchase_home,
            redirect: '/user/index',
            children: [
                { path: '/purchase/apply', name: 'purchase.apply', component: purchase_apply },
                { path: '/purchase/center', name: 'purchase.center', component: purchase_center },
                { path: '/purchase/orderlist', name: 'purchase.orderlist', component: purchase_orderlist },
                { path: '/purchase/detail', name: 'purchase.detail', component: purchase_detail },
                { path: '/purchase/recieve', name: 'purchase.recieve', component: purchase_recieve },
                { path: '/purchase/return', name: 'purchase.return', component: purchase_return },
            ]
        },
        // 采购中心
        {
            path: '/cinema',
            name: 'cinema',
            component: cinema_home,
            redirect: '/cinema/index',
            children: [
                { path: '/cinema/index', name: 'cinema.index', component: cinema_index },
                { path: '/cinema/add', name: 'cinema.add', component: cinema_add },
                { path: '/cinema/editBasicinfo', name: 'cinema.editBasicinfo', component: cinema_edit_basicinfo },
                { path: '/cinema/editEquipment', name: 'cinema.editEquipment', component: cinema_edit_equipment },
                { path: '/cinema/editUser', name: 'cinema.editUser', component: cinema_edit_user },
                { path: '/cinema/editWarehouse', name: 'cinema.editWarehouse', component: cinema_edit_warehouse },
                { path: '/cinema/editGoodsprice', name: 'cinema.editGoodsprice', component: cinema_edit_goodsprice },
            ]
        },
        // POS广告配置
        {
            path: '/posad',
            name: 'posad',
            component: posad_home,
            children: [
                { path: '/posad/index', name: 'posad.index', component: posad_index },
                { path: '/posad/edit', name: 'posad.edit', component: posad_edit },
            ]
        },
        // 订单中心
        {
            path: '/order',
            name: 'order',
            component: order_home,
            children: [
                { path: '/order/index', name: 'order.index', component: order_index },
                { path: '/order/detail', name: 'order.detail', component: order_detail },
            ]
        },
    ]

})