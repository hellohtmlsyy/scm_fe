<template>
  <div class="row">
    <div class="col-lg-12">
      <!-- 输入框条件筛选 -->
      <div class="panel panel-default" id="inputFilter">
        <div class="panel-heading">采购订单列表</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">发货仓库名称</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="wh_name"
                      v-model.trim="data.wh_name"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">发货仓库ID</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="wh_id" v-model.trim="data.wh_id" />
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="inputPassword5" class="col-sm-2 control-label">采购单ID</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="order_id"
                      v-model.trim="data.order_id"
                    />
                  </div>
                </div>
                <div class="form-group" id="dateRange">
                  <label for="inputPassword5" class="col-sm-2 control-label">申请时间</label>
                  <div class="col-sm-3">
                    <date-picker v-model="data.startTime" :config="options"></date-picker>
                  </div>
                  <div class="col-sm-3">
                    <date-picker v-model="data.endTime" :config="options"></date-picker>
                  </div>
                </div>
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
      <!-- 按钮条件筛选 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-1 control-label">订单类型</label>
                  <div class="col-sm-9">
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
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-1 control-label">订单状态</label>
                  <div class="col-sm-9">
                    <input
                      class="btn btn-sm"
                      :class="class2 == index? 'btn-info': 'btn-secondary'"
                      type="button"
                      :value="item"
                      v-for="(item,index) in status_button2"
                      :key="index"
                      @click="statusButton2(item,index)"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 结果list -->
      <div class="panel panel-default" id="resultItem" v-for="(item,index) in list" :key="index">
        <div class="panel-heading">
          {{item.mainOrderAliasId}}
          <button class="btn btn-cyan btn-xs" v-if="item.type==0">调配</button>
          <button class="btn btn-purple btn-xs"  v-if="item.type==1">采购</button>
          <span>{{item.createTime|convertTime('yyyy-MM-dd hh:mm:ss')}}</span>
          <!-- 固定展示按钮 -->
          <button v-if="item.status!=0" @click="detail(item)" class="btn btn-secondary btn-sm">订单详情</button>
          <button v-if="item.status!=0" class="btn btn-info btn-sm" data-toggle="modal" data-target="#exampleModal" @click="preAddRemarks(item)" >添加备注</button>
          <button v-if="item.status!=0 && item.process<160" class="btn btn-lightred btn-sm" @click="remove(item)">取消订单</button>
          <button v-if="item.status!=0" class="btn btn-lightred btn-sm" @click="close(item)">关闭订单</button>
          <!-- 进度相关按钮 -->
          <!-- 0调配 -->
          <span v-if="item.status!=0 && item.type==0">
            <button v-if="item.process==110" class="btn btn-success btn-sm" @click="nextProcess(item)">确认订单</button>
            <button v-if="item.process==120" class="btn btn-success btn-sm" data-toggle="modal" data-target="#exampleModal2" @click="preAddlogistic(item)">确认物流</button>
            <button v-if="item.process==130" class="btn btn-success btn-sm" @click="nextProcess(item)">配货</button>
            <button v-if="item.process==140" class="btn btn-success btn-sm" @click="nextProcess(item)" v-print="'#print'">打印出库单</button>
            <button v-if="item.process==150" class="btn btn-success btn-sm" @click="nextProcess(item)">确认发货</button>
            <button v-if="item.process==160" class="btn btn-success btn-sm" @click="nextProcess(item)">确认入库</button>
            <button v-if="item.process==170" class="btn btn-success btn-sm" @click="nextProcess(item)">订单完成</button>
          </span>
          <!-- 1采购（存在问题需要调整） -->
          <span v-if="item.status!=0 && item.type==1">
            <button v-if="item.process==110" class="btn btn-success btn-sm" @click="nextProcess(item)">确认订单</button>
            <button v-if="item.process==120" class="btn btn-success btn-sm" data-toggle="modal" data-target="#exampleModal2" @click="preAddlogistic(item)">确认物流</button>
            <button v-if="item.process==130" class="btn btn-success btn-sm" @click="nextProcess(item)">发货</button>
            <button v-if="item.process==160" class="btn btn-success btn-sm" @click="nextProcess(item)">确认入库</button>
            <button v-if="item.process==170" class="btn btn-success btn-sm" @click="nextProcess(item)">订单完成</button>
          </span>
          <span>
            总金额
            <b>{{item.totalPrice}}</b>
          </span>
        </div>
        <div class="panel-body">
          <!-- 进度条 -->
          <!-- 0调配 -->
          <div v-if="item.type==0" class="table-responsive processDefault" id="process0">
            <ul :id="'process'+index" v-process="item.process">
              <li id="p110" data-val="110"><span></span></li>
              <li id="p120" data-val="120"><span></span></li>
              <li id="p130" data-val="130"><span></span></li>
              <li id="p140" data-val="140"><span></span></li>
              <li id="p150" data-val="150"><span></span></li>
              <li id="p160" data-val="160"><span></span></li>
              <li id="p170" data-val="170"><span></span></li>
              <li id="p180" data-val="180"><span></span></li>   
            </ul>
          </div>
          <!-- 1采购 -->
          <div v-if="item.type==1" class="table-responsive processDefault" id="process1">
            <ul :id="'process'+index" v-process="item.process">
              <li id="p110" data-val="110"><span></span></li>
              <li id="p120" data-val="120"><span></span></li>
              <li id="p130" data-val="130"><span></span></li>
              <li id="p160" data-val="160"><span></span></li>
              <li id="p170" data-val="170"><span></span></li>
              <li id="p180" data-val="180"><span></span></li>   
            </ul>
          </div>
          <div id="print">
            <!-- 信息 -->
            <table class="table table-bordered table-condensed">
              <tbody>
                <tr>
                  <td>
                    采购仓信息：{{item.allStatusInfo.name}}，
                    联系人：<span v-for="(person,pIndex) in item.allStatusInfo.userVO" :key="pIndex">{{person.realName}}(<span id="personPhone">{{person.phone}}</span>)，</span>
                    {{item.allStatusInfo.address}}

                  </td>
                </tr>
                <tr>
                  <td v-if="item.make">
                    发货仓信息：{{item.make.name}}，
                    联系人：<span v-for="(user,uIndex) in item.make.userVO" :key="uIndex">{{user.realName}}(<span id="personPhone">{{user.phone}}</span>)，</span>
                    {{item.make.address}}
                  </td>
                  <td v-if="item.deployment">
                    供货仓信息：{{item.deployment.name}}，
                    联系人：<span v-for="(user,uIndex) in item.deployment.userVO" :key="uIndex">{{user.realName}}(<span id="personPhone">{{user.phone}}</span>)，</span>
                    {{item.deployment.address}}
                  </td>
                </tr>
                <tr>
                  <td>备注：{{item.comment}}</td>
                </tr>
              </tbody>
            </table>
            <!-- 表格 -->
            <div class="table-responsive">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>SKU编码</th>
                    <th>SKU名称</th>
                    <th>采购单位</th>
                    <th>成本价（元）</th>
                    <th>数量</th>
                    <th>单项汇总</th>
                    <th>价格汇总</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sku,skuIndex) in item.allWhBranchOrder" :key="skuIndex">
                    <td>{{sku.skuId}}</td>
                    <td>{{sku.skuName}}</td>
                    <td>{{sku.unit}}</td>
                    <td>{{sku.price}}</td>
                    <td>{{sku.num}}</td>
                    <td>{{sku.price*sku.num}}</td>
                    <td v-if="skuIndex==0" :rowspan="item.rowNumber" id="allMoney">{{item.allMoney}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <scm-pagination :totalPage="totalPage" @pagesClick="getpagelist" v-show="totalPage>1"></scm-pagination>
      <!-- 模态框，添加备注-->
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog">
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
                  <label for="goods-name" class="control-label">备注</label>
                  <div class>
                    <input type="text" class="form-control" id="goods-name" v-model.trim="remarks" />
                    <p class="err-text" :class="{'err-text-or': nameErr}">由汉字组成，不超过20位</p>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">取消</button>
              <button
                type="button"
                class="btn btn-success"
                :data-dismiss="!nameErr? 'modal': ''"
                @click="addRemarks()"
              >确认</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 模态框，添加物流单号-->
      <div class="modal fade" id="exampleModal2" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="exampleModalLabel">添加物流单号</h4>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="goods-name" class="control-label">物流公司</label>
                  <div class>
                    <input type="text" class="form-control" id="logisticsCompany" v-model.trim="logisticsCompany" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="goods-name" class="control-label">物流单号</label>
                  <div class>
                    <input type="text" class="form-control" id="logisticsId" v-model.trim="logisticsId" />
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">取消</button>
              <button
                type="button"
                class="btn btn-success"
                :data-dismiss="!nameErr? 'modal': ''"
                @click="addlogistics()"
              >确认</button>
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
      data: { //条件搜索
        wh_name: "",    //发货仓库名称
        wh_id: "",      //发货仓库ID
        order_id: "",   //采购单ID
        startTime: "",  //开始时间
        endTime: ""     //结束时间
      },

      list: [], //菜单列表list

      mainOrderAliasId:"", //采购订单号
      mainOrderId: "",     //主订单id
      beginProcess: "",    //开始状态
      endProcess: "",      //结束状态
      type: "",            //类型（调配/采购）
      createUid: "",       //当前登录用户id
      branchOrder:"",       //单号

      remarks: "",    //添加备注
      nameErr: false, //备注校验

      logistics:"", //添加物流单号

      logisticsCompany:"", //物流公司
      logisticsId:"", //物流单号

      nowIndex: "", //删除项索引
      id: "", //删除项id

      handle_modal_list: [], //处理申请模态框渲染信息
      totalPrice: "", //处理申请模态框，总价
      handle_count: "", //处理申请模态框，数量

      // 二级联动相关
      select_first: [], //一级数组
      select_second: [], //二级数组
      value_first: "", //一级值
      value_second: "", //一级值
      indexNum: 0, //联动索引

      status_button: ["全部", "调配", "采购"], //订单类型按钮
      status_button2: [ //订状态按钮
        "全部",
        "订单待确认",
        "确认订单",
        "物流确认",
        "配货",
        "打印出库单",
        "发货",
        "待入库",
        "已完成",
        "订单取消",
        "订单关闭"
      ],
      class1: 0, //类型按钮高亮切换
      class2: 0, //状态按钮高亮切换
      btn_val: null, //订单类型按钮值
      btn_val2: null, //订单状态按钮值

      // 分页相关
      page: 1, //当前页数
      limit: 10, //每页条数
      totalPage: 0, //总页数

      options: { //日期插件配置对象
        format: "YYYY-MM-DD hh:mm:ss",
        useCurrent: false,
        locale: "zh-cn",
        tooltips: {
          selectTime: ""
        }
      }
    };
  },
  mounted: function() {
    this.getlist(); //获取list数据
  },
  methods: {
    search() { //条件筛选
      if (
        this.data.wh_name ||
        this.data.wh_id ||
        this.data.order_id ||
        (this.data.startTime && this.data.endTime)
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
        page: this.page,
        limit: this.limit,
        deliveryName: this.data.wh_name,
        supplierWhId: this.data.wh_id,
        mainOrderId: this.data.order_id,
        contractStime: this.data.startTime,
        contractEtime: this.data.endTime,
        type: this.btn_val,
        status: this.btn_val2
      };
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/purchase/find", {
          params: params
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list = res.data.data.list;
            $.each(this.list,function(index,item){
              //由于入库状态有两种，170待入库，175入库中，
              //但页面上进度条的入库只有一个，所以把process中入库的强行设置成170，方便渲染
              if(item.process==175){
                item.process = 170
              }
              //手动添加一个属性，表格合并的行数
              item.rowNumber = item.allWhBranchOrder.length
              
              //手动添加一个属性，总价
              let money = 0
              $.each(item.allWhBranchOrder,function(i,e){
                money += e.price*e.num
              })
              item.allMoney = money

            })
            console.log(this.list)
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
    preAddRemarks(item){ //添加备注（预处理）
      this.mainOrderAliasId=item.branchAliasOrderId;
      this.beginProcess=item.process;
      this.endProcess=item.process+10;
      this.type=item.type;
      this.createUid=item.createUid;
    },
    addRemarks() { //添加备注
      console.log(this.remarks);
      if (!this.nameErr && this.remarks != "") {
        let params = {
          mainOrderAliasId: this.mainOrderAliasId,
          beginProcess: this.beginProcess,
          endProcess: this.endProcess,
          type: this.type,
          createUid: this.createUid,
          comment:this.remarks, //备注
        };
        let url = `${this.$root.urlPath.MJK}/api/1/purchase/addremarks`
        $.ajax({
        type:"POST",
        url:url,
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(params),
        dataType:"json",
        success:function(res){
          if (res.code == 200) {
            //成功
            layer.msg("成功");
          } else {
            //失败
            layer.msg("失败");
          }
        },
        error:function(err){  
            console.log(err)
        }  
      })
        // this.$axios
        //   .post(`${this.$root.urlPath.MJK}/api/1/purchase/addremarks`, params)
        //   .then(res => {
        //     if (res.data.code == 200) {
        //       //成功
        //       layer.msg(`${type}成功`);
        //       this.getlist();
        //     } else {
        //       //失败
        //       layer.msg(res.data.msg);
        //     }
        //   })
        //   .catch(err => {
        //     console.log(err);
        //   });
      }
    },
    preAddlogistic(item){ //确认物流（预处理）
      this.mainOrderAliasId=item.branchAliasOrderId;
      this.beginProcess=item.process;
      this.endProcess=item.process;
      this.type=item.type;
      this.createUid=item.createUid;
      this.tempItem = item;
      this.branchOrder=item.branchAliasOrderId;
    },
    addlogistics() { //确认物流
        let params = {
          mainOrderAliasId: this.mainOrderAliasId,
          status: this.endProcess,
          type: this.type,
          createUid: this.createUid,
          logisticsCompany:this.logisticsCompany, //物流公司
          logisticsId:this.logisticsId, //物流单号
          branchOrder:this.mainOrderAliasId,
        };
        let url = `${this.$root.urlPath.MJK}/api/1/purchase/logistic`

        $.ajax({
        type:"POST",
        url:url,
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(params),
        dataType:"json",
        success:function(res){
          if (res.code == 200) {
            //成功
            layer.open({
                content: "成功",
                title: "提示"
              });
            this.getlist();
          } else {
            //失败
            layer.msg("失败");
          }
        },
        error:function(err){  
            layer.msg(res.data.msg);
        }  
      })
        
        // this.$axios
        //   .post(`${this.$root.urlPath.MJK}/api/1/purchase/logistic`, params)
        //   .then(res => {
        //     if (res.data.code == 200) {
        //       //成功
        //       layer.open({
        //         content: "成功",
        //         title: "提示"
        //       });
              
        //       this.getlist();
        //     } else {
        //       //失败
        //       layer.msg(res.data.msg);
        //     }
        //   })
        //   .catch(err => {
        //     console.log(err);
        //   });
    },
    nextProcess(item){ //进度推进（与确认物流共用接口）
      console.log(item)
      let params = {
          mainOrderAliasId: item.branchAliasOrderId,
          status: item.process,
          type: item.type,
          createUid: item.createUid,
          branchOrder:item.branchAliasOrderId,
        };
      let url = `${this.$root.urlPath.MJK}/api/1/purchase/logistic`
        $.ajax({
        type:"POST",
        url:url,
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(params),
        dataType:"json",
        success:function(res){
          if (res.code == 200) {
            //成功
            layer.open({
                content: "成功",
                title: "提示"
              });
            this.getlist();
          } else {
            //失败
            layer.msg("失败");
          }
        },
        error:function(err){  
            
        }  
      })

      //  this.$axios
      //     .post(`${this.$root.urlPath.MJK}/api/1/purchase/logistic`, params)
      //     .then(res => {
      //       if (res.data.code == 200) {
      //         //成功
      //         layer.open({
      //           content: "成功",
      //           title: "提示"
      //         });

      //         this.getlist();
              
      //       } else {
      //         //失败
      //         layer.open({
      //           content: "成功",
      //           title: "提示"
      //         });
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });

    },
    detail(item) { //订单详情
      window.location.href = `/purchase/detail?id=${item.branchAliasOrderId}&allMoney=${item.allMoney}`;
    },
    remove(item) { //取消订单
      let params = {
          mainOrderAliasId: item.branchAliasOrderId,
          status:190,
        }
      this.$axios
        .post(this.$root.urlPath.MJK + "/api/1/purchase/remove", params)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            layer.open({
            content: "取消成功",
            title: "提示"
          });
          } else {
            //失败
            layer.open({
            content: "取消失败",
            title: "提示"
          });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    close(item) { //关闭订单
      let params = {
          mainOrderAliasId: item.branchAliasOrderId,
          status:200,
        }
      this.$axios
        .post(this.$root.urlPath.MJK + "/api/1/purchase/remove", params)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            layer.open({
            content: "关闭成功",
            title: "提示"
          });
          } else {
            //失败
            layer.open({
            content: "关闭失败",
            title: "提示"
          });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    statusButton(item,index) { //订单类型按钮切换
      // 切换按钮样式
      this.class1 = index;
      // 根据类型确定参数
      switch (item) {
        case "全部":
          this.btn_val = "";
          this.getlist();
          break;
        case "调配":
          this.btn_val = 0;
          this.getlist();
          break;
        case "采购":
          this.btn_val = 1;
          this.getlist();
          break;
        default:
          break;
      }
      console.log(this.btn_val);
    },
    statusButton2(item,index) { //订单状态按钮切换
      // 切换按钮样式
      this.class2 = index;
      // 根据类型确定参数
      switch (item) {
        case "全部":
          this.btn_val2 = "";
          this.getlist();
          break;
        case "订单待确认":
          this.btn_val2 = 110;
          this.getlist();
          break;
        case "确认订单":
          this.btn_val2 = 120;
          this.getlist();
          break;
        case "物流确认":
          this.btn_val2 = 130;
          this.getlist();
          break;
        case "配货":
          this.btn_val2 = 140;
          this.getlist();
          break;
        case "打印出库单":
          this.btn_val2 = 150;
          this.getlist();
          break;
        case "发货":
          this.btn_val2 = 160;
          this.getlist();
          break;
        case "待入库":
          this.btn_val2 = 170;
          this.getlist();
          break;
        case "已完成":
          this.btn_val2 = 180;
          this.getlist();
          break;
        case "订单取消":
          this.btn_val2 = 190;
          this.getlist();
          break;
          case "订单关闭":
          this.btn_val2 = 200;
          this.getlist();
          break;
        default:
          break;
      }
      console.log(this.btn_val2);
    },
    getpagelist(page) { //分页
      this.page = page;
      this.getlist(page);
    },
  },
  watch: {
    remarks: function() { //添加备注校验
      this.nameErr = /^[\u4e00-\u9fa5]{1,20}$/.test(this.remarks)
        ? false
        : true;
    }
  },
  directives:{
    "process":{ //进度条自定义指令（为避免bug，每个钩子函数都写了一遍）
      bind:function(el,binding){
        //遍历进度条全部节点
        $.each($(el).children(),function(index,item){
          // 对比节点私有属性值，与订单当前进度process的值
          if($(item).attr("data-val")<=binding.value){
            // 已走过的节点全部添加颜色
            $(item).css("background","yellowgreen")
            $(item).children().css("background","yellowgreen")
          }
          if($(item).attr("data-val")==binding.value){
            //当前节点添加高亮
            $(item).children().css("background","green")
          }
        })
        // 当process大于180（已完成），强行给最后一个节点添加高亮
        if(binding.value>180){
            $(el).find("li:last-child").children().css("background","green")
          }
      },
      inserted:function(el,binding){
        //遍历进度条全部节点
        $.each($(el).children(),function(index,item){
          // 对比节点私有属性值，与订单当前进度process的值
          if($(item).attr("data-val")<=binding.value){
            // 已走过的节点全部添加颜色
            $(item).css("background","yellowgreen")
            $(item).children().css("background","yellowgreen")
          }
          if($(item).attr("data-val")==binding.value){
            //当前节点添加高亮
            $(item).children().css("background","green")
          }
        })
        // 当process大于180（已完成），强行给最后一个节点添加高亮
        if(binding.value>180){
            $(el).find("li:last-child").children().css("background","green")
          }
      },
      update:function(el,binding){
        //遍历进度条全部节点
        $.each($(el).children(),function(index,item){
          // 对比节点私有属性值，与订单当前进度process的值
          if($(item).attr("data-val")<=binding.value){
            // 已走过的节点全部添加颜色
            $(item).css("background","yellowgreen")
            $(item).children().css("background","yellowgreen")
          }
          if($(item).attr("data-val")==binding.value){
            //当前节点添加高亮
            $(item).children().css("background","green")
          }
        })
        // 当process大于180（已完成），强行给最后一个节点添加高亮
        if(binding.value>180){
            $(el).find("li:last-child").children().css("background","green")
          }
      },
      componentUpdated:function(el,binding){
        //遍历进度条全部节点
        $.each($(el).children(),function(index,item){
          // 对比节点私有属性值，与订单当前进度process的值
          if($(item).attr("data-val")<=binding.value){
            // 已走过的节点全部添加颜色
            $(item).css("background","yellowgreen")
            $(item).children().css("background","yellowgreen")
          }
          if($(item).attr("data-val")==binding.value){
            //当前节点添加高亮
            $(item).children().css("background","green")
          }
        })
        // 当process大于180（已完成），强行给最后一个节点添加高亮
        if(binding.value>180){
            $(el).find("li:last-child").children().css("background","green")
          }
      },
      unbind:function(el,binding){
        //遍历进度条全部节点
        $.each($(el).children(),function(index,item){
          // 对比节点私有属性值，与订单当前进度process的值
          if($(item).attr("data-val")<=binding.value){
            // 已走过的节点全部添加颜色
            $(item).css("background","yellowgreen")
            $(item).children().css("background","yellowgreen")
          }
          if($(item).attr("data-val")==binding.value){
            //当前节点添加高亮
            $(item).children().css("background","green")
          }
        })
        // 当process大于180（已完成），强行给最后一个节点添加高亮
        if(binding.value>180){
            $(el).find("li:last-child").children().css("background","green")
          }
      },
    }
  }
};
</script>

