<template>
  <div class="row inv-list">
    <div class="col-lg-12">
      <!-- 出库详情 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          出库详情
          <span>{{list.checkoutAliasOrderId}}</span>
          <a
            href="/warehouse/outlist"
            role="button"
            class="btn btn-ordinary btn-xs pull-right"
          >&lt;&lt; 返回</a>
        </div>
        <div class="panel-body">
          <!-- table -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>记录ID</th>
                  <th>操作人</th>
                  <th>仓库</th>
                  <th>类型</th>
                  <th>操作类型</th>
                  <th>操作备注</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{list.id}}</td>
                  <td>{{list.name}}</td>
                  <td>{{list.whName}}</td>
                  <td>出库</td>
                  <td>采购出库</td>
                  <td>{{list.comment}}</td>
                  <td>{{list.createTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- list -->
      <div class="panel panel-default">
        <div class="panel-body">
          <!-- table -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>分类</th>
                  <th>出库前数量</th>
                  <th>出库数量</th>
                  <th>出库后数量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in list.whCheckoutOrderDetails" :key="index">
                  <td>{{item.skuName}}</td>
                  <td><span v-for="(j, index2) in item.categorys" :key="index2">{{j}}</span></td>
                  <td>{{item.beforeNum}}{{item.unit}}</td>
                  <td>{{item.quantity}}{{item.unit}}</td>
                  <td>{{item.beforeNum - item.quantity}}{{item.unit}}</td>
                </tr>
              </tbody>
            </table>
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
        .get(`${this.$root.urlPath.MJK}/api/1/wh/checkout/detail/${this.id}`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list = res.data.data;
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
