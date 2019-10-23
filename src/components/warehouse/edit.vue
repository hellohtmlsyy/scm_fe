<template>
  <div class="row wh-edit">
    <div class="col-lg-12">
      <!-- form -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          仓库 添加/编辑
          <a
            href="/warehouse/index"
            role="button"
            class="btn btn-ordinary btn-xs pull-right"
          >&lt;&lt; 返回仓库管理</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="wh_name" class="col-sm-2 control-label">*仓库名称</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="wh_name" v-model="info.name" />
                    <p
                      class="err-text"
                      :class="{'err-text-or': infoErr.nameErr}"
                    >名称由汉字，字母或数字组成，不超过50位</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="wh_int" class="col-sm-2 control-label">仓库简介</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="wh_int"
                      v-model.trim="info.describes"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.descErr}">不超过100个汉字</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="wh_area" class="col-sm-2 control-label">仓库面积</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="wh_area" v-model.trim="info.area" />
                    <p
                      class="err-text"
                      :class="{'err-text-or': infoErr.areaErr}"
                    >由数字组成，保留小数点后两位数，长度不超过20位</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="wh_area" class="col-sm-2 control-label">*仓库类型</label>
                  <div class="col-sm-6">
                    <select class="form-control" v-model="info.type">
                      <option
                        v-for="(item,index) in type"
                        :key="index"
                        :value="item.valueId"
                      >{{item.valueId==0?'租用':'自有'}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group" v-show="info.type==0">
                  <label for="wh_cost" class="col-sm-2 control-label">*租用费用</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="wh_cost" v-model.trim="info.cost" />
                    <p
                      class="err-text"
                      :class="{'err-text-or': infoErr.costErr}"
                    >由数字组成，保留小数点后两位数，长度不超过20位</p>
                  </div>
                  <span>/年</span>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">*合同周期</label>
                  <div class="col-sm-3">
                    <date-picker v-model="info.contractStime" :config="options"></date-picker>
                    <p
                      class="err-text"
                      :class="{'err-text-or': infoErr.endtimeErr}"
                      v-show="infoErr.endtimeErr"
                    >结束日期不得小于开始日期</p>
                  </div>
                  <div class="col-sm-3">
                    <date-picker v-model="info.contractEtime" :config="options"></date-picker>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 仓库地址 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">仓库地址</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for class="col-sm-2 control-label">*地区</label>
                  <div class="col-sm-2">
                    <select
                      name="input_province"
                      id="input_province"
                      class="form-control"
                      v-model="prov"
                    >
                      <option
                        v-for="item in region"
                        :value="item.shortName"
                        :key="item.id"
                      >{{item.shortName}}</option>
                    </select>
                  </div>
                  <div class="col-sm-2">
                    <select name="input_city" id="input_city" class="form-control" v-model="city">
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
                      v-model="district"
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
                  <label for="wh_address" class="col-sm-2 control-label">*详细地址</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="wh_address"
                      v-model.trim="info.address"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.addressErr}">不超过200个汉字</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 仓库人员 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">仓库人员</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for class="col-sm-2 control-label">*管理员</label>
                  <div class="col-sm-6">
                    <select class="selectpicker form-control" v-model="manageId">
                      <option
                        v-for="(option, index) in users"
                        :value="option.realName"
                        :key="index"
                      >{{option.realName}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label"></label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" v-model.trim="manages" disabled />
                  </div>
                  <button type="button" class="btn btn-success" @click="manages='';manageIds=[]">重置</button>
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
import qs from "qs";
import datePicker from "vue-bootstrap-datetimepicker";
export default {
  components: {
    datePicker
  },
  data() {
    return {
      info: {
        name: "",
        describes: "",
        area: "",
        type: 0,
        cost: "",
        contractStime: "",
        contractEtime: "",
        manageId: "",
        provinceId: "",
        cityId: "",
        districtId: "",
        address: "",
        manageIds: ""
      },
      users: [],
      options: {
        format: "YYYY-MM-DD hh:mm:ss",
        useCurrent: false,
        locale: "zh-cn",
        tooltips: {
          selectTime: ""
        }
      },
      type: [], //类型
      id: this.$route.query.id,
      prov: "北京",
      city: "北京",
      district: "朝阳",
      region: [], //地区
      cityArr: [], //城市
      districtArr: [], //区
      allId: false,
      manageId: "",
      manages: "",
      manageIds: [],
      infoErr: {
        nameErr: false,
        costErr: false,
        descErr: false,
        areaErr: false,
        addressErr: false,
        endtimeErr: false,
        areaErr: false
      }
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
    manageId: function(newval, oldval) {
      this.manages += `${newval},`;
      this.users.forEach(ele => {
        if (newval == ele.realName) {
          this.manageIds.push(ele.id);
          this.manageIds = Array.from(new Set(this.manageIds));
        }
      });
    },
    ["info.name"]() {
      this.infoErr.nameErr = /^[\u4e00-\u9fa5A-Za-z0-9]{1,50}$/.test(
        this.info.name
      )
        ? false
        : true;
    },
    ["info.address"]() {
      this.infoErr.addressErr = /^[\u4e00-\u9fa5]{1,200}$/.test(
        this.info.address
      )
        ? false
        : true;
    },
    ["info.describes"]() {
      this.infoErr.descErr = /^[\u4e00-\u9fa5A-Za-z0-9]{0,100}$/.test(
        this.info.contact
      )
        ? false
        : true;
    },
    ["info.area"]() {
      this.infoErr.areaErr =
        /^(([0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/.test(
          this.info.area
        ) ||
        (/^\d{0,20}$/.test(this.info.area) &&
          this.info.area.length <= 20 &&
          this.info.area.length >= 0)
          ? false
          : true;
    },
    ["info.cost"]() {
      this.infoErr.costErr =
        /^(([0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/.test(
          this.info.cost
        ) ||
        (/^\d$/.test(this.info.cost) &&
          this.info.cost.length <= 20 &&
          this.info.cost.length > 0)
          ? false
          : true;
    },
    ["info.contractEtime"]() {
      this.infoErr.endtimeErr =
        this.info.contractStime < this.info.contractEtime ? false : true;
    }
  },
  methods: {
    updateCity: function() {
      for (var i in this.region) {
        var obj = this.region[i];
        if (obj.shortName == this.prov) {
          this.cityArr = obj.city;
          break;
        }
      }
      if (this.cityArr != []) {
        this.city = this.cityArr[0].shortName;
      } else {
        this.city = "";
      }
    },
    updateDistrict: function() {
      for (var i in this.cityArr) {
        var obj = this.cityArr[i];
        if (obj.shortName == this.city) {
          this.districtArr = obj.district;
          break;
        }
      }
      if (
        this.districtArr &&
        this.districtArr.length > 0 &&
        this.districtArr[1].shortName
      ) {
        this.district = this.districtArr[1].shortName;
      } else {
        this.district = "";
      }
    },
    sub() {
      if(this.info.type==0) this.infoErr.costErr = false;
      if (
        !this.infoErr.nameErr &&
        this.info.name != "" &&
        !this.infoErr.costErr &&
        // this.info.cost != "" &&
        !this.infoErr.stimeErr &&
        this.info.contractStime != "" &&
        !this.infoErr.etimeErr &&
        this.info.contractEtime != "" &&
        !this.infoErr.addressErr &&
        this.info.addressErr != "" &&
        this.manages != ""
      ) {
        this.region.forEach(ele => {
          //获取省市区id
          if (ele.shortName == this.prov) {
            this.info.provinceId = ele.id;
          }
          ele.city.forEach(ele2 => {
            if (ele2.shortName == this.city) {
              this.info.cityId = ele2.id;
            }
            ele2.district.forEach(ele3 => {
              if (ele3.shortName == this.district) {
                this.info.districtId = ele3.id;
              }
            });
          });
          // this.users.forEach(ele => {
          //   //获取管理员id
          //   if (ele.shortName == this.prov) {
          //     this.info.provinceId = ele.id;
          //   }
          // });
        });
        // 检验成功提交
        let params = {
          name: this.info.name,
          type: this.info.type,
          manageId: this.info.manageId,
          contractStime: this.info.contractStime,
          contractEtime: this.info.contractEtime,
          describes: this.info.describes,
          area: this.info.area,
          cost: this.info.cost,
          provinceId: this.info.provinceId,
          cityId: this.info.cityId,
          districtId: this.info.districtId,
          address: this.info.address,
          manageIds: this.manageIds + ""
        };
        if (this.$route.query.type == "add") {
          //新建
          this.$axios
            .post(`${this.$root.urlPath.MJK}/api/1/wh/warehouse/create`, qs.stringify(params))
            .then(res => {
              if (res.data.code == 200) {
                // 成功后跳转仓库管理
                layer.msg("添加成功");
                return;
                window.setTimeout(function() {
                  window.location.href = `/warehouse/index`;
                }, 2000);
              } else {
                //失败
                lyaer.msg(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          //修改保存
          params["id"] = this.info.id;
          this.$axios
            .post(`${this.$root.urlPath.MJK}/api/1/wh/warehouse/edit`, params)
            .then(res => {
              if (res.data.code == 200) {
                // 成功后跳转仓库管理
                layer.msg("修改成功");
                return
                window.setTimeout(function() {
                  window.location.href = `/warehouse/index`;
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
      } else {
        layer.open({
          content: "带*的为必填，请修改内容后保存",
          title: "提示"
        });
      }
    },
    getinfo() {
      //获取修改信息
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/warehouse/detail/${this.id}`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.info = res.data.data;
            this.info.userVO.forEach(ele => {
              this.manages += `${ele.realName},`;
              this.manageIds.push(ele.id);
            });
            this.prov = res.data.data.provinceName;
            this.city = res.data.data.cityName;
            this.district = res.data.data.districtName;
          } else {
            //失败
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    gettype() {
      //获取状态
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/warehouses/type/1`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.type = res.data.data;
          } else {
            //失败
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getusers() {
      //获取管理员list
      this.$axios
        .get(`${this.$root.urlPath.MJK}/api/1/wh/warehouses/allusers`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.users = res.data.data;
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
    this.getregion();
    this.getusers();
    if (this.$route.query.type == "modify") {
      //修改仓库信息
      this.getinfo();
    } else {
      //添加仓库
    }
  }
};
</script>
