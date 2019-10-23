<template>
  <div class="row wh-manage">
    <div class="col-lg-12">
      <!-- 供应商 添加/编辑 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          供应商 添加/编辑
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
                  <label for="name" class="col-sm-2 control-label">*供应商名称</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="name" v-model.trim="info.name" />
                    <p
                      class="err-text"
                      :class="{'err-text-or': infoErr.nameErr}"
                    >名称为汉字。字母或数字组成，不超过50位</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">*地区</label>
                  <div class="col-sm-2">
                    <select
                      name="input_province"
                      id="input_province"
                      class="form-control"
                      v-model="info.province"
                    >
                      <option
                        v-for="item in region"
                        :value="item.shortName"
                        :key="item.id"
                      >{{item.shortName}}</option>
                    </select>
                  </div>
                  <div class="col-sm-2">
                    <select
                      name="input_city"
                      id="input_city"
                      class="form-control"
                      v-model="info.city"
                    >
                      <option
                        v-for="item in cityArr"
                        :value="item.shortName"
                        :key="item.id"
                      >{{item.shortName}}</option>
                    </select>
                  </div>
                  <div class="col-sm-2">
                    <select
                      name="input_area"
                      id="input_area"
                      class="form-control"
                      v-model="info.district"
                    >
                      <option
                        v-for="item in districtArr"
                        :value="item.shortName"
                        :key="item.id"
                      >{{item.shortName}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="address" class="col-sm-2 control-label">详细地址</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="address"
                      v-model.trim="info.address"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.addressErr}">由汉字组成，不超过100个汉字</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="contact" class="col-sm-2 control-label">联系人</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="contact"
                      v-model.trim="info.contact"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.contactErr}">由汉字组成，不超过50个汉字</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="mobile" class="col-sm-2 control-label">*手机号</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="mobile" v-model.trim="info.mobile" />
                    <p class="err-text" :class="{'err-text-or': infoErr.mobileErr}">手机号为必填，由11位数字组成</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="remark" class="col-sm-2 control-label">备注</label>
                  <div class="col-sm-6">
                    <textarea id="remark" rows="4" class="form-control" v-model.trim="info.remark"></textarea>
                    <p class="err-text" :class="{'err-text-or': infoErr.remarkErr}">由汉字组成，不超过500个汉字</p>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button type="button" class="btn btn-danger" @click="sub()">保存</button>
                  </div>
                </div>
              </form>
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
      info: {
        name: "",
        address: "",
        contact: "",
        mobile: "",
        remark: "",
        province: "北京",
        city: "北京",
        district: "朝阳"
      },
      region: [], //地区
      cityArr: [], //城市
      districtArr: [], //区
      // 输入错误
      infoErr: {
        nameErr: false,
        addressErr: false,
        contactErr: false,
        mobileErr: false,
        remarkErr: false
      },
      id: null,
      type: this.$route.query.type
    };
  },
  watch: {
    prov: function() {
      this.updateCity();
      this.updateDistrict();
    },
    city: function() {
      this.updateDistrict();
    },
    ["info.name"]() {
      this.infoErr.nameErr = /^[\u4e00-\u9fa5A-Za-z0-9]{1,50}$/.test(
        this.info.name
      )
        ? false
        : true;
    },
    ["info.address"]() {
      this.infoErr.addressErr = /^[\u4e00-\u9fa5A-Za-z0-9]{1,100}$/.test(
        this.info.address
      )
        ? false
        : true;
    },
    ["info.contact"]() {
      this.infoErr.contactErr = /^[\u4e00-\u9fa5]{1,50}$/.test(
        this.info.contact
      )
        ? false
        : true;
    },
    ["info.mobile"]() {
      this.infoErr.mobileErr = /^1[34578]\d{9}$/.test(this.info.mobile)
        ? false
        : true;
    },
    ["info.remark"]() {
      this.infoErr.remarkErr = /^.{0,500}$/.test(this.info.remark)
        ? false
        : true;
    }
  },
  methods: {
    updateCity: function() {
      for (var i in this.region) {
        var obj = this.region[i];
        if (obj.shortName == this.info.province) {
          this.cityArr = obj.city;
          break;
        }
      }
      if (this.cityArr != []) {
        this.city = this.cityArr[0].shortName;
      } else {
        this.info.city = "";
      }
    },
    updateDistrict: function() {
      for (var i in this.cityArr) {
        var obj = this.cityArr[i];
        if (obj.shortName == this.info.city) {
          this.districtArr = obj.district;
          break;
        }
      }
      if (
        this.districtArr &&
        this.districtArr.length > 0 &&
        this.districtArr[1].shortName
      ) {
        this.info.district = this.districtArr[1].shortName;
      } else {
        this.info.district = "";
      }
    },
    getregion() {
      //获取地区
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/regionCn/detail`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.region = res.data.data;
            this.updateCity();
            this.updateDistrict();
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
      if (!this.infoErr.nameErr && !this.infoErr.mobileErr) {
        let params = {
          id: this.id,
          name: this.info.name,
          province: this.info.province,
          city: this.info.city,
          district: this.info.district,
          address: this.info.address,
          contact: this.info.contact,
          mobile: this.info.mobile,
          remark: this.info.remark
        };
        this.$axios
          .post(`${this.$root.urlPath.MJK}/api/1/provider/addProvider`, params)
          .then(res => {
            if (res.data.code == 200) {
              if (this.type == "modify") {
                layer.msg("修改成功");
              } else {
                layer.msg("添加成功");
              }
              // 成功后跳转
              window.setTimeout(function() {
                window.location.href = `/goods/supmanage`;
              }, 2000);
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
    getinfo() {
      //获取修改信息
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/provider/getProvider`, {
          params: {
            id: this.$route.query.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.info = res.data.data;
            // this.info.district = res.data.data.district;
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
    this.getregion();
    if (this.type == "modify") {
      //修改仓库信息
      this.id = this.$route.query.id;
      this.getinfo();
    } else {
      //添加仓库
      this.id = null;
    }
  }
};
</script>
