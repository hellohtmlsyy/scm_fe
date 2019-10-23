<template>
  <div class="row inv-detail">
    <div class="col-lg-12">
      <!-- 盘点详情 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          盘点详情
          <span>{{list.orderNum}}</span>
          <a
            href="/warehouse/invlist"
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
                  <th>状态</th>
                  <th>类型</th>
                  <th>操作类型</th>
                  <th>操作备注</th>
                  <th>审核意见</th>
                  <th>审核人</th>
                  <th>审核时间</th>
                  <th>操作时间</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{list.id}}</td>
                  <td>{{list.operatorName}}</td>
                  <td>{{list.warehousesName}}</td>
                  <td
                    :class="list.status == 0? 'text-warning': (list.status==1? 'text-success':'text-danger')"
                  >{{list.status==0? '待审批':(list.status==1? '审批通过':'审批驳回')}}</td>
                  <td>{{list.typeName}}</td>
                  <td>{{list.optionTypeName}}</td>
                  <td>{{list.remarks}}</td>
                  <td>{{list.opinion}}</td>
                  <td>{{list.examineName}}</td>
                  <td>{{list.examineTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</td>
                  <td>{{list.createAt|convertTime('yyyy-MM-dd hh:mm:ss')}}</td>
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
                  <th>盘点前数量</th>
                  <th>盘点数量</th>
                  <th>盈亏数量</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{list.skuName}}</td>
                  <td>{{list.skuCategory}}</td>
                  <td>{{list.numBefore}}{{list.unit}}</td>
                  <td>{{list.num}}{{list.unit}}</td>
                  <td>{{list.numBefore - list.num}}{{list.unit}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- button -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button
                      type="button"
                      class="btn btn-success"
                      data-toggle="modal"
                      data-target="#exampleModal"
                      @click="status=1"
                    >审核通过</button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      data-toggle="modal"
                      data-target="#exampleModal"
                      @click="status=2"
                    >审核失败</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- 模态框 -->
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
      >
        <div class="modal-dialog modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="exampleModalLabel" align="center">填写审核意见</h4>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <textarea class="form-control" id="message-text" rows="5" v-model="opinion"></textarea>
                  <p class="err-text" :class="{'err-text-or': remarkErr}">由汉字组成，不超过200个汉字</p>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                @click="sub()"
                :data-dismiss="!remarkErr? 'modal': ''"
              >确认</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal">取消</button>
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
      opinion: "",
      list: {},
      id: this.$route.query.id,
      status: 0,
      remarkErr: false
    };
  },
  watch: {
    opinion: function() {
      this.remarkErr = /^[\u4e00-\u9fa5]{1,200}$/.test(this.opinion)
        ? false
        : true;
    }
  },
  methods: {
    sub() {
      if (!this.remarkErr && this.opinion != "") {
        const PARAMS = {
          opinion: this.opinion,
          status: this.status,
          examineId: 1,
          id: this.id,
          skuId: this.list.skuId,
          num: this.list.num,
          warehousesId: this.list.warehousesId
        };
        this.$axios
          .post(`${this.$root.urlPath.MJK}/api/1/wh/stock/now/update`, PARAMS)
          .then(res => {
            if (res.data.code == 200) {
              //成功
              this.opinion = "";
              location.href = `${this.$root.urlPath.SCM}/warehouse/invlist`;
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
    getdetail() {
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/stock/detail/${this.id}`)
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
