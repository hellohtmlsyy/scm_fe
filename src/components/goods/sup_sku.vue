<template>
  <div class="row inv-list">
    <div class="col-lg-12">
      <!-- sup_sku -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          供应商SKU对照表
          <a
            href="/goods/supmanage"
            role="button"
            class="btn btn-ordinary btn-xs pull-right"
          >&lt;&lt;返回供应商管理</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="name" class="col-sm-2 control-label">SKU名称</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="name" v-model.trim="name" />
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
      <!-- 结果展示表格 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">{{providerName}}</div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>SKU ID</th>
                  <th>SKU图片</th>
                  <th>条码</th>
                  <th>SKU信息</th>
                  <th>基本单位</th>
                  <th>SKU分类</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>
                    <img id="list_img" :src="item.imgUrl" alt />
                  </td>
                  <td>{{item.code}}</td>
                  <td>
                    <span>{{item.name}}</span>
                    <div>
                      <span>分类：{{item.categoyName}}</span>
                      <br />
                      <span>简介：{{item.intro}}</span>
                    </div>
                  </td>
                  <td>{{item.unit}}</td>
                  <td>{{item.categoryName}}</td>
                  <td>{{item.createTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</td>
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
      list: [], //list数据
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      name: "", //名称
      providerName: "",
      id: this.$route.query.id
    };
  },
  methods: {
    getpagelist(page) {
      this.pageNum = page;
      this.getlist();
    },
    search() {
      if (this.name != "") {
        this.pageNum = 1;
        this.getlist2();
      } else {
        layer.open({
          content: "请输入需要搜索的条件",
          title: "提示"
        });
      }
    },
    getlist() {
      //获取list
      let params = {
        id: this.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/provider/skuProvider`, {
          params: params
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list = res.data.data.list;
            this.totalPage = Math.ceil(res.data.data.total / this.pageSize);
            this.providerName = res.data.data.providerName;
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
    getlist2() {
      //获取list
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        skuName: this.name,
        pid: this.id
      };
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/provider/listSkuProvider`, {
          params: params
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list = res.data.data.list;
            this.totalPage = Math.ceil(res.data.data.total / this.pageSize);
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
    }
  },
  mounted() {
    this.getlist();
  }
};
</script>
<style scoped>
</style>