<template>
  <div class="row op-body">
    <div class="col-lg-12">
      <form class="form-horizontal">
        <div class="form-group">
          <label for="wh_name" class="col-sm-2 control-label">选择仓库</label>
          <div class="col-sm-6">
            <select name="wh_name" id="wh_name" class="form-control" v-model="wh_id">
              <option
                v-for="(item,index) in whinfoAll"
                :value="item.id"
                :key="index"
              >{{item.name}}</option>
            </select>
          </div>
        </div>
      </form>
      <!-- list -->
      <div class="row heading">
        <div class="col-lg-2" align="center">分类</div>
      </div>
      <div class="row">
        <div class="col-lg-2 col-sm-2 op_category">
          <ul>
            <li
              @click="getlist(index, item.id);category=item.name"
              :class="tabClass == index? 'active': ''"
              v-for="(item, index) in goodsList"
              :key="index"
            >{{item.name}}</li>
          </ul>
        </div>
        <div class="col-lg-9 col-sm-9">
          <ul class="op_list">
            <li v-for="(item, index) in list" :key="index">
              <div class="op_item_l clearfix">
                <img class="oplist-img pull-left" :src="item.imgUrl" alt />
                <div class="pull-left mt-12">
                  <div class="mb-6">{{item.name}}</div>
                  <div>分类-{{category}}</div>
                </div>
              </div>
              <div class="opitem_num">
                <div class="mb-6">现有库存</div>{{item.num || 0}}{{item.unit}}
              </div>
              <div class="op_item_r">
                <div class="text-success mb-6">盘点后库存</div>
                <div>
                  <input type="number" class="num" min="0" v-model="item.stock"/>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-2 col-sm-2 op-btn">
          <div class="col-sm-12" align="center">
            <button type="button" class="btn btn-danger btn-sm mb-6">重置</button>
          </div>
          <div class="col-sm-12" align="center">
            <button
              type="button"
              class="btn btn-success btn-sm"
              data-toggle="modal"
              data-target="#exampleModal"
            >提交{{op_type == 0? '出库':(op_type == 1? '入库': '盘点')}}</button>
          </div>
        </div>
      </div>
      <!-- </div>
      </div>-->
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
              <h4 class="modal-title" id="exampleModalLabel">备注</h4>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <textarea class="form-control" id="message-text" rows="5">{{remark}}</textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">上一步</button>
              <button type="button" class="btn btn-success" data-dismiss="modal" @click="sub()">提交审核</button>
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
      wh_id: "", //仓库名称
      whinfoAll: [], //仓库
      op_type: this.$route.query.type,
      index: 0,
      goodsList: [],
      skuList: [],
      remark: "一箱",
      list: [],
      tabClass: 0,
      stock: null,
      category: '',
    };
  },
  methods: {
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
    getgoodslist() {
      //获取商品list
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/skucategory`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.goodsList = res.data.data;
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
    getlist(index,id) {
      if (this.wh_id != "" ) {
        this.tabClass = index;
        // name: this.wh_name
        //获取右侧list
        this.$axios
          .get(`${this.$root.urlPath.MJK}/api/1/wh/sku/detail/${id}/${this.wh_id}`)
          .then(res => {
            if (res.data.code == 200) {
              //成功
              if (res.data.data.length == 0) {
                layer.msg("暂无数据");
              }
              this.list = res.data.data;
              this.list.forEach(ele => {
                this.$set(ele, 'stock', null);
              });
              console.log(this.list)
            } else {
              //失败
              layer.msg(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
          } else {
            layer.open({
            content: "请选择仓库",
            title: "提示"
          });
      }
    },
  },
  mounted() {
    this.getwhinfoAll();
    this.getgoodslist();
  }
};
</script>
<style scoped>
li {
  list-style: none;
}

.mb-6 {
  margin-bottom: 6px;
}

.mt-12 {
  margin-top: 12px;
}

.op-body .row {
  margin: 0;
}

.op-body .heading {
  background-color: #4f4f4f;
  color: #fff;
  font-size: 14px;
  padding: 12px 0;
}
.op-body .heading .goods {
  text-align: center;
}

.opsku-img {
  width: 22px;
  height: 22px;
}

.oplist-img {
  width: 70px;
  height: 70px;
  margin-right: 8px;
}

.op_category {
  padding: 0;
  position: relative;
}

.op_category ul {
  text-align: center;
  padding: 0;
  margin: 0;
}


.op_category ul li {
  color: #fff;
  text-align: center;
  font-size: 13px;
  border-bottom: 1px solid #d7d7d7;
  padding: 10px 5px;
  background-color: #4f4f4f;
  cursor: pointer;
}

.op_category ul .active {
  background-color: #2a2a2a;
  color: #ec6c00;
}

.op_category ul li:last-child {
  border: none;
}
/* 右侧列表 */
.op_list {
  padding: 0;
  margin: 0;
}

.op_list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d7d7d7;
  background-color: #fff;
  padding: 8px;
}

.opitem_num {
  text-align: center;
  color: #ec6c00;
}
.op_item_l {
  position: relative;
}
.op_item_r {
  text-align: center;
}
.op_item_r .num {
  width: 60px;
  border-radius: 3px;
  border: 1px solid #666;
  text-align: center;
}

.op-btn {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>