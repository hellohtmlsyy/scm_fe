<template>
  <div class="row">
    <div class="col-lg-12">
      <!-- 输入框条件筛选 -->
      <div class="panel panel-default" id="inputFilter">
        <div class="panel-heading">采购入库单列表</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">入库单号</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" v-model.trim="data.warrantAliasOrderId" />
                  </div>
                </div>
                <div class="form-group" id="dateRange">
                  <label for="inputPassword5" class="col-sm-2 control-label">申请时间</label>
                  <div class="col-sm-3">
                    <date-picker v-model="data.startTime" :config="options"></date-picker>
                  </div>
                  <div class="col-sm-3">
                    <date-picker v-model="data.endTime" :config="options"></date-picker>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-danger" @click.prevent="search()">搜索</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 按钮条件筛选 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-6">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-3 control-label">状态</label>
                  <div class="col-sm-9 buttonActive">
                    <input
                      class="btn btn-sm"
                      :class="class1 == index? 'btn-info': 'btn-secondary'"
                      type="button"
                      :value="item"
                      v-for="(item,index) in status_button"
                      :key="index"
                      @click="statusButton(item,index)"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-3 control-label">订单类型</label>
                  <div class="col-sm-9 buttonActive">
                    <input
                      class="btn btn-sm"
                      :class="class2 == index? 'btn-info': 'btn-secondary'"
                      type="button"
                      :value="item"
                      v-for="(item,index) in status_button2"
                      :key="index"
                      @click="statusButton2(item,index)"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 结果展示 -->
      <div class="panel panel-default" id="resultItem" v-for="(item,index) in list" :key="index">
        <div class="panel-heading">
          {{item.branchOrder}}
          <button class="btn btn-cyan btn-sm">{{item.type==0?"调配":"采购"}}</button>
          <button class="btn btn-lightred btn-sm">{{item.status | status}}</button>
          <span>{{item.createTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</span>
          <button
            v-if="item.status!=2"
            class="btn btn-success"
            data-toggle="modal"
            data-target="#myModal"
            @click="edit(item)"
          >入库&nbsp;/&nbsp;退货</button>
        </div>
        <div class="panel-body">
          <!-- 未处理 -->
          <div class="row" v-if="item.untreated.length!=0">
            <button class="btn btn-warning btn-xs">未处理</button>
            <!-- 表格 -->
            <div class="table-responsive">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>SKU编码</th>
                    <th>SKU名称</th>
                    <th>采购单位</th>
                    <th>数量</th>
                    <th>备注</th>
                    <th>操作人</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sku,i) in item.untreated" :key="i">
                    <td>{{sku.code}}</td>
                    <td>{{sku.skuName}}</td>
                    <td>{{sku.unit}}</td>
                    <td>{{sku.quantity}}</td>
                    <td>{{sku.comment}}</td>
                    <td>{{sku.realName}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- 已入库 -->
          <div class="row" v-if="item.inWh.length!=0">
            <button class="btn btn-success btn-xs">已入库</button>
            <!-- 表格 -->
            <div class="table-responsive">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>SKU编码</th>
                    <th>SKU名称</th>
                    <th>采购单位</th>
                    <th>数量</th>
                    <th>备注</th>
                    <th>操作人</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sku,i) in item.inWh" :key="i">
                    <td>{{sku.code}}</td>
                    <td>{{sku.skuName}}</td>
                    <td>{{sku.unit}}</td>
                    <td>{{sku.quantity}}</td>
                    <td>{{sku.comment}}</td>
                    <td>{{sku.realName}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- 退货 -->
          <div class="row" v-if="item.returnGoods.length!=0">
            <button class="btn btn-danger btn-xs">退货</button>
            <!-- 表格 -->
            <div class="table-responsive">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>SKU编码</th>
                    <th>SKU名称</th>
                    <th>采购单位</th>
                    <th>数量</th>
                    <th>备注</th>
                    <th>操作人</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sku,i) in item.returnGoods" :key="i">
                    <td>{{sku.code}}</td>
                    <td>{{sku.skuName}}</td>
                    <td>{{sku.unit}}</td>
                    <td>{{sku.quantity}}</td>
                    <td>{{sku.comment}}</td>
                    <td>{{sku.realName}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <scm-pagination :totalPage="totalPage" @pagesClick="getpagelist" v-show="totalPage>1"></scm-pagination>
      
      <!-- 模态框，退货/入库 -->
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myModalLabel">{{modalList[1]}}</h4>
            </div>
            <div class="modal-body">
              <div class="table-responsive">
                <table class="table-condensed table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>SKU名称</th>
                      <th>供应商</th>
                      <th>采购/调配数量</th>
                      <th>选择操作类型</th>
                      <th>入库/处理数量</th>
                      <th>备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in modalList[0]" :key="index">
                      <td>{{item.skuName}}</td>
                      <td>{{item.supplierName}}</td>
                      <td>{{item.quantity}}</td>
                      <td>
                        <div class="form-group">
                          <div class="col-sm-10">
                            <select class="form-control" v-model="item.typeId">
                              <option value="2">入库</option>
                              <option value="1">退货</option>
                            </select>
                          </div>
                        </div>
                      </td>
                      <td>
                        <input type="text" class="form-control" v-model.trim="item.number" />
                      </td>
                      <td>
                        <input type="text" class="form-control" v-model.trim="item.remarks" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-lightred" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-success" data-dismiss="modal" @click="confirm()">确认</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        warrantAliasOrderId: "", //入库单号
        startTime: "", //开始时间
        endTime: "" //结束时间
      },

      list: [], //list数据
      modalList: [], //模态框渲染数据

      status_button: ["全部", "待处理", "已处理", "已完成"], //订单类型按钮
      status_button2: ["全部", "调配", "采购"], //订单类型按钮
      class1: 0, //类型按钮高亮切换
      class2: 0, //状态按钮高亮切换
      btn_val: null, //订单类型按钮值
      btn_val2: null, //订单状态按钮值

      nowIndex: "", //删除项索引
      id: "", //删除项id

      // 分页相关
      page: 1, //当前页数
      limit: 10, //每页条数
      totalPage: 0, //总页数

      options: { //日期插件配置对象
        format: "YYYY-MM-DD hh:mm:ss",
        useCurrent: false,
        locale: "zh-cn",
        tooltips: {
          selectTime: ""
        }
      }
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    search() { //条件筛选
      if (this.data.warrantAliasOrderId || (this.data.startTime && this.data.endTime)) {
        if (this.data.startTime > this.data.endTime) {
          layer.open({
            content: "时间不正确，请重新输入",
            title: "提示"
          });
          return;
        } else {
          this.getlist();
        }
      } else {
        layer.open({
          content: "请输入需要搜索的条件",
          title: "提示"
        });
      }
    },
    getlist() { //获取数据
      let params = {
        warrantAliasOrderId: this.data.warrantAliasOrderId,
        contractStime: this.data.startTime,
        contractEtime: this.data.endTime,
        status: this.btn_val,
        type: this.btn_val2,
        page:this.page,
        limit:this.limit,
      };
      this.$axios
        .get(this.$root.urlPath.MJK + `/api/1/warrant/search`, {
          params: params
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list = res.data.data.list;
            this.totalPage = Math.ceil(res.data.data.total / this.limit);
            if (res.data.data.list.length == 0) {
              layer.msg("暂无数据");
            }
          } else {
            //失败
            console.log(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },   
    edit(item) { //入库退货
      let params = {
        warrantAliasOrderId:item.warrantAliasOrderId,  
      }
      this.$axios
        .get(this.$root.urlPath.MJK + `/api/1/warrant/untreated`, {
          params: params
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.modalList = res.data.data;
            $.each(this.modalList[0],function(index,item){
              //手动添加三个属性，操作类型，数量，备注
              item.typeId = "";
              item.number = "";
              item.remarks = "";
            })
            console.log(this.modalList)
            
          } else {
            //失败
            console.log(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirm() { //确定
      let arr = [];
      $.each(this.modalList[0],function(index,item){
        let obj = {}
        obj.skuId = item.skuId;
        obj.type = item.type;
        obj.warrantId = item.warrantId;
        obj.optionType = item.typeId;
        obj.quantity = item.number;
        obj.comment = item.remarks;
        obj.createUid = item.createUid;
        obj.price = item.price;
        obj.quantityAll = item.quantity;
        arr.push(obj)
      })
      let params = {
          wwd: arr,
        }
      let url = this.$root.urlPath.MJK + "/api/1/warrant/confirm"

      console.log(params)

      var aa = true;
      $.each(params.wwd,function(index,item){
        if(!item.optionType || !item.quantity ||item.quantity>item.quantityAll){
          aa=false;
        }
      })

      if(aa==true){

        $.ajax({
        type:"POST",
        url:url,
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(params),
        dataType:"json",
        success:function(res){
          if (res.code == 200) {
            //成功
            layer.msg("成功");
          } else {
            //失败
            layer.msg("失败");
          }
        },
        error:function(err){  
            console.log(err)
        }  
      })

      }else if(aa==false){
        layer.open({
          content: "请正确填写退货方式和数量",
          title: "提示"
        });
      }
      

      
      

      // this.$axios
      //   .post(this.$root.urlPath.MJK + "/api/1/warrant/confirm", params)
      //   .then(res => {
      //     if (res.data.code == 200) {
      //       //成功
      //       layer.msg("成功");
      //     } else {
      //       //失败
      //       layer.msg("失败");
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    statusButton(item, index) { //状态按钮切换
      this.class1 = index;
      switch (item) {
        case "全部":
          this.btn_val = "";
          this.getlist();
          break;
        case "待处理":
          this.btn_val = 0;
          this.getlist();
          break;
        case "已处理":
          this.btn_val = 1;
          this.getlist();
          break;
        case "已完成":
          this.btn_val = 2;
          this.getlist();
          break;
        default:
          break;
      }
      console.log(this.btn_val);
    },
    statusButton2(item, index) { //订单状态按钮
      this.class2 = index;
      switch (item) {
        case "全部":
          this.btn_val2 = "";
          this.getlist();
          break;
        case "调配":
          this.btn_val2 = 0;
          this.getlist();
          break;
        case "采购":
          this.btn_val2 = 1;
          this.getlist();
          break;
        default:
          break;
      }
      console.log(this.btn_val2);
    },
    getpagelist(page) { //分页
      this.page = page;
      this.getlist(page);
    },
  },
  filters: {
    status:function(val){
      if(val==0){
        return "未完成"
      }
      else if(val==1){
        return "处理中"
      }
      else if(val==2){
        return "已完成"
      }
    }
  }
};
</script>

<style scoped>
/* 输入框条件筛选 start */

/* 输入框条件筛选 end */

/* 结果展示 stard */
#resultItem > .panel-heading > span {
  margin-left: 10px;
}
#resultItem > .panel-heading > button {
  margin-left: 10px;
}
#resultItem > .panel-heading > button:last-child {
  float: right;
}
#resultItem > .panel-body > .row {
  margin: -15px 0 0 0;
  padding: 5px 5px 5px 0;
}
#resultItem > .panel-body > .table-responsive {
  margin-bottom: 0 !important;
}
#resultItem > .panel-body > .row > div {
  margin-top: 5px;
}
/* 结果展示 end */

/* 模态框start */

/* 模态框end */
</style>