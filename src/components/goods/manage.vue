<template>
  <div class="row goods-manage">
    <div class="col-lg-12">
      <!-- 商品管理 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          商品管理
          <a
            href="/goods/edit?type=add"
            role="button"
            class="btn btn-success btn-xs pull-right"
          >✚&nbsp;添加商品</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="goods-name" class="col-sm-2 control-label">商品名称</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="goods-name"
                      v-model.trim="goodsName"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="goods-price" class="col-sm-2 control-label">商品价格</label>
                  <div class="col-sm-3">
                    <input
                      type="text"
                      class="form-control"
                      id="goods-price"
                      v-model.trim="startMoney"
                    />
                  </div>
                  <div class="col-sm-3">
                    <input type="text" class="form-control" v-model.trim="endMoney" />
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">添加时间</label>
                  <div class="col-sm-3">
                    <date-picker v-model="startTime" :config="options"></date-picker>
                  </div>
                  <div class="col-sm-3">
                    <date-picker v-model="endTime" :config="options"></date-picker>
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
                      :value="item.name"
                      v-for="(item,index) in status"
                      @click="cutTabClick(index,item.id,0)"
                      :key="index"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">按分类</label>
                  <div class="col-sm-10">
                    <input
                      class="btn btn-sm mb-10"
                      :class="tabClass2 == index? 'btn-info': 'btn-secondary'"
                      type="button"
                      v-model="item.name"
                      v-for="(item,index) in category"
                      @click="cutTabClick(index,item.id,item.name)"
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
        <div class="panel-heading clearfix">商品列表</div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>图片</th>
                  <th>信息</th>
                  <th>状态</th>
                  <th>销售参考价格</th>
                  <th>规格</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>
                    <img id="list_img" :src="item.imgUrl" alt />
                  </td>
                  <td>
                    <span>{{item.name}}</span>
                    <div>
                      <span>商品分类：{{item.category}}</span>
                      <br />
                      <span>简介：{{item.intro}}</span>
                    </div>
                  </td>
                  <td>
                    <a
                      href="javascript:;"
                      class="btn btn-xs disabled"
                      :class="item.status==1? 'btn-danger': 'btn-success'"
                      role="button"
                    >{{item.status==1?'上架':'下架'}}</a>
                  </td>
                  <td>{{item.price}}</td>
                  <td>
                    {{item.weight}}
                    <br />
                    {{item.volume}}
                  </td>
                  <td>
                    <div class="dis-flex">
                      <a
                        :href="'/goods/edit?type=modify&id='+item.id"
                        role="button"
                        class="btn btn-info btn-sm"
                      >
                        <i class="fa fa-pencil"></i> 编辑
                      </a>
                      <!-- <button
                        type="button"
                        class="btn btn-success btn-sm"
                        :class="item.status==0? 'disabled': ''"
                        @click="soldOut(item.id,item.status)"
                      >下架</button> -->
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
      status: [
        {
          name: "上架",
          id: 1
        },
        {
          name: "下架",
          id: 0
        }
      ],
      tabClass: 0,
      tabClass2: 0,
      list: [], //list数据
      category: [], //分类list
      pageNum: 1, //当前页数
      pageSize: 10, //每页条数
      totalPage: 0, //总页数
      startTime: "",
      endTime: "",
      typeid: null,
      statusid: null,
      goodsName: "", //商品名称
      startMoney: "", //小价格
      endMoney: "" //大价格
    };
  },
  methods: {
    getpagelist(page) {
      this.pageNum = page;
      this.getlist();
    },
    search() {
      if (
        this.goodsName != "" ||
        (this.startMoney != "" && this.endMoney != "") ||
        (this.startTime != "" && this.endTime != "")
      ) {
        if (this.startTime > this.endTime) {
          layer.open({
            content: "创建时间不正确，请重新输入",
            title: "提示"
          });
        } else {
          this.pageNum = 1;
          this.getlist();
        }
        if (this.startMoney > this.endMoney) {
          layer.open({
            content: "商品价格不正确，请重新输入",
            title: "提示"
          });
        } else {
          this.pageNum = 1;
          this.getlist();
        }
      } else {
        layer.open({
          content: "请输入需要搜索的条件",
          title: "提示"
        });
      }
    },
    cutTabClick(index, id, t) {
      //分类查找
      if (t == 0) {
        this.tabClass = index;
        this.statusid = id;
      } else {
        this.tabClass2 = index;
        this.typeid = id;
      }
      this.getlist();
    },
    getlist() {
      //获取list
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        goodsName: this.goodsName,
        startMoney: this.startMoney,
        endMoney: this.endMoney,
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.statusid,
        categoryId: this.typeid
      };
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/goods/listGoods`, {
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
    },
    gettype() {
      //获取分类
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/goods/listGoodsCategory`)
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
    soldOut(id, status) {
      //商品下架
      if (status == 1) {
        this.$axios
          .post(`${this.$root.urlPath.MJK}/api/1/goods/soldOut`, {
            id: id
          })
          .then(res => {
            if (res.data.code == 200) {
              //成功
              layer.msg("下架成功");
              this.getlist();
            } else {
              //失败
              layer.msg(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  mounted() {
    this.gettype();
    this.getlist();
  }
};
</script>
<style scoped>
#list_img {
  width: 82px;
  height: 82px;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>