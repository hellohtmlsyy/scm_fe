<template>
  <div class="row inv-list">
    <div class="col-lg-12">
      <!-- list -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          商品分类管理
          <button
            type="button"
            class="btn btn-success btn-xs pull-right"
            data-toggle="modal"
            data-target="#exampleModal"
            @click="goodsName='';id=null"
          >✚&nbsp;添加商品分类</button>
        </div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>名称</th>
                  <th>添加时间</th>
                  <th>商品数量</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.createTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</td>
                  <td>{{item.count}}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-info btn-sm"
                      data-toggle="modal"
                      data-target="#exampleModal"
                      @click="goodsName=item.name;id=item.id"
                    >
                      <i class="fa fa-pencil"></i> 编辑
                    </button>
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 模态框 -->
      <div
        class="modal fade"
        id="exampleModal"
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
              <h4 class="modal-title" id="exampleModalLabel">商品分类管理</h4>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="goods-name" class="control-label">*分类名称</label>
                  <div class>
                    <input
                      type="text"
                      class="form-control"
                      id="goods-name"
                      v-model.trim="goodsName"
                    />
                    <p class="err-text" :class="{'err-text-or': nameErr}">由汉字组成，不超过20位</p>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" @click="sub()" :data-dismiss="!nameErr? 'modal': ''">确认</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal">取消</button>
            </div>
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
import qs from 'qs'
export default {
  data() {
    return {
      id: null, //删除/编辑id
      nowIndex: "", //传递删除用户的下标
      goodsName: "", //商品名称
      list: [], //list数据
      nameErr: false
    };
  },
  watch: {
    goodsName: function() {
      this.nameErr = /^[\u4e00-\u9fa5]{1,20}$/.test(this.goodsName)
        ? false
        : true;
    }
  },
  methods: {
    del() {
      //删除sku
      this.$axios({
        url: `${this.$root.urlPath.MJK}/api/1/goods/deleteGoodsCategory`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data:qs.stringify({ id: this.id })
      })
        // .post(, )
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
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/goods/listGoodsCategory`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list = res.data.data;
            if (res.data.data == []) {
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
      if (!this.nameErr && this.goodsName != '') {
        let params = {
          id: this.id,
          name: this.goodsName,
          status: 1
        };
        let type = this.id == null ? "添加" : "修改";
        this.$axios
          .post(
            `${this.$root.urlPath.MJK}/api/1/goods/saveGoodsCategory`,
            params
          )
          .then(res => {
            if (res.data.code == 200) {
              //成功
              layer.msg(`${type}成功`);
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
    this.getlist();
  }
};
</script>
<style scoped>

</style>