<template>
  <div class="row wh-stock">
    <div class="col-lg-12">
      <!-- 实时库存 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">实时库存
          <a
            href="/warehouse/operation"
            role="button"
            class="btn btn-warning btn-xs pull-right"
          >库存盘点</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for class="col-sm-2 control-label">选择仓库</label>
                  <div class="col-sm-6">
                    <select name="wh_name" id="wh_name" class="form-control" v-model="warehousesId">
                      <option
                        v-for="(item,index) in whinfoAll"
                        :value="item.id"
                        :key="index"
                      >{{item.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">SKU名称</label>
                  <div class="col-sm-6">
                    <select class="form-control" v-model="sku_selected">
                      <option
                        v-for="(item,index) in skulist"
                        :value="item.id"
                        :key="index"
                      >{{item.name}}</option>
                    </select>
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
          <!-- 分类搜索 -->
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">按分类</label>
                  <div class="col-sm-10">
                    <input
                      class="btn btn-sm"
                      :class="tabClass == index? 'btn-info': 'btn-secondary'"
                      type="button"
                      v-model="item.name"
                      v-for="(item,index) in category"
                      @click="cutTabClick(index,item.name)"
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
        <div class="panel-heading clearfix">
          库存列表
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
                  <th>仓库名称</th>
                  <th>名称</th>
                  <th>存量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.wname}}</td>
                  <td>{{item.sname}}</td>
                  <td>
                    {{item.num}}&nbsp;
                    <button
                      type="button"
                      class="btn btn-ordinary btn-xs"
                    >{{item.unit}}</button>
                  </td>
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
                json_data: [], //导出数据
                currentPage: 1,
                totalPage: 0,
                page: 1, //当前页数
                limit: 10, //每页数量
                tabClass: 0,
                category: [],
                list: [], //list列表
                skulist: [], //sku名称list
                whinfoAll: [], //仓库名称
                warehousesId: null,
                sku_selected: "",
                categoryi: "",
                type: 0
            };
        },
        methods: {
            cutTabClick(index, val) {
                //tab切换
                this.tabClass = index;
                // 根据类型发请求获取对应数据
                if (val == "全部") {
                    this.type = 0;
                    this.getlist(1, this.page);
                } else {
                    this.category.forEach(ele => {
                        if (val == ele.name) {
                            this.type = ele.id;
                        }
                    });
                    this.getlist(1, this.page);
                }
            },
            search() {
                //搜索
                if (this.warehousesId || this.sku_selected != '') {
                  this.page = 1;
                  this.getlist(this.page);
                } else {
                  layer.open({
                      content: '请选择搜索条件',
                      title: '提示'
                  })
                }
            },
            getlist(p, type) {
                //获取list数据
                let params = {
                    warehousesId: this.warehousesId,
                    skuId: this.sku_selected
                };
                this.type != 0 ? (params["type"] = this.type) : "";
                this.$axios
                    .get(`${this.$root.urlPath.MJK}/api/1/wh/stock/now`, {
                        params: params
                    })
                    .then(res => {
                        if (res.data.code == 200) {
                            //成功
                            this.list = res.data.data;
                            for (var i = 0; i < res.data.data.length; i++) {
                                let obj = {};
                                let ele = res.data.data[i];
                                obj["仓库名称"] = ele.wname;
                                obj["名称"] = ele.sname;
                                obj["存量"] = ele.num + ele.unit;
                                this.json_data.push(obj);
                            }
                            if (res.data.data.length == 0) {
                                layer.msg('暂无数据');
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
            getskulist() {
                this.$axios
                    .get(`${this.$root.urlPath.MJK}/api/1/sku/listSku`)
                    .then(res => {
                        if (res.data.code == 200) {
                            //成功
                            this.skulist = res.data.data;
                        } else {
                            //失败
                            layer.msg(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            getwhinfoAll() {
                //获取仓库名称
                this.$axios
                    .get(`${this.$root.urlPath.MJK}/api/1/wh/warehouse/info/all`)
                    .then(res => {
                        if (res.data.code == 200) {
                            //成功
                            this.whinfoAll = res.data.data;
                        } else {
                            //失败
                            layer.msg(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            gettype() {
                //获取分类
                this.$axios
                    .get(`${this.$root.urlPath.MJK}/api/1/sku/listSkuCategory`)
                    .then(res => {
                        if (res.data.code == 200) {
                            //成功
                            this.category = res.data.data;
                            let all = {
                                name: "全部"
                            };
                            this.category.unshift(all);
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
            this.getlist();
            this.getskulist();
            this.getwhinfoAll();
            this.gettype();
        }
    };
</script>
<style scoped>
    label {
        font-weight: 400;
    }
    
    table,
    td,
    tr,
    th {
        font-size: 13px;
    }
</style>