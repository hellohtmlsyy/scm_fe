<template>
  <div class="row wh-manage">
    <div class="col-lg-12">
      <!-- 商品 添加/编辑 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          商品 添加/编辑
          <a
            href="/goods/manage"
            role="button"
            class="btn btn-ordinary btn-xs pull-right"
          >&lt;&lt;返回商品管理</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="sku-cate" class="col-sm-2 control-label">*商品分类</label>
                  <div class="col-sm-6">
                    <select class="form-control" v-model="info.categoryId">
                      <option
                        v-for="(item,index) in category"
                        :key="index"
                        :value="item.id"
                      >{{item.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="name" class="col-sm-2 control-label">*商品名称</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="name" v-model.trim="info.goodsName" />
                    <p
                      class="err-text"
                      :class="{'err-text-or': infoErr.nameErr}"
                    >名称由汉字、字母或数字组成，不超过20位</p>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-2 control-label">*SKU关联</label>
                  <div class="col-sm-6">
                    <select class="form-control" v-model="info.skuId">
                      <option
                        v-for="(item,index) in skulist"
                        :value="item.id"
                        :key="index"
                      >{{item.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="volume" class="col-sm-2 control-label">商品体积</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="volume" v-model.trim="info.volume" />
                    <p class="err-text"  :class="{'err-text-or': infoErr.volumeErr}">体积为数字组成，保留小数点后两位数，长度不超过20</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="weight" class="col-sm-2 control-label">商品重量</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="sku-unit"
                      v-model.trim="info.weight"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.weightErr}">重量为数字组成，保留小数点后两位数，长度不超过20</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="intro" class="col-sm-2 control-label">商品简介</label>
                  <div class="col-sm-6">
                    <textarea id="intro" rows="4" class="form-control" v-model.trim="info.intro"></textarea>
                    <p class="err-text" :class="{'err-text-or': infoErr.introErr}">不超过500个汉字</p>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-2 control-label">商品图片</label>
                  <div class="col-sm-10">
                    <cropper @imgUrl="getUrl" :headImg="info.imgUrl" class="headImg">
                    </cropper>
                    <p class="text-danger">注：宽500*高500像素，大小在120KB以内，要求JPG、PNG、GIF格式。</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="price" class="col-sm-2 control-label">*销售参考价格</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="price" v-model.trim="info.price" />
                    <p class="err-text" :class="{'err-text-or': infoErr.priceErr}">价格为数字组成，保留小数点后两位数，长度不超过20</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">状态</label>
                  <div class="col-sm-6">
                    <label class="radio-inline" v-for="(item,index) in status" :key="index">
                      <input
                        type="radio"
                        name="goods-state"
                        :value="item.name"
                        v-model="info.status"
                      />
                      {{item.name}}
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="sub()"
                    >保存</button>
                    <button
                      type="button"
                      class="btn btn-success"
                      data-toggle="modal"
                      data-target="#exampleModal"
                    >取消</button>
                  </div>
                </div>
              </form>
            </div>
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
              <h4 class="modal-title" id="exampleModalLabel">提示</h4>
            </div>
            <div class="modal-body">页面发生修改，是否保存？</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" data-dismiss="modal" @click="sub()">保存</button>
              <a href="/goods/manage" role="button" class="btn btn-danger">取消</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import cropper from "@/components/common/upload-img.vue";
export default {
  components: {
    cropper
  },
  data() {
    return {
      info: {
        categoryId: "",
        skuId: "",
        goodsName: "",
        skuId: "",
        volume: "",
        weight: "",
        intro: "",
        imgUrl: "",
        price: "",
        status: "上架"
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
      category: [], //商品分类
      skulist: [], //skulist
      supId: "",
      sups: "",
      suplist: [],
      sup: [],
      infoErr: {
        nameErr: false,
        volumeErr: false,
        weightErr: false,
        introErr: false,
        priceErr: false
      },
      type: this.$route.query.type,
    };
  },
  watch: {
    supId: function(newval, oldval) {
      if (this.sups != "") {
        this.sups += `,`;
        this.sups += `${newval},`;
      } else {
        this.sups += `${newval},`;
      }
      this.sup.forEach(ele => {
        if (newval == ele.name) {
          this.suplist.push(ele.name);
          this.suplist = Array.from(new Set(this.suplist));
        }
      });
    },
    ["info.goodsName"]() {
      this.infoErr.nameErr = /^[\u4e00-\u9fa5A-Za-z0-9]{1,20}$/.test(
        this.info.goodsName
      )
        ? false
        : true;
    },
    ["info.volume"]() {
      this.infoErr.volumeErr = 
      /^(([0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/.test(
          this.info.volume
        ) ||
        (/^\d{0,20}$/.test(this.info.volume))
        ? false
        : true;
    },
    ["info.weight"]() {
      this.infoErr.weightErr = 
      /^(([0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/.test(
          this.info.weight
        ) ||
        (/^\d{0,20}$/.test(this.info.weight))
        ? false
        : true;
    },
    ["info.price"]() {
      this.infoErr.priceErr =
        /^(([0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/.test(
          this.info.price
        ) ||
        (/^\d{0,20}$/.test(this.info.price) &&
          this.info.price.length < 20 &&
          this.info.price.length >= 0)
          ? false
          : true;
    },
    ["info.intro"]() {
      this.infoErr.introErr = /^.{0,500}$/.test(this.info.intro)
        ? false
        : true;
    },
  },
  methods: {
    getUrl(msg) {
      this.info.imgUrl = msg;
    },
    sub() {
      if (
        this.info.categoryId != "" &&
        !this.infoErr.nameErr && !this.infoErr.volumeErr && !this.infoErr.weightErr && !this.priceErr
        && this.info.skuId != "" 
      ) {
        // 检验成功提交
        let params = {
          id: this.type == "add" ? "" : this.$route.query.id,
          categoryId: this.info.categoryId,
          goodsName: this.info.goodsName,
          skuId: this.info.skuId,
          volume: this.info.volume,
          weight: this.info.weight,
          intro: this.info.intro,
          imgUrl: this.info.imgUrl,
          price: this.info.price,
          status: this.info.status == "上架" ? 1 : 0
        };
        this.$axios
          .post(`${this.$root.urlPath.MJK}/api/1/goods/saveGoods`, params)
          .then(res => {
            if (res.data.code == 200) {
              if (this.type == "modify") {
                layer.msg("修改成功");
              } else {
                layer.msg("添加成功");
              }
              // 成功后跳转
              window.setTimeout(function() {
                window.location.href = `/goods/manage`;
              })
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
          content: "带*的为必填，请补充内容后保存",
          title: "提示"
        });
      }
    },
    getinfo() {
      //获取修改信息
      this.$axios
        .post(`${this.$root.urlPath.MJK}/api/1/goods/getGoods`, {
          id: this.$route.query.id
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.info = res.data.data;
            if (res.data.data.status == 1) {
              this.info.status = "上架";
            } else {
              this.info.status = "下架";
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
    getcategory() {
      //获取分类
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/goods/listGoodsCategory`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.category = res.data.data;
          } else {
            //失败
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getskulist() {
      //获取skulist
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/sku/listSku`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.skulist = res.data.data;
          } else {
            //失败
            console.log(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.getcategory();
    this.getskulist();
    if (this.type == "modify") {
      //修改信息
      this.getinfo();
    } else {
      //添加
    }
  }
};
</script>
