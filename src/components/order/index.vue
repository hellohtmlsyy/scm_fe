<template>
  <div class="row order-center">
    <div class="col-lg-12">
      <!-- 订单中心 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">订单中心</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="shop" class="col-sm-2 control-label">选择店铺</label>
                  <div class="col-sm-6">
                    <select name="shop" id="shop" class="form-control" v-model="shopName">
                      <!-- <option
                        v-for="(item,index) in whinfoAll"
                        :value="item.name"
                        :key="index"
                      >{{item.name}}</option> -->
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="oddnumber" class="col-sm-2 control-label">订单单号</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="oddnumber" name="oddnumber" v-model.trim="oddnumber" />
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">添加时间</label>
                  <div class="col-sm-3">
                    <date-picker v-model="startTime" :config="options"></date-picker>
                  </div>
                  <div class="col-sm-3">
                    <date-picker v-model="endTime" :config="options"></date-picker>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button type="button" class="btn btn-danger" @click="search()">搜索</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 分类搜索 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">状态</label>
                  <div class="col-sm-10">
                    <input
                      class="btn btn-sm"
                      :class="tabClass == index? 'btn-info': 'btn-secondary'"
                      type="button"
                      v-for="(item,index) in state"
                      :value="item.name"
                      @click="cutTabClick(index,item.id,0)"
                      :key="index"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">支付方式</label>
                  <div class="col-sm-10">
                    <input
                      class="btn btn-sm mb-10"
                      :class="tabClass2 == index? 'btn-info': 'btn-secondary'"
                      type="button"
                      v-for="(item,index) in payMethod"
                      :value="item.name"
                      @click="cutTabClick(index,item.id)"
                      :key="index"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- list -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">订单列表
          <button type="button" class="btn btn-warning btn-xs pull-right">
            <download-excel class="export-excel-wrapper" :data="json_data">
              <i class="fa fa-download fa-fw"></i>导出
            </download-excel>
          </button>
        </div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>订单单号</th>
                  <th>店铺名称</th>
                  <th>合计金额</th>
                  <th>支付方式</th>
                  <th>订单状态</th>
                  <th>创建时间</th>
                  <th>付款时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.posOrder.order_id}}</td>
                  <td>{{item.posOrder.store_id}}</td>
                  <td>{{item.posOrder.order_money}}</td>
                  <td>{{item.posOrder.pay_type}}</td>
                  <td>{{item.posOrder.order_status}}</td>
                  <td>{{item.posOrder.gmt_create}}</td>
                  <td>{{item.posOrder.gmt_create}}</td>
                  <td>
                    <a
                      :href="'/order/detail?id='+item.posOrder.id"
                      role="button"
                      class="btn btn-info btn-xs"
                    >详情</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 分页 -->
          <scm-pagination :totalPage="totalPage" @pagesClick="getpagelist" v-show="totalPage>1"></scm-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      json_data: [], //导出数据
      options: {
        format: "YYYY-MM-DD hh:mm:ss",
        useCurrent: false,
        locale: "zh-cn",
        tooltips: {
          selectTime: ""
        }
      },
      startTime: "",
      endTime: "",
      shopName: "", //店铺名称
      oddnumber: '',//订单单号
      list: [], //数据
      type: [], //类型
      state: [
        { name: '全部', id: null },
        { name: '已完成', id: 2 },
        { name: '已取消', id: 3 },
      ],//状态
      orderStatus: null,
      payMethod: [
        {name: '全部', id: null },
        {name: '现金', id: 3 },
        {name: '支付宝', id: 1 },
        {name: '微信', id: 2 },
      ],//支付方式
      payType: null,
      nowIndex: "", //传递删除用户的下标
      tabClass: 0,
      tabClass2: 0,
      page: 1, //当前页数
      rows: 10, //每页条数
      totalPage: 0 //总页数
    };
  },
  methods: {
    getpagelist(page) {
      this.page = page;
      this.getlist(page);
    },
    search() {
      //搜索
      if (
        this.oddnumber != "" ||
        this.oddnumber != "" ||
        (this.startTime != "" && this.endTime != "")
      ) {
        if (this.startTime > this.endTime) {
          layer.open({
            content: "时间不正确，请重新输入",
            title: "提示"
          });
          return;
        } else {
          this.page = 1;
          this.getlist();
        }
      } else {
        layer.open({
          content: "请输入需要搜索的条件",
          title: "提示"
        });
      }
    },
    cutTabClick(index, id, t) {
      if (t == 0) {
        this.tabClass = index;
        this.orderStatus = id;
      } else {
        this.tabClass2 = index;
        this.payType = id;
      }
      this.getlist();
    },
    getlist(page, type) {
      //获取list
      let params = {
        page: this.page,
        rows: this.rows,
        storeId: 1,
        orderId: this.oddnumber,
        startTime: this.startTime,
        endTIme: this.endTime,
        orderStatus: this.orderStatus,
        payType: this.payType,
      };
      // let params = {"storeId":1,"orderId":"1","startTime":"2019-09-28 09:00:00","endTime":"2019-10-22 19:00:00","orderStatus":4,"page":1,"rows":10}

      $.ajax({
        type:"POST",
        url:`${this.$root.urlPath.MJK}/api/1/order_list_detail`,
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(params),
        dataType:"json",
        success:function(res){
          console.log(res)
          if (res.code == 200) {
          //成功
            this.list = res.data.posOrderDetailList;
            for (var i = 0; i < res.data.posOrderDetailList.length; i++) {
              let obj = {};
              let ele = res.data.posOrderDetailList[i].posOrder;
              obj["订单单号"] = ele.order_id;
              obj["店铺名称"] = ele.store_id;
              obj["合计金额"] = ele.order_money;
              obj["支付方式"] = ele.pay_type;
              obj["订单状态"] = ele.order_status;
              obj["创建时间"] = ele.gmt_create;
              obj["付款时间"] = ele.gmt_create;
              this.json_data.push(obj);
            }
            this.totalPage = Math.ceil(res.data.total / this.rows);
            if (res.data.posOrderDetailList.length == 0) {
              layer.msg("暂无数据");
            }
          } else {
          //失败
            layer.msg(res.data.msg);
          }
        },
        error:function(err){ 
        console.log(err)
        } 
      })


      // this.$axios
      //   .post(`${this.$root.urlPath.MJK}/api/1/order_list_detail`, params)
      //   .then(res => {
      //     if (res.data.code == 200) {
      //       //成功
      //       this.list = res.data.data.posOrderDetailList;
      //       for (var i = 0; i < res.data.data.posOrderDetailList.length; i++) {
      //         let obj = {};
      //         let ele = res.data.data.posOrderDetailList[i].posOrder;
      //         obj["订单单号"] = ele.order_id;
      //         obj["店铺名称"] = ele.store_id;
      //         obj["合计金额"] = ele.order_money;
      //         obj["支付方式"] = ele.pay_type;
      //         obj["订单状态"] = ele.order_status;
      //         obj["创建时间"] = ele.gmt_create;
      //         obj["付款时间"] = ele.gmt_create;
      //         this.json_data.push(obj);
      //       }
      //       this.totalPage = Math.ceil(res.data.data.posOrderDetailList.total / this.rows);
      //       if (res.data.data.posOrderDetailList.length == 0) {
      //         layer.msg("暂无数据");
      //       }
      //     } else {
      //       //失败
      //       layer.msg(res.data.msg);
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    getwhinfoAll() {
      //获取店铺名称
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/warehouse/info/all`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            // this.whinfoAll = res.data.data;
          } else {
            //失败
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getlist(this.page); //list数据
    // this.getwhinfoAll();
  }
};
</script>
<style scoped>
.checkbox-inline {
  margin-left: 0;
  margin-right: 10px;
}
</style>