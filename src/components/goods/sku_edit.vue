<template>
  <div class="row wh-manage">
    <div class="col-lg-12">
      <!-- SKU 添加/编辑 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          SKU 添加/编辑
          <a
            href="/goods/skumanage"
            role="button"
            class="btn btn-ordinary btn-xs pull-right"
          >&lt;&lt;返回SKU管理</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="sku-cate" class="col-sm-2 control-label">*SKU分类</label>
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
                  <label for="sku-name" class="col-sm-2 control-label">*SKU名称</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="sku-name"
                      v-model.trim="info.skuName"
                    />
                    <p
                      class="err-text"
                      :class="{'err-text-or': infoErr.nameErr}"
                    >名称由汉字，字母或数字组成，不超过20位</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="sku-code" class="col-sm-2 control-label">*SKU编码</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="sku-code"
                      v-model.trim="info.barcode"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.codeErr}">条码由数字组成，不超过30位</p>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-2 control-label">*SKU基本单位</label>
                  <div class="col-sm-6">
                    <select class="form-control" v-model="info.unit">
                      <option v-for="(item,index) in unitList" :key="index" :value="item">{{item}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="sku-int" class="col-sm-2 control-label">SKU简介</label>
                  <div class="col-sm-6">
                    <textarea id="sku-int" rows="4" class="form-control" v-model.trim="info.intro"></textarea>
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
                  <label for="sku-price" class="col-sm-2 control-label">成本价格</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="sku-price"
                      v-model.trim="info.price"
                    />
                    <p
                      class="err-text"
                      :class="{'err-text-or': infoErr.priceErr}"
                    >价格由数字组成，保留小数点后两位数，长度不超过20</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 供应商 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">供应商</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for class="col-sm-2 control-label">*选择供应商</label>
                  <div class="col-sm-6">
                    <select class="form-control" v-model="supId">
                      <option
                        v-for="(item,index) in sup"
                        :key="index"
                        :value="item.name"
                      >{{item.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label"></label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" v-model.trim="sups" disabled />
                  </div>
                  <button type="button" class="btn btn-success" @click="sups=''">重置</button>
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
                    <button type="button" class="btn btn-danger" @click="sub()">保存</button>
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
              <a href="/goods/skumanage" role="button" class="btn btn-danger">取消</a>
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
        category: "",
        skuName: "",
        barcode: "",
        unit: "",
        intro: "",
        imgUrl: "",
        price: "",
        provider: [],
        sup: ""
      },
      category: [],
      supId: "",
      sups: "",
      suplist: [],
      sup: [],
      unitList: [],
      infoErr: {
        nameErr: false,
        codeErr: false,
        introErr: false,
        priceErr: false
      },
      type: this.$route.query.type,
    };
  },
  watch: {
    supId: function(newval, oldval) {
      this.sups += `${newval},`;
      this.sup.forEach(ele => {
        if (newval == ele.name) {
          this.suplist.push(ele.id);
          this.suplist = Array.from(new Set(this.suplist));
        }
      });
    },
    ["info.skuName"]() {
      this.infoErr.nameErr = /^[\u4e00-\u9fa5A-Za-z0-9]{1,20}$/.test(
        this.info.skuName
      )
        ? false
        : true;
    },
    ["info.barcode"]() {
      this.infoErr.codeErr = /^[0-9]{1,30}$/.test(this.info.barcode)
        ? false
        : true;
    },
    ["info.intro"]() {
      this.infoErr.introErr = /^.{0,500}$/.test(this.info.intro)
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
    }
  },
  methods: {
    getUrl(msg) {
      this.info.imgUrl = msg;
    },
    sub() {
      if (
        this.info.categoryId != "" &&
        this.info.skuName != "" &&
        !this.infoErr.nameErr &&
        this.info.barcode != "" &&
        !this.infoErr.codeErr &&
        this.info.unit != "" &&
        !this.infoErr.introErr &&
        !this.infoErr.priceErr &&
        this.suplist.length > 0
      ) {
        // 检验成功提交
        let params = {
          id: this.type == "add" ? "" : this.$route.query.id,
          categoryId: this.info.categoryId,
          skuName: this.info.skuName,
          barcode: this.info.barcode,
          unit: this.info.unit,
          intro: this.info.intro,
          imgUrl: this.info.imgUrl,
          price: this.info.price,
          providerIdList: this.suplist + "" //供应商id;
        };
        this.$axios
          .post(`${this.$root.urlPath.MJK}/api/1/sku/saveSku`, params)
          .then(res => {
            if (res.data.code == 200) {
              if (this.type == "modify") {
                layer.msg("修改成功");
              } else {
                layer.msg("添加成功");
              }
              // 成功后跳转
              window.setTimeout(function() {
                window.location.href = `/goods/skumanage`;
              }, 2000);
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
        .get(`${this.$root.urlPath.MJK}/api/1/sku/getSku`, {
          params: {
            id: this.$route.query.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.info = res.data.data;
            res.data.data.providerList.forEach(ele => {
              this.sups += `${ele.name},`;
              this.suplist.push(ele.id);
            });
          } else {
            //失败
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getprovider() {
      //获取供应商
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/provider/listProvider`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.sup = res.data.data;
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
          } else {
            //失败
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getunit() {
      //获取单位
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/sku/listUnit`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.unitList = res.data.data;
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
    this.getprovider();
    this.gettype();
    this.getunit();
    if (this.type == "modify") {
      //修改仓库信息
      this.getinfo();
    } else {
      //添加仓库
    }
  }
};
</script>
<style scoped>
  .headImg {
    width: 140px;
    height: 140px;
    vertical-align: middle;
  }
</style>
