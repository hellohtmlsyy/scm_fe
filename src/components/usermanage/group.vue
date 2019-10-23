<template>
  <div class="row" id="mainBox">
    <div class="col-lg-12">
      <!-- 输入框搜索 -->
      <!-- <div class="panel panel-default">
        <div class="panel-heading">用户角色管理
          <button
            type="button"
            class="btn btn-success btn-xs pull-right"
            data-toggle="modal"
            data-target="#exampleModal"
            @click="roleName='';id='';type=0"
          >✚&nbsp;添加用户角色</button>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">用户角色名称</label>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="rightsgroup_name"
                      name="rightsgroup_name"
                      v-model.trim="roleName"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-6">
                    <button type="button" class="btn btn-danger" @click="search()">搜索</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> -->
      <!-- 结果展示表格 -->
      <div class="panel panel-default">
        <div class="panel-heading">用户角色列表
          <button
            type="button"
            class="btn btn-success btn-xs pull-right"
            data-toggle="modal"
            data-target="#exampleModal"
            @click="roleName='';remark='';id='';type=0"
          >✚&nbsp;添加用户角色</button>
        </div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户角色名称</th>
                  <th>别名备注</th>
                  <th>用户数</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>{{item.roleName}}</td>
                  <td>{{item.remark}}</td>
                  <td>{{item.num}}</td>
                  <td>
                    <a :href="'/usermanage/rights?id='+item.id" role="button" class="btn btn-success btn-sm">
                      <i class="glyphicon glyphicon-pencil"></i>设置权限
                    </a>
                    <button
                      type="button"
                      class="btn btn-info btn-sm"
                      data-toggle="modal"
                      data-target="#exampleModal"
                      :data-whatever="item.id"
                      @click="roleName=item.roleName;remark=item.remark;id=item.id;type=1"
                    >
                      <i class="glyphicon glyphicon-pencil"></i>编辑
                    </button>
                    <button
                      v-if="item.num==0"
                      type="button"
                      class="btn btn-danger btn-sm"
                      data-toggle="modal"
                      data-target="#whdel"
                      :data-whatever="item.id"
                      @click="nowIndex=index;id=item.id;"
                    >
                      <i class="glyphicon glyphicon-trash"></i>删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <scm-pagination :totalPage="totalPage" @pagesClick="getpagelist" v-show="totalPage>1"></scm-pagination>
      <!-- 模态框，表格编辑 -->
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
              <h4 class="modal-title" id="exampleModalLabel">用户角色创建</h4>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="goods-name" class="control-label">*用户角色名称</label>
                  <div class>
                    <input type="text" class="form-control" id="goods-name" v-model.trim="roleName" />
                    <p class="err-text" :class="{'err-text-or': roleNameErr}">名称由汉字，字母，数字组成，不超过20位。</p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="goods-name" class="control-label">别名备注</label>
                  <div class>
                    <input type="text" class="form-control" id="goods-name" v-model.trim="remark" />
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" :data-dismiss="!roleNameErr? 'modal': ''" @click="creat()" v-show="type==0">确认</button>
              <button type="button" class="btn btn-success" :data-dismiss="!roleNameErr? 'modal': ''" @click="complete()" v-show="type==1">确认</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal">取消</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 模态框，删除 -->
      <div
        class="modal fade"
        id="whdel"
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
            <div class="modal-body">确认要删除吗？</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" @click="del()" data-dismiss="modal">确认</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal">取消</button>
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
      roleName: "", //角色名
      remark: "", //备注
      nowIndex: "", //传递删除用户的索引，页面上删除用
      id: "", //传递删除用户的id值，发送给后台进行删除用
      status_button: ["全部", "正常", "删除"],  //分类搜索按钮内容
      class1: 0,  //分类搜索按钮切换高亮
      status: "",  //分类搜索按钮，值
      list: [],  //list列表数据
      temporary:{},  //编辑功能临时数据
      // 复选框样式控制（未用到）
      ckeckVal: false,
      ckeckClass: "",
      ckeckInfo: "您未选中默认",
      // 分页相关
      page: 1, //当前页数
      limit: 10, //每页条数
      totalPage: 0, //总页数
      roleNameErr: false,
      type: 0,//判断添加或编辑
    };
  },
  watch: {
    roleName() {     
       this.roleNameErr = /^[\u4e00-\u9fa5A-Za-z0-9]{1,20}$/.test(this.roleName)
        ? false
        : true;
    }
  },
  mounted() {
    // 初始化列表list
    this.getlist();
  },
  methods: {
    getlist() {  //获取列表list数据
      let params = {
        page: this.page,
        limit: this.limit,
      };
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/role/list", {
          params: params
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list = res.data.data.list
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
    // search(){
    //   alert('暂无接口')
    // },
    creat() {  //创建用户组
      if(!this.roleNameErr && this.roleName != ''){
        this.$axios
          .post(this.$root.urlPath.MJK + "/api/1/role/create_role", {
            roleName: this.roleName,
            remark: this.remark
          })
          .then(res => {
            if (res.data.code == 200) {
              //成功
              layer.msg('添加成功');
              this.getlist()
            } else {
              //失败
              layer.msg('添加失败');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    edit(index,item){  //编辑
      this.nowIndex=index;
      this.id=item.id;
      //不可以直接赋值，采用数据深拷贝，避免引用类型数据修改的是同一片内存空间
      this.temporary = JSON.parse(JSON.stringify(item));
    },
    complete() {  //处理完成
      let data = this.temporary
      if(!this.roleNameErr && this.roleName != ''){
        this.$axios
          .post(this.$root.urlPath.MJK + "/api/1/role/edit", {
            id: this.id,
            roleName: this.roleName,
            remark: this.remark,
          })
          .then(res => {
            if (res.data.code == 200) {
              //成功
              layer.msg("修改成功");
              this.getlist()
            } else {
              //失败
              layer.msg("修改失败");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    del() {  //删除用户
      console.log("删除");
      this.$axios
        .post(this.$root.urlPath.MJK + "/api/1/role/delete_role", {
          id: this.id
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list.splice(this.nowIndex, 1);
            layer.msg("删除成功");
          } else {
            //失败
            layer.msg("删除失败"+res.data.msg);
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
          this.status = "";
          this.getlist();
          break;
        case "正常":
          this.status = 0;
          this.getlist();
          break;
        case "删除":
          this.status = 1;
          this.getlist();
          break;
        default:
          break;
      }
    },
    clickMe() {  //复选框样式切换
      var that = this;
      console.log(that.data.ckeckVal);
      if (that.data.ckeckVal) {
        that.ckeckInfo = "您选中了默认";
        that.ckeckClass = "checked";
      } else {
        that.ckeckInfo = "您未选中默认";
        that.ckeckClass = "";
      }
    },
    setRights(id) {  //设置权限
      window.location.href = `${this.$root.urlPath.SCM}/usermanage/rights?id=${id}`;
    },
    getpagelist(page) {
      this.page = page;
      this.getlist(page);
    },
  }
};
</script>

<style scoped>
/* 主盒子 */
#mainBox {
  /* 防止点击侧栏展开收起操作时页面产生抖动 */
  min-height: 700px;
}
/* 主盒子 */

/* 按钮与小图标 */
i {
  margin-right: 5px;
}
.glyphicon-ok {
  color: #66cc00;
}
.glyphicon-remove {
  color: crimson;
}
/* 按钮与小图标 */

/* 复选框 */
.checked {
  color: #66cc00;
}
#checkBox {
  padding-top: 7px;
}
#checkBox span {
  margin-left: 10px;
}
/* 复选框 */

/* 状态按钮样式 */
.buttonClick > input:hover {
  color: #fff;
  background-color: #a1a1a1;
}
.buttonClick > input:focus {
  color: #fff;
}
/* 状态按钮样式 */

/* 表格 */
.statusitem {
  color: #66cc00;
}
/* 表格 */
</style>