<style scoped>
/* 输入框条件筛选 start */

/* 输入框条件筛选 end */

/* 结果展示 stard */
#resultItem > .panel-heading > button {
  margin-left: 10px;
}
#resultItem > .panel-heading > span:last-child {
  float: right;
  color: red;
}
#resultItem #personPhone {
  color: red;
}
#allMoney{

  text-align: center !important;
  vertical-align: middle !important;
  color: red !important;
}
/* 结果展示 end */

/* 步骤进度条start */
.processDefault{
  padding: 40px;
}
.processDefault>ul{
  list-style: none;
  min-width: 1000px;
}
.processDefault>ul>li{
  float: left;
  width: 120px;
  height: 10px;
  background-color: #ccc;
  margin-left: 10px;
  position: relative;
}
.processDefault>ul>li:first-child{
  width: 0;
}
.processDefault>ul>li>span{
  position: absolute;
  /* display: inline-block; */
  width:20px;
  height: 20px;
  right: 0;
  border-radius: 50%;
  background-color: #ccc;
  margin-right: -15px;
  margin-top: -5px;
  z-index: 999;
}
.processDefault>ul>li>span::before{
  display: block;
  content: "";
  width: 120px;
  height: 20px;
  position: absolute;
  top: -30px;
  left: -50px;
  font-size: 16px;
  color: #666;
  text-align: center;
}

/* 0调配 */
#process0>ul>#p110>span::before{
  content: "创建完成待确认"
}
#process0>ul>#p120>span::before{
  content: "确认订单"
}
#process0>ul>#p130>span::before{
  content: "物流确定"
}
#process0>ul>#p140>span::before{
  content: "配货"
}
#process0>ul>#p150>span::before{
  content: "打印出库单"
}
#process0>ul>#p160>span::before{
  content: "发货"
}
#process0>ul>#p170>span::before{
  content: "入库"
}
#process0>ul>#p180>span::before{
  content: "订单已完成"
}

/* 1采购 */
#process1>ul>#p110>span::before{
  content: "创建完成待确认"
}
#process1>ul>#p120>span::before{
  content: "确认订单"
}
#process1>ul>#p130>span::before{
  content: "物流确定"
}
#process1>ul>#p160>span::before{
  content: "发货"
}
#process1>ul>#p170>span::before{
  content: "入库"
}
#process1>ul>#p180>span::before{
  content: "订单已完成"
}




/* 步骤进度条end */
</style>