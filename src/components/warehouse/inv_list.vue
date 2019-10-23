<template>
  <div class="row inv-list">
    <div class="col-lg-12">
      <!-- 盘点单列表 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">盘点单列表</div>
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
                  <label for="inv-number" class="col-sm-2 control-label">单号</label>
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
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">按状态</label>
                  <div class="col-sm-10">
                    <input
                      class="btn btn-sm"
                      :class="tabClass == index? 'btn-info': 'btn-secondary'"
                      type="button"
                      :value="item.valueName"
                      v-for="(item,index) in status"
                      @click="cutTabClick(index,item.valueId)"
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
        <div class="panel-heading clearfix">盘点单列表</div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive" id="print">
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
                  <th>审核意见</th>
                  <th>创建时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>{{item.orderNum}}</td>
                  <td>{{item.warehousesName}}</td>
                  <td>{{item.operatorName}}</td>
                  <td>{{item.typeName}}</td>
                  <td>{{item.optionTypeName}}</td>
                  <td>{{item.remarks}}</td>
                  <td>{{item.opinion}}</td>
                  <td>{{item.createAt|convertTime('yyyy-MM-dd hh:mm:ss')}}</td>
                  <td>
                    <a
                      href="javascript:;"
                      class="btn btn-success btn-xs disabled"
                      :class="item.status == 0? 'btn-warning': (item.status==1? 'btn-success':'btn-danger')"
                      role="button"
                    >{{item.status==0? '待审批':(item.status==1? '审批通过':'审批驳回')}}</a>
                  </td>
                  <td>
                    <div class="dis-flex">
                      <a
                        :href="'/warehouse/invdetail?id='+item.id"
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
import qs from "qs";
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
      type: 0, //盘点
      orderNum: "", //单号
      status: [], //状态
      contractStime: "", //开始时间
      contractEtime: "", //结束时间
      typeOptionId: 0 //盘点
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
      // 根据类型发请求获取对应数据
      if (id != "undefined") {
        this.getlist(1, id);
      }
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
        type: 0,
        status: sid,
        contractStime: this.contractStime,
        contractEtime: this.contractEtime
      };
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/stock/search`, {
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
    getstatus() {
      //获取状态
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/stock/status`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.status = res.data.data;
            let all = {
              valueName: "全部"
            };
            this.status.unshift(all);
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
    this.getstatus();
    this.getwhinfoAll();
    this.getlist();
  }
};
</script>
