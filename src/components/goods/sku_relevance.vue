<template>
  <div class="row inv-list">
    <div class="col-lg-12">
      <!-- sku关联 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="table-responsive col-sm-6">
              <div class="panel-heading clearfix">选择SKU</div>
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>选择</th>
                    <th>SKU ID</th>
                    <th>SKU名称</th>
                    <th>基本单位</th>
                    <th class="last"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in list" :key="index">
                    <td>
                      <input
                        type="radio"
                        name="sku1"
                        :id="item.id"
                        :value="item.name"
                        @click="sku1Id=item.id;sku1Name=item.name;sku1Unit=item.unit"
                      />
                    </td>
                    <td>{{item.id}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.unit}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive col-sm-6">
              <div class="panel-heading clearfix">选择SKU</div>
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>选择</th>
                    <th>SKU ID</th>
                    <th>SKU名称</th>
                    <th>基本单位</th>
                    <th class="last"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in list" :key="index">
                    <td>
                      <input
                        type="radio"
                        name="sku2"
                        :id="item.id"
                        :value="item.name"
                        @click="sku2Id=item.id;sku2Name=item.name;sku2Unit=item.unit"
                      />
                    </td>
                    <td>{{item.id}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.unit}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- 关联 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">已选商品</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal" align="center">
                <div class="form-group">
                  <div class="col-sm-5">
                    <input type="number" class v-model="sku1Num" min="1" />
                    <span>{{sku1Unit}} {{sku1Name}}</span>
                  </div>
                  <div class="col-sm-2">
                    <button type="button" class="btn btn-success">=</button>
                  </div>
                  <div class="col-sm-5">
                    <input type="number" class v-model="sku2Num" min="1" />
                    <span>{{sku2Unit}} {{sku2Name}}</span>
                  </div>
                </div>
                <div class="form-group">
                  <div
                    class="col-sm-12"
                    v-show="sku1Name"
                  >{{sku1Num}}{{sku1Unit}}{{sku1Name}} = {{sku2Num}}{{sku2Unit}}{{sku2Name}}</div>
                </div>
                <div class="form-group">
                  <button type="button" class="btn btn-success col-sm-12" @click="sub()">关联</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- SKU关联关系记录 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">SKU关联关系记录</div>
        <div class="panel-body">
          <div class="row">
            <form class="form-horizontal">
              <div class="col-lg-12" v-for="(item,index) in rellist" :key="index">
                <div class="form-group">
                  <div
                    class="col-sm-9"
                  >{{item.sku1Num}}{{item.sku1Unit}}{{item.sku1Name}}={{item.sku2Num}}{{item.sku2Unit}}{{item.sku2Name}}</div>
                  <div class="col-sm-2">
                    <button
                      type="button"
                      class="btn btn-danger"
                      data-toggle="modal"
                      @click="sku1Idr=item.sku1Id;sku2Idr=item.sku2Id"
                      data-target="#whdel"
                    >解除绑定</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- 模态框 -->
      <div
        class="modal fade"
        id="whdel"
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
              <h4 class="modal-title" id="exampleModalLabel">提示</h4>
            </div>
            <div class="modal-body">确认要解除绑定吗？</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" @click="del()" data-dismiss="modal">确认</button>
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
      list: [], //sku列表
      rellist: [], //关联sku列表
      // sku关联参数
      sku1Id: null,
      sku1Num: 1,
      sku1Name: "",
      sku1Unit: "",
      sku2Id: null,
      sku2Num: 1,
      sku2Name: "",
      sku2Unit: "",
      // sku解绑参数
      sku1Idr: null,
      sku2Idr: null
    };
  },
  methods: {
    getskulist() {
      //获取list
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/sku/listSku`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list = res.data.data;
            if (res.data.data.length == 0) {
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
    getrellist() {
      // 获取sku关联list
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/sku/listSkuRelevance`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.rellist = res.data.data;
            if (res.data.data.length == 0) {
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
    sub() {
      //关联
      if (
        this.sku2Name != "" &&
        this.sku1Num != "" &&
        this.sku1Num != "" &&
        this.sku2Num != ""
      ) {
        if (this.sku1Id != this.sku2Id) {
          let params = {
            sku1Id: this.sku1Id,
            sku2Id: this.sku2Id,
            sku1Name: this.sku1Name,
            sku2Name: this.sku2Name,
            sku1Num: this.sku1Num,
            sku2Num: this.sku2Num,
            sku1Unit: this.sku1Unit,
            sku2Unit: this.sku2Unit
          };
          this.$axios
            .post(`${this.$root.urlPath.MJK}/api/1/sku/addSkuRelevance`, params)
            .then(res => {
              if (res.data.code == 200) {
                //成功
                layer.msg("关联成功");
                this.getrellist();
              } else {
                //失败
                layer.msg(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          layer.msg("请选择不同的关联商品");
        }
      } else {
        layer.msg("请选择需要关联的sku和数量");
      }
    },
    del() {
      let params = {
        sku1Id: this.sku1Idr,
        sku2Id: this.sku2Idr
      };
      this.$axios
        .post(`${this.$root.urlPath.MJK}/api/1/sku/deleteSkuRelevance`, params)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            layer.msg("解除绑定成功");
            this.getrellist();
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
    this.getskulist();
    this.getrellist();
  }
};
</script>
<style scoped>
  thead {
    width: calc(100% - 1em);
  }
  .last {
    width: 17px;
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  tbody {
    display: block;
    height: 200px;
    overflow-y: scroll;
  }
</style>