<template>
  <div class="row" id="mainBox">
    <div class="col-lg-12">
      <!-- 大标题 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <h1>权限赋予：超级管理员</h1>
        </div>
      </div>
      <!-- 复选框 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <table class="table table-bordered">
                <tbody>
                   <tr v-for="(item,index) in allmenu" :key="index">
                    <td>{{item.url}}</td>
                    <td>{{item.menuName}}</td>
                    <td><p><input type="checkbox" name="rigths" :value="item.id" v-model="rigths" /></p></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- 保存按钮 -->
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form class="form-horizontal">
                <div class="form-group">
                  <div class="col-sm-10">
                    <!-- <input type="email" class="form-control" id="inputEmail3" placeholder="Email" /> -->
                    <input class="btn btn-danger" type="button" value="保存" @click.prevent="add()" />
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
  data(){
    return{
      id: this.$route.query.id,  //地址栏中的id值
      rigths:[],  //用户选择的值
      allmenu:[],  //获取全部菜单
    }
  },
  mounted(){
    this.getMenu()  //获取菜单，渲染页面复选框数据
    this.getRights()  //获取用户已有权限
  },
  methods:{
    getMenu(){  //获取菜单，渲染页面上的权限复选框
      console.log('获取菜单')
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/menu/allmenu")
        .then(res => {
          if (res.data.code==200) {
            //成功
            this.allmenu = res.data.data
          } else {
            //失败
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    add(){
      console.log('保存')
      console.log(this.rigths.sort())
      //请求头配置对象
      let config = { headers: { "Content-Type": "application/x-www-form-urlencoded;text/html;charset=UTF-8" } }; 
      
      this.$axios
        .post(
          this.$root.urlPath.MJK + "/api/1/roleMenu/create_roleMenu",{
            roleId:this.id,
            menuId:this.rigths.sort(),
          },config)
        .then(res => {
          if (res.data.code==200) {
            //成功
            layer.msg("成功");
            window.setTimeout(function(){
              window.location.href = "/usermanage/group";
            },2000)
          } else {
            //失败
            layer.msg("失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getRights(){  //获取用户已有权限
     console.log('获取用户已有权限')
     let params = {
       id:this.id
     }
      this.$axios
        .get(this.$root.urlPath.MJK + "/api/1/roleMenu/find_menuUrl",{
          params:params
        })
        .then(res => {
          if (res.data.code == 200) {
            //成功
            this.rigths = res.data.data.menuId
            // console.log(res.data.data.menuId)
          } else {
            //失败
          }
        })
        .catch(err => {
          console.log(err);
        });

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
h1 {
  font-weight: 800;
}
</style>