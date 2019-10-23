<template>
  <div class="row inv-list">
    <div class="col-lg-12">
      <!-- 订单详情 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          订单详情          
          <a
            href="/order/index"
            role="button"
            class="btn btn-ordinary btn-xs pull-right"
          >&lt;&lt; 返回</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <div class="col-sm-2 col-sm-offset-1">订单单号</div>
                  <div class="col-sm-6">{{list.order_id}}</div>
                </div>
                <div class="form-group">
                  <div class="col-sm-2 col-sm-offset-1">订单状态</div>
                  <div class="col-sm-6">{{list.order_status}}</div>
                </div>
                <div class="form-group">
                  <div class="col-sm-2 col-sm-offset-1">合计金额</div>
                  <div class="col-sm-6">{{list.order_money}}</div>
                </div>
                <div class="form-group">
                  <div class="col-sm-2 col-sm-offset-1">商品总数量</div>
                  <div class="col-sm-6">{{list.goods_num}}</div>
                </div>
                <div class="form-group">
                  <div class="col-sm-2 col-sm-offset-1">支付方式</div>
                  <div class="col-sm-6">{{list.pay_type}}</div>
                </div>
                <div class="form-group">
                  <div class="col-sm-2 col-sm-offset-1">创建时间</div>
                  <div class="col-sm-6">{{list.gmt_create}}</div>
                </div>
                <div class="form-group">
                  <div class="col-sm-2 col-sm-offset-1">付款时间</div>
                  <div class="col-sm-6">{{list.pay_time}}</div>
                </div>
                <div class="form-group">
                  <div class="col-sm-2 col-sm-offset-1">商品详情</div>
                  <div class="col-sm-9">
                    <!-- table -->
                    <div class="table-responsive">
                      <table class="table table-striped table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>商品ID</th>
                            <th>商品名称</th>
                            <th>商品分类</th>
                            <th>数量</th>
                            <th>规格</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <!-- <td>{{list.posOrderGoodints.goods_id}}</td>
                            <td>{{list.posOrderGoodints.}}</td>
                            <td>{{list.posOrderGoodints.}}</td>
                            <td>{{list.posOrderGoodints.num}}</td>
                            <td>{{list.posOrderGoodints.}}</td> -->
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-1 col-sm-10">
                    <button type="button" class="btn btn-danger">确定</button>
                  </div>
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
  data() {
    return {
      list: {},
      id: this.$route.query.id
    };
  },
  methods: {
    getdetail() {
      this.$axios
        .post(`${this.$root.urlPath.MJK}/api/1/order_info_detail`, {orderId: this.id})
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list = res.data.data.posOrder;
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
    this.getdetail();
  }
};
</script>
