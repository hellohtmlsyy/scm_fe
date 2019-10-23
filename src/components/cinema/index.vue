<template>
  <div class="row cinema">
    <div class="col-lg-12">
      <!-- 影院管理 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          影院管理
          <a
            href="/cinema/add"
            role="button"
            class="btn btn-success btn-xs pull-right"
          >✚&nbsp;新增影院</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="cinemaid" class="col-sm-2 control-label">影院ID</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="cinemaid" v-model.trim="id" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="name" class="col-sm-2 control-label">影院名称</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="name" v-model.trim="name" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="zzbId" class="col-sm-2 control-label">专资办ID</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="zzbId" v-model.trim="zzbId" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="shopowner" class="col-sm-2 control-label">店长名称</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="shopowner" v-model.trim="shopowner" />
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">省份</label>
                  <div class="col-sm-10">
                    <label class="checkbox-inline">
                      <input type="checkbox" id="all" @click="checkAll($event)" />全部
                    </label>
                    <label class="checkbox-inline" v-for="(item,index) in province" :key="index">
                      <input
                        name="sub"
                        class="checkItem"
                        type="checkbox"
                        v-model="checkData"
                        :value="item.id"
                      />
                      {{item.provinceShortName}}
                    </label>
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
      <!-- list -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">影院信息列表
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
                  <th>影院ID</th>
                  <th>影院名称</th>
                  <th>专资办ID</th>
                  <th>店长</th>
                  <th>创建时间</th>
                  <th>影院状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.zzbCode}}</td>
                  <td>{{item.lobbyVolume}}</td>
                  <td>{{item.createTime}}</td>
                  <td>{{item.status}}</td>
                  <td>
                    <div class="dis-flex">
                      <a
                        :href="'/warehouse/edit?type=modify&id='+item.id"
                        role="button"
                        class="btn btn-info btn-sm"
                      >
                        <i class="fa fa-pencil"></i> 编辑
                      </a>
                      <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        data-toggle="modal"
                        data-target="#whdel"
                        :data-whatever="item.id"
                        @click="nowIndex=index;delid=item.id"
                      >
                        <i class="fa fa-trash-o"></i> 删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 分页 -->
          <scm-pagination :totalPage="totalPage" @pagesClick="getpagelist" v-show="totalPage>1"></scm-pagination>
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
            <div class="modal-body">确认要删除吗？</div>
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
      id: null,
      name: '',
      zzbcode: null,
      shopowner: '',
      contractStime: "", //开始时间
      contractEtime: "", //结束时间
      province: [], //地区
      district: "朝阳",
      region: [], //地区
      cityArr: [], //城市
      districtArr: [], //区
      checkData: [], //地区id
      list: [], //数据
      nowIndex: "", //传递删除用户的下标
      delid: "", //删除id
      page: 1, //当前页数
      limit: 10, //每页条数
      totalPage: 0 //总页数
    };
  },
  watch: {
    // 监视双向绑定的数据数组
    checkData: {
      handler() {
        // 数据数组有变化将触发此函数
        if (this.checkData.length == this.province.length) {
          document.querySelector("#all").checked = true;
        } else {
          document.querySelector("#all").checked = false;
        }
      },
      deep: true // 深度监视
    }
  },
  methods: {
    getpagelist(page) {
      this.page = page;
      this.getlist(page);
    },
    checkAll(e) {
      // 点击全选事件函数
      var checkObj = document.querySelectorAll(".checkItem"); // 获取所有checkbox项
      if (e.target.checked) {
        // 判定全选checkbox的勾选状态
        for (var i = 0; i < checkObj.length; i++) {
          if (!checkObj[i].checked) {
            // 将未勾选的checkbox选项push到绑定数组中
            this.checkData.push(checkObj[i].value);
          }
        }
      } else {
        // 如果是去掉全选则清空checkbox选项绑定数组
        this.checkData = [];
      }
    },
    search() {
      //搜索
      let arr = $("input[type=checkbox]");
      let checkErr = [];
      for (let index = 0; index < arr.length; index++) {
        if (arr[index].checked == true) {
          checkErr.push(arr[index].checked);
        }
      }    
      this.page = 1;
      this.getlist(this.page);
      // }
    },
    del() {
      //删除数据
      this.$axios
        .post(`${this.$root.urlPath.MJK}/api/2/cinema/deleteCinema`, {id: this.delid} )
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list.splice(this.nowIndex, 1);
            layer.msg("删除成功");
          } else if (res.data.code == 1) {
            //失败
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getlist() {
      //获取list
      let params = {
        page: this.page,
        limit: this.limit,
        name: this.wh_name,
        type: this.typeid,
      };
      // type ? (params["type"] = type) : "";
      this.checkData.length > 0 && this.checkData.length != this.province.length
        ? (params["provinceId"] = this.checkData + "")
        : "";
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/2/cinema/listCinema`, {
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
    getprovince() {
      //获取地区
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/warehouse/province`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.province = res.data.data;
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
    this.getlist(this.page); //list数据
    this.getprovince(); //获取地区
  }
};
</script>
<style scoped>
.checkbox-inline {
  margin-left: 0;
  margin-right: 10px;
}
</style>