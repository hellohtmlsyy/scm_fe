<template>
  <div class="row" id="mainBox">
    <div class="col-lg-12">
      <!-- 输入框搜索 -->
      <div class="panel panel-default">
        <div class="panel-heading">创建行为</div>
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-6">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">路由地址</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control"  id="router_url" name="router_url" v-model.trim="data.router_url" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">行为名称</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control"  id="behavior_name" name="behavior_name" v-model.trim="data.behavior_name" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-2 control-label">类型</label>
                  <div class="col-sm-10">
                    <label class="radio-inline">
                      <input type="radio" name="type" value="page" v-model="data.type"/>页面
                    </label>
                    <label class="radio-inline">
                      <input type="radio" name="type" value="behavior" v-model="data.type"/>行为
                    </label>
                    <label class="radio-inline">
                      <input type="radio" name="type" value="interface" v-model="data.type"/>接口
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-success" @click.prevent="add()">创建</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 按钮搜索 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="inputEmail3" class="col-sm-1 control-label">类型</label>
                  <div class="col-sm-10 buttonActive">
                    <input class="btn btn-sm" :class="tabClass.class1 == index? 'btn-info': 'btn-secondary'" type="button" :value="item" v-for="(item,index) in status_button.status" :key="index" @click="switchButton(item,index,1)" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- 结果展示表格 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <!-- 表格 -->
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>行为</th>
                  <th>描述</th>
                  <th>类型</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>152658</td>
                  <td>manage/goods/ajax_goods_list</td>
                  <td>商品列表</td>
                  <td>接口</td>
                  <td>
                    <button type="button" class="btn btn-success btn-sm">
                      <i class="glyphicon glyphicon-pencil"></i>分配权限
                    </button>
                    <button type="button" class="btn btn-info btn-sm">
                      <i class="glyphicon glyphicon-pencil"></i>编辑
                    </button>
                    <button type="button" class="btn btn-danger btn-sm">
                      <i class="glyphicon glyphicon-trash"></i>删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      data:{
        router_url:'',
        behavior_name:'',
        type:'',
      },
      //分类搜索按钮切换高亮
      tabClass: {
        class1: 0,
      },
      //分类搜索按钮内容
      status_button: {
        status: ["全部", "正常", "删除"],
      },
    }
  },
  methods:{
    // 创建行为
    add(){
      let params = {
        router_url:this.data.router_url,
        behavior_name:this.data.behavior_name,
        type:this.data.type
      }
      console.log(params)
      return;
      this.$axios
        .post(
          this.$root.urlPath.NEW + "/user/getUserInfo",
          this.$qs.stringify({
            params
          })
        )
        .then(res => {
          if (res.data.success) {
            //成功
            alert("创建成功");
          } else {
            //失败
            alert("创建失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 分类搜索按钮切换高亮
    switchButton(item,index, type) {
      console.log(item)
      if (type == 1) {
        this.tabClass.class1 = index;
      }
      // 根据类型发请求获取对应数据
      // this.getlist()
    },
    // 页面跳转方法
    jumpTo(url){
      window.location.href = `${this.$root.urlPath.SCM}/usermanage/${url}`;
    }
  }
};
</script>

<style scoped>

/* 主盒子 */
#mainBox{
    /* 防止点击侧栏展开收起操作时页面产生抖动 */
    min-height: 700px; 
}
/* 主盒子 */

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

/* 表格 */
.statusitem {
  color: #66cc00;
}
/* 表格 */


</style>