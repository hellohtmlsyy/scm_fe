export default {

    buttonActive:function(){  //按钮蓝色高亮 + 排他 (按钮父元素需添加buttonActive类名)
        $(".buttonActive>input:first-child").css("background","#31b0d5");
        $(".buttonActive>input").on("click", function() {
          console.log($(this).val());
          $(this).css("background","#31b0d5").siblings().css("background","rgb(153, 153, 153)")
        });
      }

}