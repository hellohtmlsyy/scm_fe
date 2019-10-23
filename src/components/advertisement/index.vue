<template>
  <div class="row posad">
    <div class="col-lg-12">
      <div class="panel panel-default">
        <div class="panel-heading clearfix">POS广告配置
          <a
            href="/posad/edit?type=add"
            role="button"
            class="btn btn-success btn-xs pull-right"
          >✚&nbsp;新增配置</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- list -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">POS广告配置列表</div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>广告ID</th>
                  <th>活动名称</th>
                  <th>开始时间</th>
                  <th>结束时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.start_time}}</td>
                  <td>{{item.end_time}}</td>
                  <td>{{item.name}}</td>
                  <td>
                    <a
                      :href="'/posad/edit?type=modify&id='+item.id"
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
import qs from "qs";
export default {
  data() {
    return {
      list: [], //数据
      type: [], //类型
      page: 1, //当前页数
      rows: 10, //每页条数
      totalPage: 0 //总页数
    };
  },
  methods: {
    getpagelist() {
      this.page = 1;
      this.getlist();
    },
    getlist() {
      //获取list
      let params = {
        page: this.page,
        rows: this.rows,
      };
      let that = this;
      $.ajax({
        type:"POST",
        url:`${this.$root.urlPath.MJK}/api/1/pos_ad_list`,
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(params),
        dataType:"json",
        success:function(res){
        console.log(res)
        if (res.code == 200) {
        //成功
            this.list = res.data.data;
            this.totalPage = Math.ceil(res.data.total / this.rows);
            if (res.data.data.length == 0) {
              layer.msg("暂无数据");
            }
        } else {
        //失败
          layer.msg(res.data.msg);
        }
        },
        error:function(err){ 
          console.log(err)
        } 
      })


      // this.$axios
      //   .post(`${this.$root.urlPath.MJK}/api/1/pos_ad_list`, params)
      //   .then(res => {
      //     if (res.data.code == 200) {
      //       //成功
      //       this.list = res.data.data.data;
      //       this.totalPage = Math.ceil(res.data.data.total / this.rows);
      //       if (res.data.data.data.length == 0) {
      //         layer.msg("暂无数据");
      //       }
      //     } else {
      //       //失败
      //       layer.msg(res.data.msg);
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
  },
  mounted() {
    this.getlist(); //list数据
  }
};
</script>
<style scoped></style>