<template>
  <div class="row">
    <div class="col-lg-12">
      <!-- 用户信息 -->
      <div class="panel panel-default">
        <div class="panel-heading">
          编辑个人信息
          <a
            href="/usermanage/index"
            role="button"
            class="btn btn-ordinary btn-xs pull-right"
          >&lt;&lt; 返回用户管理</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <!-- 登录名 -->
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">
                    <span class="require">*</span> 登录名
                  </label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="login_name"
                      v-model.trim="dataList.username"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.nameErr}">登录名为英文字母与数字组成，不超过20位</p>
                  </div>
                </div>
                <!-- 手机号 -->
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">
                    <span class="require">*</span> 手机号
                  </label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="user_phone"
                      v-model.trim="dataList.phone"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.phoneErr}">手机号由11位数字组成</p>
                  </div>
                </div>
                <!-- 密码 -->
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">
                    <span class="require">*</span> 密码
                  </label>
                  <div class="col-sm-6">
                    <input
                      type="password"
                      class="form-control"
                      id="user_password"
                      v-model.trim="dataList.password"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.passwordErr}">密码为英文字母与数字组成，不超过20位</p>
                  </div>
                </div>
                <!-- 确认密码 -->
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">
                    <span class="require">*</span> 确认密码
                  </label>
                  <div class="col-sm-6">
                    <input
                      type="password"
                      class="form-control"
                      id="user_confirmpass"
                      v-model.trim="confirm"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.confirmErr}">确认密码与密码保持一致</p>
                  </div>
                </div>
                <!-- 姓名 -->
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label"><span class="require">*</span>姓名</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="user_name"
                      v-model.trim="dataList.realName"
                    />
                    <p class="err-text" :class="{'err-text-or': infoErr.realnameErr}">姓名为汉字组成，不超过10个汉字</p>
                  </div>
                </div>
                <!-- 微信 -->
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">微信</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="user_weixin"
                      v-model.trim="dataList.weChat"
                    />
                  </div>
                </div>
                <!-- qq -->
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">QQ</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="user_qq" v-model.trim="dataList.qq" />
                  </div>
                </div>
                <!-- 邮箱 -->
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">邮箱</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="user_email"
                      v-model.trim="dataList.email"
                    />
                  </div>
                </div>
                <!-- 所在地 -->
                <div class="form-group">
                  <label for class="col-sm-2 control-label">所在地</label>
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
                <!-- 详细地址 -->
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">详细地址</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="address"
                      v-model.trim="dataList.address"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 角色，状态 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <!-- 角色组 -->
                <div class="form-group" id="usergroup">
                  <label for="inputEmail3" class="col-sm-2 control-label">选择角色</label>
                  <div class="col-sm-10">
                    <div class="row usergroup">
                      <div class="col-lg-12">
                        <span v-for="(item,index) in roleNameGroup" :key="index">
                          <label class="radio-inline">
                            <input type="radio" v-model="dataList.roleId" :value="item.id" class="role"/>
                            {{item.roleName}}
                          </label>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 状态 -->
                <div class="form-group" v-if="$route.query.type == 'modify'">
                  <label for="inputEmail3" class="col-sm-1 control-label">状态</label>
                  <div class="col-sm-6">
                    <label class="radio-inline" v-for="(item,index) in statusGroup" :key="index">
                      <input
                        type="radio"
                        name="usergroupstatus"
                        :value="item"
                        v-model="dataList.status"
                      />
                      {{item}}
                    </label>
                  </div>
                </div>
                <!-- 确定按钮 -->
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-1 control-label"></label>
                  <div class="col-sm-10">
                    <button type="button" class="btn btn-danger" @click.prevent="sub()">确定</button>
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
      dataList: { //用户信息
        username: "",   //登录名
        phone: "",      //手机号
        password: "",   //密码
        realName: "",   //姓名
        weChat: "",     //微信
        qq: "",         //QQ
        email: "",      //邮箱
        provinceId: "", //省
        cityId: "",     //市
        districtId: "", //区
        address: "",    //详细地址
        roleId: "",        //角色
        roleName: "",   //角色(字符)
        status: 0,     //状态
      },
      confirm: "",    //确认密码
      prov: "北京",     //省 (默认)
      city: "北京",     //市 (默认)
      district: "朝阳", //区 (默认)
      region: [],       //地区数组
      cityArr: [],      //城市数组
      districtArr: [],  //区数组
      id: this.$route.query.id, //编辑时的用户id

      roleNameGroup: [], //角色
      statusGroup: ["正常", "禁用"], //状态

      infoErr: {  //必填项表单验证
        nameErr: false,
        phoneErr: false,
        passwordErr: false,
        confirmErr: false,
        realnameErr: false,
      }
      
    };
  },
  mounted() {
    this.getRole()  //获取全部角色
    this.getregion(); //获取地区
    if (this.$route.query.type == "modify") { //修改
      this.getinfo();
    } else { //添加
      // this.info = "";
      // this.getregion();
    }
  },
  watch: {
    prov: function() { //监听省数据变化
      this.updateCity(); //修改市数据
      this.updateDistrict(); //修改区数据
    },
    city: function() { //监听市数据变化
      this.updateDistrict(); //修改区数据
    },
    ["dataList.username"]() { //登录名校验
      this.infoErr.nameErr = /^[A-Za-z0-9]{1,20}$/.test(
        this.dataList.username
      )
        ? false
        : true;
    },
    ["dataList.phone"]() { //手机号校验
      this.infoErr.phoneErr = /^1\d{10}$/.test(
        this.dataList.phone
      )
        ? false
        : true;
    },
    ["dataList.password"]() { //密码校验
      this.infoErr.passwordErr = /^[A-Za-z0-9]{1,20}$/.test(
        this.dataList.password
      )
        ? false
        : true;
    },
    confirm() { //确认密码校验
      this.infoErr.confirmErr = (this.confirm === this.dataList.password) ? false : true;
    },
    ["dataList.realName"]() { //姓名校验
      this.infoErr.realnameErr = /^[\u4e00-\u9fa5]{1,10}$/.test(
        this.dataList.realName
      )
        ? false
        : true;
    },
  },
  methods: {
    getinfo() {  //编辑时，获取用户信息
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/user/getInfo", {
          params: { id: this.id }
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            // 后台数据替换dataList
            this.dataList = res.data.data;
            this.dataList.password = '';
            this.dataList.status = (this.dataList.status == 1? '正常': '禁用');
          } else {
            //失败
            layer.msg(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getregion() {  //获取所在地，三级联动
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/wh/regionCn/detail")
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.region = res.data.data;
            // 省市区联动初始化
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
    getRole(){  //获取角色
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/role/findAllRole")
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.roleNameGroup = res.data.data
          } else {
            //失败
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateCity: function() {  //省市联动
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
    updateDistrict: function() {  //市区联动
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
    sub01() {  //测试接口时写的
      //保存
      // 检验成功提交
      let params = {
        roleId: "3",
        username: "a",
        // id: "46", //该字段在编辑时需要传递，添加时不用
        phone: "13000000000",
        password: "1122",
        confirmPassword: "1122",
        realName: "haha",
        weChat: "aaa",
        qq: "1111",
        email: "qqq111@163.com",
        provinceId: "110000",
        cityId: "110100",
        districtId: "110102",
        address: "北京市朝阳区",
        roleName: "员工"
      };
      if (this.$route.query.type == "add") {
        console.log("创建");
        //新建
        this.$axios
          .post(`${this.$root.urlPath.MJK}/api/1/user/create_user`, params)
          .then(res => {
            if (res.data.code == 200) {
              // 成功后跳转仓库管理
              // window.location.href = `${this.$root.urlPath.SCM}/usermanage/index`;
            } else {
              //失败
              layer.msg(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log("修改");
        //修改保存
        this.$axios
          .post(`${this.$root.urlPath.MJK}/api/1/user/update`, params)
          .then(res => {
            if (res.data.code == 200) {
              // 成功后跳转仓库管理
              // window.location.href = `${this.$root.urlPath.SCM}/warehouse/index`;
            } else {
              //失败
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    sub() {  // 新建/编辑
      // 必填项非空验证
      if (
        !this.infoErr.nameErr &&
        this.dataList.username != "" &&
        !this.infoErr.phoneErr &&
        this.dataList.phone != "" &&
        !this.infoErr.passwordErr &&
        this.dataList.password != "" &&
        !this.infoErr.confirmErr &&
        this.confirm != "" &&
        !this.infoErr.realnameErr &&
        this.dataList.realName != ""
      ) {
        //省市区id值获取
        this.region.forEach(ele => {
          if (ele.shortName == this.prov) {
            this.dataList.provinceId = ele.id;
          }
          ele.city.forEach(ele2 => {
            if (ele2.shortName == this.city) {
              this.dataList.cityId = ele2.id;
            }
            ele2.district.forEach(ele3 => {
              if (ele3.shortName == this.district) {
                this.dataList.districtId = ele3.id;
              }
            });
          });
        });
        // 参数对象
        let params = {
          roleId: this.dataList.roleId,
          username: this.dataList.username,
          phone: this.dataList.phone,
          password: this.dataList.password,
          confirmPassword: this.confirm,
          realName: this.dataList.realName,
          weChat: this.dataList.weChat,
          qq: this.dataList.qq,
          email: this.dataList.email,
          provinceId: this.dataList.provinceId,
          cityId: this.dataList.cityId,
          districtId: this.dataList.districtId,
          address: this.dataList.address,
        };
        // 根据不同状态发送请求
        if (this.$route.query.type == "add") {
          //新建
          this.$axios
            .post(`${this.$root.urlPath.MJK}/api/1/user/create_user`, params)
            .then(res => {
              console.log(res)
              if (res.data.code == 0) {
                // 成功后跳转用户管理
                layer.msg(res.data.msg);
                window.setTimeout(function() {
                  window.location.href = `/usermanage/index`;
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
          //编辑
          //添加id值
          params['id'] = this.dataList.id;
          //添加状态值
          params['status'] = (this.dataList.status == '正常' ? 1 : 0);
          this.$axios
            .post(`${this.$root.urlPath.MJK}/api/1/user/update`, params)
            .then(res => {
              if (res.data.code == 200) {
                // 成功后跳转仓库管理
                layer.msg("修改成功");
                window.setTimeout(function() {
                  window.location.href = `/usermanage/index`;
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
          content: "带*的为必填，请补充内容后保存",
          title: "提示"
        });
      }
    }, 
  }
};
</script>

<style scoped>
/* 按钮样式 */
.panel-heading > a {
  background-color: #aaa;
}
/* 用户组样式 */
#usergroup {
  margin-top: 20px;
}
.usergroup {
  background-color: #eee;
  margin-bottom: 30px;
  position: relative;
}
.usergroup span {
  background-color: #fff;
  display: inline-block;
  margin: 5px;
  padding: 0 10px 7px;
  border: 1px solid #666;
  border-radius: 5px;
}
.usergroup .role {
  position: static;
}

/* 表单验证提示信息 */
.inputInfo {
  color: #666;
  font-size: 12px;
}
.require {
  color: red;
}
</style>