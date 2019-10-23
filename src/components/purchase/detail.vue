<template>
  <div class="row">
    <div class="col-lg-12">
      <!-- 个人信息 -->
      <div class="panel panel-default" id="listList">
        <div class="panel-heading">订单详情</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">采购单号</label>
                  <div class="col-sm-10">{{list[0].branchAliasOrderId}}</div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">订单类型</label>
                  <div class="col-sm-10">{{list[0].type==0?"调配":"采购"}}</div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">订单状态</label>
                  <div class="col-sm-10">{{list[0].process | status}}</div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">订单总金额（元）</label>
                  <div class="col-sm-10">{{allMoney}}</div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">商品总数量</label>
                  <div class="col-sm-10">{{list[0].totalQuantity}}</div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">供应商名称</label>
                  <div class="col-sm-10">{{list[0].wname || list[0].pname}}</div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">收货人</label>
                  <div class="col-sm-10">
                    <span v-for="(item,index) in list[0].users" :key="index">{{item.realName}}({{item.phone}})，</span>
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">收货地址</label>
                  <div class="col-sm-10">{{list[0].address}}</div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">商品详情</label>
                  <div class="col-sm-10">
                    <!-- 表格 -->
                    <div class="table-responsive" v-for="(item,index) in list[1]" :key="index">
                      <table class="table table-bordered">
                        <tbody>
                          <tr>
                            <td>
                              SKU编码:
                              <span>{{item.code}}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              SKU名称:
                              <span>{{item.skuName}}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              成本价:
                              <span>¥ {{item.price}}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              商品数量:
                              <span>{{item.num}}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">订单备注</label>
                  <div class="col-sm-10" v-for="(item ,index) in list[0].whOrderFlows" :key="index">{{item.comment}}</div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>


<script>
export default {
  data(){
    return{
      id:this.$route.query.id,
      allMoney:this.$route.query.allMoney,
      list:[],
    }
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      let id = this.id
      this.$axios
        .get(this.$root.urlPath.MJK + `/api/1/purchase/detail/${id}`)
        .then(res => {
          if (res.data.code==200) {
            //成功
            this.list = res.data.data
          } else {
            //失败
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    
  },
  filters: {
    type: function(val) {
      if(val==0){
        return "调配"
      }else if(val==1){
        return "采购"
      }
    },
    status:function(val){
      if(val==110){
        return "创建完成待确认"
      }
      else if(val==120){
        return "确认订单"
      }
      else if(val==130){
        return "物流确认"
      }
      else if(val==140){
        return "配货"
      }
      else if(val==150){
        return "打印出库单"
      }
      else if(val==160){
        return "发货"
      }
      else if(val==170){
        return "待处理"
      }
      else if(val==175){
        return "入库"
      }
      else if(val==178){
        return "已退货"
      }
      else if(val==180){
        return "订单完成"
      }
      else if(val==190){
        return "订单取消"
      }
      else if(val==200){
        return "订单关闭"
      }
    }
  }
  
};
</script>



<style scoped>
#listList .form-group div {
  padding-top: 7px;
}
.table-responsive tr {
  background-color: #eee;
}
</style>