<template>
  <div class="row sku-manage">
    <div class="col-lg-12">
      <!-- SKU管理 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          SKU管理
          <a
            href="/goods/skuedit?type=add"
            role="button"
            class="btn btn-success btn-xs pull-right"
          >✚&nbsp;添加SKU</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="skuM_name" class="col-sm-2 control-label">SKU名称</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="skuM_name" v-model="sku_name" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="skuM_code" class="col-sm-2 control-label">SKU条码</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="skuM_code" v-model="sku_code" />
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">创建时间</label>
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
                <!-- <div class="form-group">
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
                </div> -->
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">按分类</label>
                  <div class="col-sm-10">
                    <input
                      class="btn btn-sm"
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
      <div class="panel panel-default">
        <div class="panel-heading clearfix">SKU列表</div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>SKU ID</th>
                  <th>SKU图片</th>
                  <th>条码</th>
                  <th>简介</th>
                  <th>供应商</th>
                  <th>基本单位</th>
                  <th>创建时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>
                    <img id="list_img" :src="item.imgUrl" alt />
                  </td>
                  <td>{{item.code}}</td>
                  <td>{{item.intro}}</td>
                  <td>
                    <span v-for="(option,index) in item.listProvider" :key="index">{{option.name}}</span>
                  </td>
                  <td>{{item.unit}}</td>
                  <td>{{item.createTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</td>
                  <td>{{item.status==1?'正常':'禁用'}}</td>
                  <td>
                    <a
                      :href="'/goods/skuedit?type=modify&id=' + item.id"
                      role="button"
                      class="btn btn-info btn-sm"
                    >
                      <i class="fa fa-pencil"></i> 编辑
                    </a>
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
          name: "全部",
          id: null
        },
        {
          name: "正常",
          id: 1
        },
        {
          name: "禁用",
          id: 0
        }
      ],
      type: [],
      tabClass: 0,
      tabClass2: 0,
      list: [], //list数据
      sku_name: "",//sku名称
      sku_code: "", //SKU条码
      category: [], //分类list
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      startTime: "",
      endTime: "",
      categoryId: 1,
      typeid: null,
      statusid: null
    };
  },
  methods: {
    getpagelist(page) {
      this.pageNum = page;
      this.getlist();
    },
    search() {
      if (
        this.sku_name != "" ||
        this.sku_code != "" ||
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
        this.typeid = id;
      } else {
        this.tabClass2 = index;
        this.statusid = id;
      }
      this.getlist();
    },
    getlist() {
      //获取list
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        skuName: this.sku_name,
        barcode: this.sku_code,
        startTime:this.startTime,
        endTime: this.endTime,
        status: this.typeid,
        categoryId: this.statusid
      };
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/sku/listSkuByForm`, {
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
</style>