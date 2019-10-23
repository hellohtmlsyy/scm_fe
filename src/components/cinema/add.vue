<template>
  <div class="row wh-manage">
    <div class="col-lg-12">
      <!-- 影院信息 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          影院信息
          <a
            href="/cinema/index"
            role="button"
            class="btn btn-ordinary btn-xs pull-right"
          >&lt;&lt;返回影院管理</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="name" class="col-sm-2 control-label">*影院名称</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="name" v-model.trim="info.name" />
                    <p
                      class="err-text"
                      :class="{'err-text-or': infoErr.nameError}"
                    >标题为汉字。字母或数字组成，不超过50位</p>  
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">*所在地</label>
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
                  <label for="zzbcode" class="col-sm-2 control-label">*专资办编码</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="zzbcode" v-model.trim="info.zzbcode" />
                    <p class="err-text" :class="{'err-text-or': infoErr.zzbcodeError}">手机号为必填，由11位数字组成</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="num" class="col-sm-2 control-label">影厅数量/个</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="num" v-model.trim="info.num" />
                    <p class="err-text" :class="{'err-text-or': infoErr.numError}">手机号为必填，由11位数字组成</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="mobile" class="col-sm-2 control-label"></label>
                  <div class="col-sm-9">
                    <!-- table -->
                    <div class="table-responsive">
                      <table class="table table-striped table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>序号</th>
                            <th>影厅类型</th>
                            <th>影院面积/㎡</th>
                            <th>座位数量/个</th>
                            <th>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>
                              <select name="type" class="form-control">
                                <option value="3D">3D</option>
                                <option value="2D">2D</option>
                              </select>
                            </td>
                            <td>32</td>
                            <td>69</td>
                            <td>
                              <div class="dis-flex">
                                <button type="button" class="btn btn-success btn-xs">✚&nbsp;新增</button>
                                <button type="button" class="btn btn-danger btn-xs">删除</button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="cost" class="col-sm-2 control-label">大堂面积/㎡</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="cost" v-model.trim="info.cost" />
                    <p class="err-text" :class="{'err-text-or': infoErr.costError}">手机号为必填，由11位数字组成</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">
                    <button type="button" class="btn btn-danger" @click="sub()">保存</button>
                  </label>
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
        options: {
        format: "YYYY-MM-DD hh:mm:ss",
        useCurrent: false,
        locale: "zh-cn",
        tooltips: {
          selectTime: ""
        }
      },
      contractStime: "", //开始时间
      contractEtime: "", //结束时间
      info: {
        name: '',
        address: '',
        zzbcode: '',
        num: 0,
        cost: null,
      },
      prov: "北京",
      city: "北京",
      district: "朝阳",
      region: [], //地区
      cityArr: [], //城市
      districtArr: [], //区
      // 输入错误
      infoErr: {
        nameError: false,
        addressError: false,
        zzbcodeError: false,
        numError: false,
        costError: false,
      },
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
	        zzbCode: this.info.zzbcode,
          count: this.info.num,
          movieHallList:[
          {
            Id: 1,
            cinemaId:1,
            orderNum:1,
            type:1,
            volume:1,
            seatNum:1
          }
          ]
        };
        this.$axios
          .post(`${this.$root.urlPath.MJK}/api/2/cinema/saveCinema`, params)
          .then(res => {
            if (res.data.code == 200) {
              layer.msg("添加成功");
              // 成功后跳转
              window.setTimeout(function() {
                window.location.href = `/cinema/index`;
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
  },
  mounted() {
    this.getregion();
  },
};
</script>
