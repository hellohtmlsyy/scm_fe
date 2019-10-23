<template>
  <div class="row">
    <div class="col-lg-12">
      <!-- 条件筛选 -->
      <div class="panel panel-default" id="inputFilter">
        <div class="panel-heading">
          采购中心
          <a href="/purchase/apply" class="btn btn-success btn-xs">✚&nbsp;创建采购申请</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <!-- 采购仓库名称 -->
                <div class="form-group">
                  <label for="purchase_name" class="col-sm-2 control-label">采购仓库名称</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="purchase_name"
                      v-model.trim="data.purchase_name"
                    />
                  </div>
                </div>
                <!-- 采购仓库id -->
                <div class="form-group">
                  <label for="purchase_id" class="col-sm-2 control-label">采购仓库ID</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="purchase_id"
                      v-model.trim="data.purchase_id"
                    />
                  </div>
                </div>
                <!-- 采购申请id -->
                <div class="form-group">
                  <label for="apply_id" class="col-sm-2 control-label">采购申请ID</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="apply_id"
                      v-model.trim="data.apply_id"
                    />
                  </div>
                </div>
                <!-- 时间选择 -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">添加时间</label>
                  <div class="col-sm-3">
                    <date-picker v-model="data.startTime" :config="options"></date-picker>
                  </div>
                  <div class="col-sm-3">
                    <date-picker v-model="data.endTime" :config="options"></date-picker>
                  </div>
                </div>
                <!-- 搜索按钮 -->
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-danger" @click.prevent="search()">搜索</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 状态按钮 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-6">
              <form class="form-horizontal">
                <!-- 状态 -->
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">状态</label>
                  <div class="col-sm-9 buttonActive">
                    <input
                      class="btn btn-sm"
                      :class="class1 == index? 'btn-info': 'btn-secondary'"
                      type="button"
                      :value="item"
                      v-for="(item,index) in status_button"
                      :key="index"
                      @click="statusButton(item,index)"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 列表list -->
      <div class="panel panel-default resultItem" v-for="(item,index) in list" :key="index">
        <div class="panel-heading">
          {{item.mainOrderAliasId}}
          <button v-if="item.status==0" class="btn btn-danger btn-xs">未处理</button>
          <button v-if="item.status==1" class="btn btn-secondary btn-xs">已取消</button>
          <button v-if="item.status==2" class="btn btn-success btn-xs">已处理</button>
          <span>{{item.createTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</span>
          <span>
            总金额
            <b>{{item.totalPrice}}</b>
          </span>
        </div>
        <div class="panel-body">
          <!-- 信息 -->
          <div class="row">
            采购仓信息：{{item.warehousesName}},联系人：
            <span
              class="phoneRed"
              v-for="(m,j) in item.users"
              :key="j"
            >
              {{m.realName}} (
              <span>{{m.phone}}</span> ),
            </span>
            {{item.address}}
          </div>
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>SKU编码</th>
                  <th>SKU名称</th>
                  <th>成本价（元）</th>
                  <th>数量</th>
                  <th>采购单位</th>
                  <th>单项汇总</th>
                  <th>处理方式</th>
                  <th>供应商/仓库</th>
                  <th>处理时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(e,i) in item.whBranchOrders" :key="i">
                  <td>{{e.code}}</td>
                  <td>{{e.skuName}}</td>
                  <td>{{e.price}}</td>
                  <td v-if="!e.num">{{e.quantity}}</td>
                  <td v-if="e.num">{{e.num}}</td>
                  <td>{{e.unit}}</td>
                  <td>{{e.price*e.num}}</td>
                  <td>{{e.optionMode}}</td>
                  <td>{{e.supplierName?e.supplierName:e.supplierWhName}}</td>
                  <td>{{e.createTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 按钮 -->
          <div class="form-group">
            <div class="col-sm-offset-1 col-sm-9">
              <input
                v-if="item.status!=1"
                class="btn btn-success btn-sm"
                type="button"
                value="处理申请"
                data-toggle="modal"
                data-target="#handleModal"
                @click.prevent="getinfo(item)"
              />
              <input
                v-if="item.status!=1"
                class="btn btn-danger btn-sm"
                type="button"
                value="取消申请"
                data-toggle="modal"
                data-target="#delModal"
                :data-whatever="item.id"
                @click="preCancel(item)"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <scm-pagination :totalPage="totalPage" @pagesClick="getpagelist" v-show="totalPage>1"></scm-pagination>
      <!-- 模态框，编辑-->
      <div class="modal fade" id="handleModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myModalLabel">RKD201812280002</h4>
            </div>
            <div class="modal-body">
              <div class="table-responsive">
                <table class="table-condensed table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>SKU名称</th>
                      <th>申请数量</th>
                      <th>未处理数量</th>
                      <th>采购单位</th>
                      <th>成本价(元)</th>
                      <th>单项汇总</th>
                      <th>处理方式</th>
                      <th>供应商/仓库</th>
                      <th>数量</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in handle_modal_list" :key="index">
                      <td>{{item.skuName}}</td>
                      <td>{{item.quantity}}</td>
                      <td>{{item.quantity-handle_count}}</td>
                      <td>{{item.unit}}</td>
                      <td>{{item.price}}</td>
                      <td>{{totalPrice}}</td>
                      <td>
                        <div class="form-group">
                          <div class="col-sm-12" id="narrowitem01">
                            <!--一级菜单-->
                            <select
                              class="form-control"
                              v-on:change="reactInChain(item)"
                              v-model="item.typeId"
                            >
                              <option
                                v-for="(item,index) in item.firstArr"
                                :key="index"
                                :value="item.valueId"
                              >{{item.valueName}}</option>
                              <!---->
                            </select>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="form-group">
                          <div class="col-sm-12" id="narrowitem02">
                            <!--二级菜单-->
                            <select class="form-control" v-model="item.warehouseId">
                              <option
                                v-for="(k,i) in item.secondArr"
                                :key="i"
                                :value="k.id"
                              >{{k.name}}</option>
                            </select>
                          </div>
                        </div>
                      </td>
                      <td>
                        <input class="form-control" type="text" v-model="item.num" />
                      </td>
                      <td>
                        <button class="btn btn-success btn-xs" @click="addBatch(item,index)">增加批次</button>
                        <button class="btn btn-danger btn-xs" @click="delBatch(item,index)">删除</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-lightred" data-dismiss="modal">取消处理</button>
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                @click="complete()"
              >处理完成</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 模态框，取消 -->
      <div class="modal fade" id="delModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="exampleModalLabel">提示</h4>
            </div>
            <div class="modal-body">确认要取消吗？</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
              <button
                type="button"
                class="btn btn-primary"
                @click="cancel()"
                data-dismiss="modal"
              >确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      data: {
        purchase_name: "",//采购仓库名称
        purchase_id: "",  //采购仓库ID
        apply_id: "",     //采购申请ID
        startTime: "",    //开始时间
        endTime: ""       //结束时间
      },

      list: [], //列表list

      // 二级联动
      select_first: [], //一级数据
      select_second: [],//二级数据
      value_first: "",  //一级值
      value_second: "", //二级值
      indexNum: 0,      //联动索引

      //处理申请模态框
      handle_modal_list: [],//渲染信息
      totalPrice: "",       //总价
      handle_count: "",     //数量

      //状态按钮
      status_button: ["全部", "待处理", "已处理"], //内容
      class1: 0, //高亮切换索引
      button_status: "", //按钮值

      nowIndex: "", //删除项索引
      id: "",       //删除项id

      // 分页相关
      page: 1,      //当前页数
      limit: 10,    //每页条数
      totalPage: 0, //总页数

      //日期插件配置对象
      options: { 
        format: "YYYY-MM-DD hh:mm:ss",
        useCurrent: false,
        locale: "zh-cn",
        tooltips: {
          selectTime: ""
        }
      },

      obj: {
        userid: "1",
        role: "订单"
      },
      obj2: {
        userid2: "2",
        role2: "订单2"
      },

    };
  },
  mounted() {
    this.getlist(); 
    this.getModeInfo();
  },
  methods: {
    search() { //条件筛选
      console.log(this.data);
      if (
        this.data.purchase_name != "" ||
        this.data.purchase_id != "" ||
        this.data.apply_id != "" ||
        (this.data.startTime != "" && this.data.endTime != "")
      ) {
        if (this.data.startTime > this.data.endTime) {
          layer.open({
            content: "时间不正确，请重新输入",
            title: "提示"
          });
          return;
        } else {
          this.getlist();
        }
      } else {
        layer.open({
          content: "请输入需要搜索的条件",
          title: "提示"
        });
      }
    },
    getlist() { //获取list数据
      let params = {
        page: this.page, //必填
        limit: this.limit, //必填
        status: this.button_status,
        warehousesName: this.data.purchase_name,
        whId: this.data.purchase_id,
        mainOrderId: this.data.apply_id,
        contractStime: this.data.startTime,
        contractEtime: this.data.endTime
      };

      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/purchase/search", {
          params: params
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list = res.data.data.list; //替换list数据渲染页面
            this.totalPage = Math.ceil(res.data.data.total / this.limit);
            if (res.data.data.list.length == 0) {
              layer.msg("暂无数据");
            }
          } else {
            //失败
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getModeInfo() { //获取二级联动数据
      this.$axios
        .get(this.$root.urlPath.MJK + `/api/1/purchase/mode`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.select_first = res.data.data; //替换处理方式下拉框数据渲染页面
            // console.log(this.select_first);
          } else {
            //失败
            console.log(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getinfo(item) { //处理申请，获取数据
      let that = this
      let mainOrderId = item.id
      this.id = mainOrderId;
      this.$axios
        .get(this.$root.urlPath.MJK + `/api/1/purchase/handletable/${mainOrderId}`)
        // .get(this.$root.urlPath.MJK + `/api/1/purchase/handletable/47`)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.handle_modal_list = res.data.data.orderdetilById;
            $.each(this.handle_modal_list,function(index,item){
              // 手动追加属性，仓库id，处理方式id，仓库id，数量，二级联动数据
              item.whId = res.data.data.whId
              item.typeId = '';
              item.warehouseId = '';
              item.num='';
              item.firstArr = JSON.parse(JSON.stringify(that.select_first));
              item.secondArr = [];
            })
            //修改data数据中的总价
            this.totalPrice = res.data.data.totalPrice;
          } else {
            //失败
            console.log(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addBatch(item,index) { //增加批次
      item= JSON.parse(JSON.stringify(item))
      let that = this
      let obj = {
        skuName:item.skuName,
        quantity:item.quantity,
        handle_count:item.handle_count,
        unit:item.unit,
        price:item.price,
        totalPrice:that.totalPrice,
        whId:item.whId,
        typeId: '',
        warehouseId:'',
        num:'',
        firstArr:that.select_first,
        secondArr:[],
      }
      this.handle_modal_list.push(item);
    },
    delBatch(item,index){ //删除批次
      this.handle_modal_list.splice(index, 1);
    },
    complete2() {
      console.log(4444)
      let obj = {orderId:1,t:[{a1:123}]}
      let json = { orderId: "111", username: "abc" };
      let config = { headers: { "Content-Type": "application/json" } };
      let url = 'http://150.0.1.128:9090' + "/api/1/purchase/handle";
      this.$axios
        // .post( url, [{"comment":"111","num":"1111"},{"comment":"222","num":"2222"}], config )
        .post( url, {"whId":"1","warehousesDetails":[{"price":123,"quantity":456}]} )
        .then(function(response) {
          console.info(response.data);
        })
        .catch(function(error) {
          console.info(error);
        });
    },
    complete(){ //处理完成
      let that = this;
      let arr = []
      $.each(this.handle_modal_list,function(index,item){
        let obj = {
          mainOrderId:item.mainOrderId,
          whId:item.whId,
          totalPrice:item.price,
          totalQuantity:item.quantity,
          skuId:item.skuId,
          type:item.typeId,
          supplierId:item.typeId==1?item.warehouseId:"",    //采购方式具体供应商
          supplierWhId:item.typeId==0?item.warehouseId:"",  //调配方式具体仓库
          num:item.num,
        }
        arr.push(obj)
      })
      let params = {
        createUid:11,
        whBranchOrders:arr,
      }
      
      //临时数组1，保存 skuId 和 申请数量
      let tempArr = []
      $.each(params.whBranchOrders,function(index,item){
        tempArr.push({skuId:item.skuId,totalQuantity:item.totalQuantity})
      })
      //数组去重
      tempArr=tempArr.reduce(function(prev,element){
        if(!prev.find(el=>el.skuId==element.skuId)) {
          prev.push(element)
        }
        return prev
      },[])
      
      //临时数组2，计算出每个sku的各个批次数量之和
      let numArr = []
      $.each(tempArr,function(index,item){
        let obj = {
          skuId : item.skuId,
          totalQuantity:item.totalQuantity,
          count : 0
        }
        $.each(arr,function(i,e){
          if(item.skuId===e.skuId){
            obj.count += Number(e.num)
          }
        })
        numArr.push(obj)
      })

      var aa = true
      
      $.each(numArr,function(index,item){
        if(item.count!=item.totalQuantity){
          
          aa = false
          return false
        }else{
          aa = true
        }
      })
      
      if(aa === true){
        
        let url = this.$root.urlPath.MJK + "/api/1/purchase/handle";
        $.ajax({
          type:"POST",
          url:url,
          contentType:"application/json;charset=utf-8",
          data:JSON.stringify(params),
          dataType:"json",
          success:function(res){
            console.log(res)
            if (res.code == 200) {
              //成功
              layer.msg("成功");
            } else {
              //失败
              layer.msg("提交失败");
            }
          },
          error:function(err){  
              console.log(err)
          }  
        })
      // this.$axios
      //   .post( url, params )
      //   .then(res => {
      //     if (res.data.code == 200) {
      //       //成功
      //       layer.msg("提交成功");
      //     } else {
      //       //失败
      //       layer.msg("提交失败");
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });

      }else if(aa === false){
        layer.open({
            content: "失败，处理数量应等于申请数量，请重新输入",
            title: "提示"
          });

      }
    },
    preCancel(item){ //取消申请预处理
      this.id = item.id
    },
    cancel() { //取消申请
      console.log(this.nowIndex, this.id);
      this.$axios
        .post(this.$root.urlPath.MJK + `/api/1/purchase/cancel`, {
          id: this.id
        })
        .then(res => {
          if (res.data.msg) {
            //成功
            alert("成功");
          } else {
            //失败
            alert("失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    statusButton(item, index) { //状态按钮切换
      // 切换按钮样式
      this.class1 = index;
      // 根据类型确定参数
      switch (item) {
        case "全部":
          this.button_status = "";
          this.getlist();
          break;
        case "待处理":
          this.button_status = 0;
          this.getlist();
          break;
        case "已处理":
          this.button_status = 2;
          this.getlist();
          break;
        default:
          break;
      }
      console.log(this.button_status);
    },
    reactInChain(item) { //二级联动
      for (let i = 0; i < item.firstArr.length; i++) {
        //根据用户选中的值，去第一级数据中心查找对应项，拿到索引值
        if (item.firstArr[i].valueId == item.typeId) {
          //动态改变第二级的数据
          item.secondArr = item.firstArr[i].provides;
          this.$forceUpdate()
        }
      }
      
    },
    getpagelist(page) { //分页
      this.page = page;
      this.getlist(page);
    },
  }
};
</script>

<style scoped>
/* 输入框条件筛选 start */
#inputFilter > .panel-heading > a {
  float: right;
}
/* 输入框条件筛选 end */

/* 结果展示 stard */
.resultItem > .panel-heading > button {
  margin-left: 10px;
}
.resultItem > .panel-heading > span:last-child {
  float: right;
  color: red;
}
.resultItem > .panel-body > .row {
  margin: 0 0 10px 0;
  border: 1px solid #ccc;
  padding: 5px;
}
.resultItem > .panel-body > .row > span {
  color: red;
}
/* 电话号码红色 */
.phoneRed {
  color: #000 !important;
}
.phoneRed > span {
  color: red !important;
}
/* 结果展示 end */

/* 模态框start */
#myModal .modal-body tbody td:nth-child(4) {
  padding: 8px 0;
}
#myModal .modal-body tbody td:nth-child(4) .col-sm-12 {
  padding: 0 5px;
}
#myModal .modal-body tbody td:nth-child(5) {
  padding: 8px 0;
}
#myModal .modal-body tbody td:nth-child(5) .col-sm-12 {
  padding: 0 5px;
}
#myModal .modal-body tbody td:last-child {
  padding-top: 12px;
}
#myModal .modal-body tbody td:nth-last-child(2) input {
  width: 60px;
}
#narrowitem01,
#narrowitem02 {
  padding: 0;
}

/* 模态框end */
</style>