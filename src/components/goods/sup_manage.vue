<template>
  <div class="row inv-list">
    <div class="col-lg-12">
      <!-- 供应商管理 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          供应商管理
          <a
            href="/goods/supedit?type=add"
            role="button"
            class="btn btn-success btn-xs pull-right"
          >✚&nbsp;添加供应商</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="name" class="col-sm-2 control-label">供应商名称</label>
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

      <!-- list -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">供应商列表</div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>供应商</th>
                  <th>地址</th>
                  <th>联系人</th>
                  <th>备注</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.province}}{{item.city}}{{item.district}}{{item.address}}</td>
                  <td>{{item.contact}} {{item.mobile}}</td>
                  <td>{{item.remark}}</td>
                  <td>
                    <div class="dis-flex">
                      <a
                        :href="'/goods/supsku?id='+ item.id"
                        role="button"
                        class="btn btn-info btn-sm"
                      >SKU对应关系</a>
                      <a
                        :href="'/goods/supedit?type=modify&id='+ item.id"
                        role="button"
                        class="btn btn-info btn-sm"
                      >
                        <i class="fa fa-pencil"></i> 编辑
                      </a>
                      <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        data-toggle="modal"
                        data-target="#exampleModal2"
                        :data-whatever="'id'"
                        @click="nowIndex=index;id=item.id"
                      >
                        <i class="fa fa-trash-o"></i> 删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModal2"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel2"
      >
        <div class="modal-dialog modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="exampleModalLabel2">提示</h4>
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
export default {
  data() {
    return {
      id: null, //删除/编辑id
      nowIndex: "", //传递删除用户的下标
      list: [], //list数据
      pageNum: 1,
      pageSize: 10,
      name: "" //名称
    };
  },
  methods: {
    search() {
      if (this.name != "") {
        this.pageNum = 1;
        this.getlist();
      } else {
        layer.open({
          content: "请输入需要搜索的条件",
          title: "提示"
        });
      }
    },
    del() {
      //删除
      this.$axios
        .post(`${this.$root.urlPath.MJK}/api/1/provider/deleteProvider`, {
          id: this.id
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            layer.msg("删除成功");
            this.list.splice(this.nowIndex, 1);
          } else {
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
        name: this.name
      };
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/provider/listProvider`, {
          params: params
        })
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
    }
  },
  mounted() {
    this.getlist();
  }
};
</script>