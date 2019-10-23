<template>
  <div class="row" id="mainBox">
    <div class="col-lg-12">
      <!-- 输入框搜索 -->
      <!-- <div class="panel panel-default">
        <div class="panel-heading">创建菜单</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-6">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">图标选择</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="iconId">
                      <option v-for="(item,index) in icons" :key="index" :value="item.id">
                        <img height="50" :src="item.url" />
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">选择父菜单</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="parentId">
                      <option
                        v-for="(item,index) in parentMenus"
                        :key="index"
                        :value="item.id"
                      >{{item.menuName}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">菜单名称</label>
                  <div class="col-sm-10">
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      name="name"
                      v-model.trim="name"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">输入地址</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="url" name="url" v-model.trim="url" />
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-success" @click.prevent="creat()">创建</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> -->
      <!-- 按钮搜索 -->
      <!-- <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-1 control-label">状态</label>
                  <div class="col-sm-10 buttonActive">
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
      </div> -->
      <!-- 结果展示表格 -->
      <div class="panel panel-default">
        <div class="panel-heading">菜单管理列表</div>
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>图标</th>
                  <th>菜单名称</th>
                  <th>地址绑定</th>
                  <!-- <th>排序</th>
                  <th>操作</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{item.id}}</td>
                  <td>
                    <img width="20" :src="item.avatar" />
                  </td>
                  <td>{{item.menuName}}</td>
                  <td>{{item.url}}</td>
                  <!-- <td>
                    <i class="glyphicon glyphicon-arrow-up"></i>
                    <i class="glyphicon glyphicon-arrow-down"></i>
                  </td> -->
                  <!-- <td>
                    <button
                      type="button"
                      class="btn btn-info btn-sm"
                      data-toggle="modal"
                      data-target="#myModal"
                      :data-whatever="item.id"
                      @click="edit(index,item)"
                    >
                      <i class="glyphicon glyphicon-pencil"></i>编辑
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      data-toggle="modal"
                      data-target="#whdel"
                      :data-whatever="item.id"
                      @click="nowIndex=index;id=item.id"
                    >
                      <i class="glyphicon glyphicon-trash"></i>删除
                    </button>
                  </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <scm-pagination :totalPage="totalPage" @pagesClick="getpagelist" v-show="totalPage>1"></scm-pagination>
      <!-- 模态框 表格编辑 -->
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog">
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
                <table class="table-condensed table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>图标</th>
                      <th>菜单名称</th>
                      <th v-if="temporary.parentId!=null">地址绑定</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{temporary.id}}</td>
                      <td>
                        <div class="form-group">
                          <div class="col-sm-10">
                            <select class="form-control" v-model="temporary.avatar">
                              <option v-for="(item,index) in icons" :key="index" :value="item.id">
                                <img :src="item.url" />
                              </option>
                            </select>
                          </div>
                        </div>
                      </td>
                      <td>
                        <input class="form-control" type="text" v-model="temporary.menuName" />
                      </td>
                      <td v-if="temporary.parentId!=null">
                        <div class="form-group">
                          <div class="col-sm-10">
                            <select class="form-control" v-model="temporary.parentId">
                              <option
                                v-for="(item,index) in parentMenus"
                                :key="index"
                                :value="item.id"
                              >{{item.menuName}}</option>
                            </select>
                          </div>
                        </div>
                        
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
                @click.prevent="complete()"
              >处理完成</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 模态框 删除数据 -->
      <div class="modal fade" id="whdel" tabindex="-1" role="dialog">
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
              <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-primary" @click="del()" data-dismiss="modal">确定</button>
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
      iconId: "",       //图标值
      icons: [],        //图标列表
      parentId: "",     //父菜单值
      parentMenus: [],  //父菜单列表
      name: "",         //菜单名称
      url: "",          //地址

      class1: 0, //状态按钮切换
      status: "", //状态按钮值
      status_button: ["全部", "正常", "删除"], //搜索按钮内容

      nowIndex: "", //传递删除用户的索引，页面上删除用
      id: "", //传递删除用户的id值，发送给后台进行删除用

      temporary: {},  //编辑功能临时数据

      list: [  //菜单列表list
        {
          id: 1,
          menuName: "仓库管理",
          parentId: 1,
          status: 1,
          url: "www.baidu.com",
          remark: 1,
          avatar: require("./u3376.png"),
          createTime: "2019-09-18 17:13:58"
        }
      ],

      page: 1, //当前页数
      limit: 10, //每页条数
      totalPage: 0 //总页数
      
    };
  },
  mounted() {
    this.getIcon(); //获取图标
    this.getParentMenu(); //获取父菜单
    this.getList(); //获取列表list数据
  },
  methods: {
    getIcon() { //获取图标
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/menu/avatar")
        .then(res => {
          if (res.data.code==200) {
            //成功
            this.icons = res.data.data
          } else {
            //失败
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getParentMenu() { //获取父菜单
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/menu/parentid")
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.parentMenus = res.data.data;
          } else {
            //失败
          }
        })
        .catch(err => {
          console.log(err);
        });
    },   
    getList() { //获取列表list数据
      let params = {
        status: this.status,
        page:this.page,
        limit:this.limit,
      };
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/menu/list", {
          params: params
        })
        .then(res => {
          if (res.data.code==200) {
            //成功
            this.list = res.data.data.list;
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
    creat() { //创建
      console.log("创建");
      let params = {
          avatar: this.iconId,
          parentId: this.parentId,
          menuName: this.name,
          url: this.url,
        }
        console.log(params)
      this.$axios
        .post(this.$root.urlPath.MJK + "/api/1/menu/create_menu", params)
        .then(res => {
          if (res.data.code==200) {
            //成功
            layer.msg('成功');
          } else {
            //失败
            layer.msg('失败');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    edit(index, item) { //编辑
      this.nowIndex = index;
      this.id = item.id;
      this.temporary = JSON.parse(JSON.stringify(item));
      console.log(this.temporary);
    },
    complete() { //处理完成
      console.log("处理完成");
      let params = {
          id: this.temporary.id,
          parentId: this.temporary.parentId,
          status: this.temporary.status,
          menuName: this.temporary.menuName,
          avatar: this.temporary.avatar,
          remark: this.temporary.remark,
          url: this.temporary.url
        }
      this.$axios
        .post(this.$root.urlPath.MJK + "/api/1/menu/edit", params)
        .then(res => {
          if (res.data.code == 200) {
            //成功
            layer.msg("成功");
          } else {
            //失败
            layer.msg("失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    del() { //删除
      console.log("删除");
      this.$axios
        .post(this.$root.urlPath.MJK + "/api/1/user/delete_menu", {
          id: this.id
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.list.splice(this.nowIndex, 1);
            layer.msg("删除成功");
          } else {
            //失败
            alert("删除失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    statusButton(item, index) { //按钮切换
      // 切换按钮样式
      this.class1 = index;
      // 根据类型确定参数
      switch (item) {
        case "全部":
          this.status = "";
          this.getList();
          break;
        case "正常":
          this.status = 1;
          this.getList();
          break;
        case "删除":
          this.status = 0;
          this.getList();
          break;
        default:
          break;
      }
      console.log(this.status);
    },  
    getpagelist(page) { //分页
      this.page = page;
      this.getList(page);
    },
    
  }
};
</script>

<style scoped>
/* 主盒子 stard */
#mainBox {
  /* 防止点击侧栏展开收起操作时页面产生抖动 */
  min-height: 700px;
}
/* 主盒子 end */

/* 按钮与小图标 start */
i {
  margin-right: 5px;
}
.glyphicon-arrow-up {
  color: #66cc00;
}
.glyphicon-arrow-down {
  color: crimson;
}
/* 按钮与小图标 end */

/* 表格 start */
.statusitem {
  color: #66cc00;
}
/* 表格 end */

/* 模态框start */
/* #myModal{
}
#myModal .modal-body tbody td:nth-child(4){
    padding: 8px 0;
}
#myModal .modal-body tbody td:nth-child(4) .col-sm-12{
    padding:0 5px;
}
#myModal .modal-body tbody td:nth-child(5){
    padding: 8px 0;
}
#myModal .modal-body tbody td:nth-child(5) .col-sm-12{
    padding:0 5px;
}
#myModal .modal-body tbody td:last-child{
    padding-top: 12px;
}
#myModal .modal-body tbody td:nth-last-child(2) input{
    width: 60px;
}
#narrowitem01,#narrowitem02{
  padding: 0;
} */
/* 模态框end */
</style>