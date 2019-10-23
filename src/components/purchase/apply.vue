<template>
  <div class="row" id="mainBox">
    <div class="col-lg-12">
      <!-- 选择仓库 -->
      <div class="panel panel-default">
        <div class="panel-heading">选择采购仓库</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-6">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">选择仓库</label>
                  <div class="col-sm-10">
                    <!--一级菜单-->
                    <select class="form-control" v-model="warehouse">
                      <option
                        v-for="(item,index) in warehouse_info"
                        :key="index"
                        :value="item.id"
                      >{{item.name}}</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 仓库对应sku展示列表 -->
      <div class="panel panel-default" id="sku">
        <div class="panel-heading" id="skulisthead">
          SKU列表 &nbsp;&nbsp;
          <button class="btn btn-success btn-sm" @click="packUp()">{{switchFlag?"收起":"展开"}}</button>
        </div>
        <div class="panel-body" id="skulist">
          <div class="row" v-for="(item,index) in allSku" :key="index" v-show="switchFlag">
            <div class="col-xs-6">
              <div class="image">
                <img height="90" :src="item.imgUrl" />
              </div>
              <div>
                <p>{{item.name}}</p>
                <p>单位：{{item.unit}}</p>
                <p>{{item.intro}}</p>
              </div>
            </div>
            <div class="col-xs-6">
              <p>
                成本价
                <span>{{item.price}}</span>
                (元)
              </p>
              <input type="text" v-model="item.pick_number" />
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-1 col-sm-10">
              <button
                type="submit"
                :class="switchFlag?'btn btn-success':'btn btn-success disabled'"
                @click="creat()"
              >创建</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 采购申请 -->
      <div class="panel panel-default" id="skuTabel">
        <div class="panel-heading"></div>
        <div class="panel-body">
          <!-- 总价 -->
          <div class="row" id="totalPrice">
            <div class="col-sm-2">
              价格汇总：
              <span>{{total_price | number}}</span>
            </div>
          </div>
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>SKU编码</th>
                  <th>sku名称</th>
                  <th>成本价（元）</th>
                  <th>数量</th>
                  <th>采购单位</th>
                  <th>单项汇总</th>
                  <!-- <th>价格汇总</th> -->
                  <th>操作</th>
                </tr>
              </thead>
              <tbody id="skuTabelBody">
                <tr v-for="(item,index) in sku_detail_list" :key="index">
                  <td>{{item.skuCode}}</td>
                  <td>{{item.skuName}}</td>
                  <td>{{item.price}}</td>
                  <td>{{item.quantity}}</td>
                  <td>{{item.unit}}</td>
                  <td>{{item.single_count | number}}</td>
                  <!-- <td>{{item.all_count}}</td> -->
                  <td>
                    <button type="button" class="btn btn-danger btn-sm" @click="delSkuItem(index)">
                      <i class="glyphicon glyphicon-trash"></i>删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 提交按钮 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-6">
              <form class="form-horizontal">
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-success" @click.prevent="submit()">提交</button>
                    <button type="submit" class="btn btn-danger" @click.prevent="cancel()">取消</button>
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
      warehouse: 8,       //仓库(默认)
      warehouse_info: [], //仓库下拉框数据
      allSku: [],         //全部sku数据
      switchFlag: true,   //展开收起切换
      sku_detail_list: [],//创建sku列表
      total_price: 0,     //总价
      total_num : 0,      //总数
    };
  },
  mounted() {
    this.getWarehouseInfo();
    this.getAllSku();
  },
  methods: {
    getWarehouseInfo() { //获取仓库下拉框数据
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/wh/warehouse/info/all")
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.warehouse_info = res.data.data;
          } else {
            //失败
            console.log(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAllSku() { //获取全部sku数据
      let that = this;
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/purchase/allsku")
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.allSku = res.data.data;

            $.each(this.allSku, function(index, value) {
              that.allSku[index].pick_number = 0;
            });
          } else {
            //失败
            console.log(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },    
    packUp() { //展开收起
      this.switchFlag = !this.switchFlag;
      console.log(this.switchFlag);
    },
    creat() { //创建
      let that = this;
      // 置空数据
      that.sku_detail_list = [];
      that.total_price = 0;
      // 展开状态，可点击创建
      if (this.switchFlag == true) {
        $.each(this.allSku, function(index, item) {
          // 用户选择数量时
          if (item.pick_number != 0) {
            let sku_detail = {
              skuCode:item.code, //编码
              skuId: `${item.id}`, //id
              skuName:item.name, //名称
              price:item.price, //成本价
              quantity:item.pick_number, //数量
              unit:item.unit, //单位
              single_count:item.price*item.pick_number, //单项汇总
            };
            that.sku_detail_list.push(sku_detail);
          }
        });
        // 计算价格汇总，计算总数量
        $.each(that.sku_detail_list, function(index, item) {
          that.total_price += item.single_count;
          that.total_num+=item.quantity-0
        });
              
      } else if (this.switchFlag == false) {
        console.log("禁止创建");
      }
    },
    delSkuItem(index) { //删除
      let that = this;
      console.log(index);
      this.sku_detail_list.splice(index, 1);
      // 置空价格汇总
      that.total_price = 0;
      // 计算价格汇总
      $.each(that.sku_detail_list, function(index, item) {
        that.total_price += item.single_count;
      });
    },
    submit() { //提交
      $.each(this.sku_detail_list,function(index,item){
        item.whId = this.warehouse
      })
      let params = {
        whId: this.warehouse,
        totalPrice:this.total_price,
        totalQuantity:this.total_num,
        // warehousesName:'中文',
        createUid:"",//页面上登陆的用户id，待完善
        warehousesDetails: this.sku_detail_list,
      };
      // let object = JSON.parse({abc:123,bbb:"中文"});
      let url = this.$root.urlPath.MJK + "/api/1/purchase/add";
      // Axios.post(url,params)
      // // this.$axios
      // //   .post( url, params, {
      // //     headers: {
      // //        'Content-Type':'application/json;charset=UTF-8'
      // //     },
      // //   })
      var aa = true;
      if(params.warehousesDetails.length==0){
        aa=false;
      }

      if(aa==true){
        $.ajax({
        type:"POST",
        url:url,
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(params),
        dataType:"json",
        success:function(res){
          if (res.code == 200) {
            //成功
            layer.msg("提交成功");
            window.setTimeout(function(){
              window.location.href = "/purchase/center";
            },1000)
          } else {
            //失败
            layer.msg("提交失败");
          }
        },
        error:function(err){  
            console.log(err)
        }  
      })

      }else if(aa==false){
        layer.msg("无数据，无法提交");
      }
       
        // .then(res => {
        //   if (res.data.code == 200) {
        //     //成功
        //     layer.msg("提交成功");
        //     window.setTimeout(function(){
        //       // window.location.href = "/purchase/center";
        //     },2000)
        //   } else {
        //     //失败
        //     layer.msg("提交失败");
        //   }
        // })
        // .catch(err => {
        //   console.log(err);
        // });
    },
    cancel() { //取消
      this.sku_detail_list = []
      this.total_price = 0
      this.total_num = 0
    }
  },
  filters: {
    number: function(value) { // 价格汇总，保留两位小数
      return value.toFixed(2);
    }
  }
};
</script>

<style scoped>
/* 按钮与小图标 */
i {
  margin-right: 5px;
}
.glyphicon-arrow-up {
  color: #66cc00;
}
.glyphicon-arrow-down {
  color: crimson;
}
/* 按钮与小图标 */

/* 主盒子 */
#mainBox {
  /* 防止点击侧栏展开收起操作时页面产生抖动 */
  min-height: 700px;
}
/* 主盒子 */

/* 仓库对应sku展示列表 */
#skulisthead {
  padding-bottom: 15px;
}
#skulisthead > span {
  color: #66cc00;
}
#skulisthead > button {
  float: right;
  width: 80px;
}
#skulist {
  padding-top: 0;
}
#skulist > .row {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  padding-top: 10px;
}
#skulist > .row > div:first-child {
  /* background-color: pink; */
}
#skulist > .row > div:first-child > .image {
  float: left;
  margin-right: 10px;
}
#skulist > .row > div:first-child > div:last-child {
  overflow: hidden;
}
#skulist > .row > div:first-child > div:last-child > p {
  font-weight: 800;
}
#skulist > .row > div:first-child > div:last-child > p:nth-child(2) {
  color: royalblue;
}
#skulist > .row > div:last-child {
  /* background-color: skyblue; */
  text-align: right;
  height: 90px;
}
#skulist > .row > div:last-child > p {
  margin-bottom: 44px;
  color: tomato;
  font-weight: 800;
}
#skulist > .row > div:last-child > input {
  width: 100px;
}
#skulist > div:last-child {
  margin-top: 20px;
}
/* 仓库对应sku展示列表 */

/* 表格部分 */
#skuTabelBody > tr > td:nth-last-child(2) {
  color: red;
}
#totalPrice > div {
  float: right;
  color: red;
  font-weight: 600;
  margin-right: 10px;
}
/* 表格部分 */
</style>