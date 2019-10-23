<template>
  <div class="row out-list">
    <div class="col-lg-12">
      <!-- 出库单列表 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">出库单列表</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label class="col-sm-2 control-label">选择仓库</label>
                  <div class="col-sm-6">
                    <select name="wh_name" id="wh_name" class="form-control" v-model="wh_name">
                      <option v-for="(item,index) in whinfoAll" :value="item.id" :key="index">
                        {{item.name}}
                        <input
                          type="text"
                          class="form-control"
                          v-model="item.id"
                          hidden
                        />
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="out-number" class="col-sm-2 control-label">单号</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="inv-number" v-model.trim="orderNum" />
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">创建时间</label>
                  <div class="col-sm-3">
                    <date-picker v-model="contractStime" :config="options"></date-picker>
                  </div>
                  <div class="col-sm-3">
                    <date-picker v-model="contractEtime" :config="options"></date-picker>
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
      <!-- <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label class="col-sm-2 control-label">按操作</label>
                  <div class="col-sm-10">
                    <input
                      class="btn btn-sm"
                      :class="tabClass == index? 'btn-info': 'btn-secondary'"
                      type="button"
                      :value="item.valueName"
                      v-for="(item,index) in type"
                      @click="cutTabClick(index,item.valueId)"
                      :key="index"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> -->
      <!-- list -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">出库单列表</div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>单号</th>
                  <th>仓库</th>
                  <th>操作人</th>
                  <th>类型</th>
                  <th>操作类型</th>
                  <th>操作备注</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>{{item.checkoutAliasOrderId}}</td>
                  <td>{{item.whName}}</td>
                  <td>{{item.name}}</td>
                  <td>出库</td>
                  <td>采购出库</td>
                  <td>{{item.comment}}</td>
                  <td>{{item.createTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</td>
                  <td>
                    <div class="dis-flex">
                      <a
                        :href="'/warehouse/outdetail?id='+item.id"
                        role="button"
                        class="btn btn-info btn-xs"
                      >详情</a>
                      <button type="button" class="btn btn-success btn-xs" v-print="'#print'">打印</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 分页 -->
            <scm-pagination :totalPage="totalPage" @pagesClick="getpagelist" v-show="totalPage>1"></scm-pagination>
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
      options: {
        format: "YYYY-MM-DD hh:mm:ss",
        useCurrent: false,
        locale: "zh-cn",
        tooltips: {
          selectTime: ""
        }
      },
      tabClass: 0,
      wh_name: "", //仓库id
      whinfoAll: [], //仓库
      list: [],
      page: 1, //当前页数
      limit: 10, //每页条数
      totalPage: 0, //总页数
      orderNum: "", //单号
      status: [], //状态
      contractStime: "", //开始时间
      contractEtime: "", //结束时间
      typeOptionId: 0, //盘点
      type: [],
      typeid: null
    };
  },
  methods: {
    getpagelist(page) {
      this.page = page;
      this.getlist();
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
    cutTabClick(index, id) {
      this.tabClass = index;
      this.typeid = id;
      // 根据类型发请求获取对应数据
      this.getlist();
    },
    search() {
      if (
        this.wh_name != "" ||
        this.orderNum != "" ||
        (this.contractStime != "" && this.contractEtime != "")
      ) {
        if (this.contractStime > this.contractEtime) {
          layer.open({
            content: "创建时间不正确，请重新输入",
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
    getlist(p, sid) {
      //获取list数据
      let params = {
        page: this.page,
        limit: this.limit,
        orderNum: this.orderNum,
        warehousesId: this.wh_name,
        contractStime: this.contractStime,
        contractEtime: this.contractEtime
      };
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/checkout`, {
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
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    gettype() {
      //获取类型
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/stock/type/2`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.type = res.data.data;
            let all = {
              valueName: "全部"
            };
            this.type.unshift(all);
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
    this.gettype();
    this.getwhinfoAll();
    this.getlist();
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

.dis-flex {
  display: flex;
}
</style>