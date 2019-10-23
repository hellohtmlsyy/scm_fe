<template>
  <div class="row">
    <div class="col-lg-12">
      <!-- 条件搜索 -->
      <div class="panel panel-default" id="inputFilter">
        <div class="panel-heading">
          用户管理
          <a href="/usermanage/add?type=add" class="btn btn-success btn-xs">✚&nbsp;添加用户</a>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <!-- 姓名 -->
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">姓名</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="user_name" name="user_name" v-model.trim="user_name" />
                  </div>
                </div>
                <!-- 手机号 -->
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">手机号</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="user_phone" name="user_phone" v-model.trim="user_phone" />
                  </div>
                </div>
                <!-- 登录名 -->
                <div class="form-group">
                  <label for="inputPassword4" class="col-sm-2 control-label">登录名</label>
                  <div class="col-sm-6">
                    <input type="text" class="form-control" id="login_name" name="login_name" v-model.trim="login_name" />
                  </div>
                </div>
                <!-- 时间选择 -->
                <div class="form-group">
                  <label for class="col-sm-2 control-label">注册时间</label>
                  <div class="col-sm-3">
                    <date-picker v-model="contractStime" :config="options"></date-picker>
                  </div>
                  <div class="col-sm-3">
                    <date-picker v-model="contractEtime" :config="options"></date-picker>
                  </div>
                </div>
                <!-- 搜索按钮 -->
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button type="button" class="btn btn-danger" @click="search()">搜索</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 分类搜索 -->
      <!-- <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">按状态</label>
                  <div class="col-sm-6 buttonActive">
                    <input class="btn btn-sm" :class="class1 == index? 'btn-info': 'btn-secondary'" type="button" :value="item" v-for="(item,index) in status_button" :key="index" @click="statusButton(item,index)" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> -->
      <!-- 结果list -->
      <div class="panel panel-default" id="resultTabel">
        <div class="panel-heading">用户列表</div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>登录名</th>
                  <th>姓名</th>
                  <th>角色</th>
                  <th>手机号码</th>
                  <th>注册时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in dataList" :key="index">
                  <td>{{item.id}}</td>
                  <td>{{item.username}}</td>
                  <td>{{item.realName}}</td>
                  <td>{{item.roleName}}</td>
                  <td>{{item.phone}}</td>
                  <td>{{item.createTime}}</td>
                  <td>{{item.status==1?'正常':'禁用'}}</td>
                  <td>
                    <a :href="'/usermanage/add?type=modify&id='+item.id" role="button" class="btn btn-info btn-sm" >
                      <i class="fa fa-pencil"></i> 编辑</a>
                    <!-- <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      data-toggle="modal"
                      data-target="#whdel"
                      :data-whatever="item.id"
                      @click="nowIndex=index;id=item.id"
                    >
                    <i class="fa fa-trash-o"></i> 删除</button> -->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 分页 -->
          <scm-pagination :totalPage="totalPage" @pagesClick="getpagelist" v-show="totalPage>1"></scm-pagination>
          <!-- 模态框 -->
          <div class="modal fade" id="whdel" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
            <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="modal-title" id="exampleModalLabel">提示</h4>
                </div>
                <div class="modal-body">确认要删除吗？</div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-success"
                    @click="del()"
                    data-dismiss="modal"
                  >确认</button>
                  <button type="button" class="btn btn-danger" data-dismiss="modal">取消</button>
                </div>
              </div>
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
  data() {
    return {
      user_name: "", //姓名
      user_phone: "", //手机号
      login_name: "", //登录名
      contractStime: "", //开始时间
      contractEtime: "", //结束时间

      class1:0,  // 状态按钮，样式切换
      status_button: ["全部", "正常", "禁用"], // 状态内容
      status:"",  // 状态值

      dataList: [],  //结果list数据

      nowIndex: "", //传递删除用户的索引，页面上删除用
      id: "",  //传递删除用户的id值，发送给后台进行删除用
      
      page: 1, //当前页数
      limit: 10, //每页条数
      totalPage: 0, //总页数
      
      options: {  //日期插件
        format: "YYYY-MM-DD hh:mm:ss",
        useCurrent: false,
        locale: "zh-cn",
        tooltips: {
          selectTime: ""
        }
      },
    };
  },
  mounted(){
    this.getList()
  },
  methods: { 
    search() {  //搜索
      if (
        this.user_name != "" ||
        this.user_phone != "" ||
        this.login_name != "" ||
        (this.contractStime != "" && this.contractEtime != "")
      ) {
        if (this.contractStime > this.contractEtime) {
          layer.open({
            content: "创建时间不正确，请重新输入",
            title: "提示"
          });
          return;
        } else {
          this.page = 1;
          this.getList();
        }
      } else {
        layer.open({
          content: "请输入需要搜索的条件",
          title: "提示"
        });
      }
    },
    getList(){  //获取数据
      let params = {
        page: this.page,
        limit: this.limit,
        realName: this.user_name,
        phone:this.user_phone,
        username:this.login_name,
        contractStime: this.contractStime,
        contractEtime: this.contractEtime,
        status:this.status,
      };
      this.$axios
        .post(this.$root.urlPath.MJK + "/api/1/user/getInfoList",params)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.dataList = res.data.data.list
            this.totalPage = Math.ceil(res.data.data.total / this.limit);
            if (res.data.data.list.length == 0) {
              layer.msg("暂无数据");
            }
          } else {
            //失败
            console.log(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },          
    del() {  //删除用户
      console.log(this.nowIndex, this.id);
      this.$axios
        .post( this.$root.urlPath.MJK + "/api/1/user/delete_user",{
            id: this.id
          }
        )
        .then(res => {
          if (res.data.msg) {
            //成功
            this.dataList.splice(this.nowIndex, 1); //删除数据中这一项
            layer.msg("删除成功");
          } else {
            //失败
            layer.msg("删除失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },   
    statusButton(item, index) {  //状态按钮切换
      // 切换按钮样式
      this.class1 = index;
      // 根据类型确定参数
      switch (item) {
        case "全部":
          this.status = ''
          this.getList();
          break;
        case "正常":
          this.status = 1
          this.getList();
          break;
        case "禁用":
          this.status = 0
          this.getList();
          break;
        default:
          break;
      }
      console.log(this.status)
    }, 
    getpagelist(page) {  //分页
      this.page = page;
      this.getList();
    },  
  }
};
</script>

<style scoped>
/* 条件搜索 start */
/* 绿色按钮右浮动 */
#inputFilter > div > button {
  float: right;
}
#inputFilter > div > a {
  float: right;
}
/* 日期选择 */
#dateRange > div > input {
  width: 160px;
}
/* 条件搜索 end */

/* 结果展示 stard */
#resultTabel tbody td:nth-last-child(2) {
  color: yellowgreen;
  font-weight: 700;
}
/* 结果展示 end */
</style>