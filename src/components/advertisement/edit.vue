<template>
  <div class="row wh-manage">
    <div class="col-lg-12">
      <!-- post广告编辑 -->
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
          新建广告
          <a
            href="/posad/index"
            role="button"
            class="btn btn-ordinary btn-xs pull-right"
          >&lt;&lt;返回POST广告配置</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="position" class="col-sm-2 control-label">*投放位置</label>
                  <div class="col-sm-6">
                    <label class="radio-inline" for="position">
                      <input type="radio" name="position" id="position" value="支付页面" checked />支付页面        
                    </label>     
                  </div>
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">*广告标题</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="name" v-model.trim="info.title" />
                    <p
                      class="err-text"
                      :class="{'err-text-or': infoErr.titleErr}"
                    >标题为汉字。字母或数字组成，不超过50位</p>
                  </div> 
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">*广告图片</label>
                  <div class="col-sm-6">
                    
                  </div> 
                </div>
                <div class="form-group">
                  <label for class="col-sm-2 control-label">*广告时间</label>
                  <div class="col-sm-3">
                    <date-picker v-model="contractStime" :config="options"></date-picker>
                  </div>
                  <div class="col-sm-3">
                    <date-picker v-model="contractEtime" :config="options"></date-picker>
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
        title: ''
      },
      // 输入错误
      infoErr: {
        titleError: false
      },
    };
  },
  watch: {
    ["info.title"]() {
      this.infoErr.titleError = /^[\u4e00-\u9fa5A-Za-z0-9]{1,50}$/.test(
        this.info.title
      )
        ? false
        : true;
    },
  },
  methods: {
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
  },
};
</script>
