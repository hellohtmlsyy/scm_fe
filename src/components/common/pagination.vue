<template>
  <ul>
    <!-- 分页 -->
    <nav aria-label="Page navigation" align="right">
      <ul class="pagination">
        <li v-if="page>1" v-on:click="page--,pageClick()">
          <a href="javascript:void(0)" aria-label="Previous">
            <span class="fa fa-chevron-left" aria-hidden="true"></span>
          </a>
        </li>
        <li v-if="page==1">
          <a href="javascript:void(0)" aria-label="Previous" class="banclick">
            <span class="fa fa-chevron-left" aria-hidden="true"></span>
          </a>
        </li>
        <li
          class="page"
          v-for="(item, index) in indexs"
          :key="index"
          :class="{active: page === item}"
          v-on:click="btnClick(item),pageClick()"
        >
          <a href="javascript:;">
            <span>{{item}}</span>
          </a>
        </li>
        <li v-if="page!=totalPage" v-on:click="page++,pageClick()">
          <a href="javascript:;" aria-label="Next">
            <span class="fa fa-chevron-right" aria-hidden="true"></span>
          </a>
        </li>
        <li v-if="page==totalPage">
          <a href="javascript:;" aria-label="Next" class="banclick">
            <span class="fa fa-chevron-right" aria-hidden="true"></span>
          </a>
        </li>
        <li>
          <a href="javascript:;">
            共
            <i>{{totalPage}}</i>页
          </a>
        </li>
      </ul>
    </nav>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      page: 1 //当前页数
    };
  },
  props: ["totalPage"],
  computed: {
    indexs() {
      var left = 1;
      var right = this.totalPage;
      var arr = [];
      if (this.totalPage >= 7) {
        if (this.page > 4 && this.page < this.totalPage - 3) {
          left = this.page - 3;
          right = this.page + 3;
        } else if (this.page <= 4) {
          left = 1;
          right = 7;
        } else {
          left = this.totalPage - 6;
          right = this.totalPage;
        }
      }
      while (left <= right) {
        arr.push(left);
        left++;
      }
      return arr;
    }
  },
  methods: {
    btnClick(num) {
      if (num != this.page) {
        this.page = num;
      }
    },
    pageClick() {
      this.$emit("pagesClick", this.page);
    },
    pageSkip() {
      var maxPage = this.totalPage;
      var skipPage = Number(
        document.getElementsByClassName("jumppage")[0].value
      );
      console.log(typeof skipPage);
      if (!skipPage) {
        alert("请输入跳转页码");
        return;
      } else if (skipPage < 1 || skipPage > maxPage) {
        alert("您输入的页码超过页数范围了！");
        return;
      } else {
        //this.page=skipPage;
        this.btnClick(skipPage);
        this.pageClick();
      }
    }
  }
};
</script>
<style scoped>
.banclick {
  cursor: not-allowed;
}
.active a {
  color: #fff;
  cursor: default;
  background-color: #337ab7;
  border-color: #337ab7;
}
i {
  font-style: normal;
  color: #d44950;
  margin: 0px 4px;
  font-size: 12px;
}
.jumpbox .jumppage {
  border: 1px solid #ddd;
  margin-left: 40px;
  height: 33px;
  width: 40px;
  float: left;
}
.jumpbox .jumpbtn {
  cursor: pointer;
  margin-left: 10px;
}
</style>