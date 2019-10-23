<template>
  <div class="row">
    <div class="col-lg-12">
      <!-- 输入框条件筛选 -->
      <div class="panel panel-default" id="inputFilter">
        <div class="panel-heading">采购退货单列表</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">入库单号</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="orderId" v-model.trim="data.orderId" />
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
                    <button type="submit" class="btn btn-danger">搜索</button>
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
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 结果展示 -->
      <div class="panel panel-default" id="resultItem" v-for="(item,index) in list" :key="index">
        <div class="panel-heading">
          {{item.returnAliasOrderId}}
          <button class="btn btn-purple btn-sm">{{item.type==0?"调配":"采购"}}</button>
          <button class="btn btn-lightred btn-sm">{{item.status | status}}</button>
          <span>{{item.createTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</span>
          <!-- <span class="totalprice">总金额:{{}}</span> -->
          <button
            class="btn btn-success"
            data-toggle="modal"
            data-target="#myModal"
            @click="detail(item)"
          >确认退货</button>
        </div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>SKU编码</th>
                  <th>SKU名称</th>
                  <th>采购单位</th>
                  <!-- <th v-if="item.status!=2">供应商</th> -->
                  <th v-if="item.status!=2">单价</th>
                  <th>数量</th>
                  <th>备注</th>
                  <th>操作人</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sku,i) in item.whReturnOrderDetail" :key="i">
                  <td>{{sku.code}}</td>
                  <td>{{sku.skuName}}</td>
                  <td>{{sku.gunit}}</td>
                  <!-- <td v-if="item.status!=2">{{sku.supplierName}}</td> -->
                  <td v-if="item.status!=2">{{sku.price}}</td>
                  <td>{{sku.quantity}}</td>
                  <td>{{sku.comment}}</td>
                  <td>{{sku.createName}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <scm-pagination :totalPage="totalPage" @pagesClick="getpagelist" v-show="totalPage>1"></scm-pagination>
      <!-- 模态框 -->
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <span class="modal-title" id="myModalLabel">THD201812280002</span>
              <span>总金额：2500.00</span>
            </div>
            <div class="modal-body">
              <div class="table-responsive">
                <table class="table-condensed table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>SKU名称</th>
                      <th>供应商</th>
                      <th>退货数量</th>
                      <th>数量</th>
                      <th>单价</th>
                      <th>退回仓库/供货商</th>
                      <th>备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in modalList" :key="index">
                      <td>{{item.skuName}}</td>
                      <td>{{item.supplierName}}</td>
                      <td>{{item.quantity}}</td>
                      <td>{{item.num}}</td>
                      <td>{{item.price}}</td>
                      <td></td>
                      <td>{{item.gcomment}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>调配退货会退回到发货仓退货入库，并记录库存流水。采购退货退回给采购商，只做记录</p>
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
      data:{
        orderId:"",
        startTime: "",
        endTime: ""
      },
      status_button: ["全部", "退货中", "退货完成"], //状态按钮
      class1: 0, //按钮高亮切换
      btn_val: "", //按钮值
      
      list: [], //list数据
      modalList:[], //模态框渲染数据

      id:"", //确认退货，id
      type:"", //确认退货，类型
      confirmUid:"", //确认退货，操作人

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
  mounted(){
    this.getlist()
  },
  methods: {
    search() { //条件筛选
      if (this.data.orderId || (this.data.startTime && this.data.endTime)) {
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
    getlist(){ //获取数据
      let params = {
        warrantId: this.data.orderId,
        contractStime: this.data.startTime,
        contractEtime: this.data.endTime,
        status: this.btn_val,
        page:this.page,
        limit:this.limit,
      };
        this.$axios
          .get(`${this.$root.urlPath.MJK}/api/1/return/search/`,{
            params:params
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
              layer.msg(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    detail(item){ //确认退货
      this.id = item.id;
      this.type = item.type;
      this.confirmUid = item.confirmUid
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/return/detail/${item.id}/${item.type}`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.modalList = res.data.data
          } else {
            //失败
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirm(){ //确定
      this.$axios
          .post(`${this.$root.urlPath.MJK}/api/1/return/confim`,{
            id:this.id,
            type:this.type,
            confirmUid:this.confirmUid,
          })
          .then(res => {
            if (res.data.code == 200) {
              //成功
              layer.msg("成功");
            } else {
              //失败
              layer.msg(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });

    },
    statusButton(item, index) { //状态按钮切换
      this.class1 = index;
      switch (item) {
        case "全部":
          this.btn_val = "";
          this.getlist();
          break;
        case "退货中":
          this.btn_val = 1;
          this.getlist();
          break;
        case "退货完成":
          this.btn_val = 2;
          this.getlist();
          break;
        default:
          break;
      }
      console.log(this.btn_val);
    },
    getpagelist(page) { //分页
      this.page = page;
      this.getlist(page);
    },
  },
  filters: {
    status:function(val){
      if(val==1){
        return "退货中"
      }
      else if(val==2){
        return "退货完成"
      }
    }
  }
};
</script>

<style scoped>


/* 结果展示 stard */
#resultItem > .panel-heading > span {
  margin-left: 10px;
}
#resultItem > .panel-heading > span[class="totalprice"] {
  color: red;
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
#resultItem > .panel-body > .row > span {
  font-size: 20px;
  font-weight: 700;
}
/* 结果展示 end */


/* 模态框start */
#myModal .modal-header span:last-child{
    margin-left: 40px;
    color: red;
}
#myModal .modal-body tbody td:nth-child(4){
    padding: 8px 0;
}
#myModal .modal-body tbody td:nth-child(4) .col-sm-12{
    padding:0 5px;
}
#myModal .modal-body tbody td:nth-child(5){
    padding: 8px 0;
}
#myModal .modal-body tbody td:nth-child(5) .col-sm-12{
    padding:0 5px;
}
#myModal .modal-body tbody td:last-child{
    padding-top: 12px;
}
#myModal .modal-body p{
    color: red;
}
#myModal .modal-footer{
    border: 0;
}
/* 模态框end */


</style>