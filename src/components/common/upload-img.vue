<template>
  <div style="display: inline-block;" class="example-avatar">
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>Drop files to upload</h3>
    </div>
    <!--<div class="up_logo clearfix">-->
    <div class="avatar-upload clearfix" v-show="!edit">
      <div class="text-center img-out p-2">
        <label for="avatar" class="avatarLabel">
          <file-upload
            multiple
            :thread="10"
            extensions="gif,jpg,jpeg,png"
            accept="image/png, image/gif, image/jpeg"
            class="butn"
            :data="extraData"
            name="imgFile"
            :post-action="uploadUrl"
            v-model="files"
            @input-filter="inputFilter"
            @input-file="inputFile"
            ref="upload"
          >
            <img :src="files.length ? files[0].url : headImg" class="rounded-circle cp" />
          </file-upload>
        </label>
      </div>
    </div>
    <!--</div>-->
    <div class="avatar-edit" v-show="files.length && edit">
      <div class="avatar-edit-image" v-if="files.length">
        <img ref="editImage" :src="files[0].url" />
        <div class="text-center p-4 opt-group">
          <button type="button" class="btn cancle" @click.prevent="$refs.upload.clear">取消</button>
          <button type="submit" class="btn bg-green col-white" @click.prevent="editSave">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Cropper from "cropperjs";
import FileUpload from "vue-upload-component";
export default {
  components: {
    FileUpload
  },
  props: ["headImg"],
  data() {
    return {
      imgError: false,
      files: [], //存放在组件的file对象
      edit: false,
      cropper: false,
      extraData: {
        0: "", //表示uid
        1: "90:160,xxs,xs,s,m,l,xl,xxl", //表示压缩格式,nocompress表示不压缩
        2: "" //表示名字
      },
      uploadUrl: this.$root.urlPath.MJK + "/api/1/file/fileUpload",
      imgObj: ""
    };
  },
  watch: {
    edit(value) {
      if (value) {
        this.$nextTick(function() {
          if (!this.$refs.editImage) {
            return;
          }
          let cropper = new Cropper(this.$refs.editImage, {
            aspectRatio: 1 / 1,
            viewMode: 1
          });
          this.cropper = cropper;
        });
      } else {
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = false;
        }
      }
    }
  },
  methods: {
    editSave() {
      this.edit = false;
      let oldFile = this.files[0];
      let binStr = atob(
        this.cropper
          .getCroppedCanvas()
          .toDataURL(oldFile.type)
          .split(",")[1]
      );
      let arr = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      var file = new Blob([arr], {
        type: {
          type: oldFile.type
        }
      });
      this.$refs.upload.update(oldFile.id, {
        file,
        type: file.type,
        size: file.size,
        active: true
      });
    },
    alert(message) {
      layer.msg(message);
    },
    inputFile(newFile, oldFile, prevent) {
      // 当 add, update, remove File 这些事件的时候会触发
      if (newFile && !oldFile) {
        this.$nextTick(function() {
          this.edit = true;
        });
      }
      if (!newFile && oldFile) {
        this.edit = false;
      }
      // 上传完成
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // 获得相应数据
        if (newFile.xhr && newFile.xhr.status === 200) {
          this.$emit("imgUrl", newFile.response.data); // 更新值
        }
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(jpg|jpeg|png|gif)$/i.test(newFile.name)) {
          layer.msg("请选择一张合适的图片！");
          return prevent();
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = "";
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file);
        }
      }
      if (this.files[0] != undefined) {
        if (this.files[0].response.__ob__ == null) {
          this.$emit("transferUser", this.files[0].response);
        }
      }
    }
  }
};
</script>
<style>
.upload-out .t-right {
  margin-top: 60px;
}

.avatar-edit {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.9);
}

.avatar-edit-image {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 550px;
  height: 400px;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
}

.opt-group {
  width: 100%;
  background: rgba(255, 255, 255, 0.4);
  position: absolute;
  left: 0;
  top: 100%;
}

.cancle:hover {
  color: #666;
}
.example-avatar label {
  margin-bottom: 0px;
}
.example-avatar .avatarLabel {
  height: 92px;
}
.example-avatar .avatar-upload .rounded-circle {
  width: 140px;
  height: 140px;
  vertical-align: top;
}

.example-avatar .text-center .btn {
  margin: 0 0.5rem;
}

.example-avatar .avatar-edit-image {
  max-width: 100%;
}

.example-avatar .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: 0.6;
  text-align: center;
  background: #000;
}

.example-avatar .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}

.cropper-view-box,
.cropper-face {
  border-radius: 10%;
}
/*!  
 * Cropper.js v1.0.0-rc  
 * https://github.com/fengyuanchen/cropperjs  
 *  
 * Copyright (c) 2017 Fengyuan Chen  
 * Released under the MIT license  
 *  
 * Date: 2017-03-25T12:02:21.062Z  
 */

.cropper-container {
  font-size: 0;
  line-height: 0;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  direction: ltr;
  -ms-touch-action: none;
  touch-action: none;
}

.cropper-container img {
  /* Avoid margin top issue (Occur only when margin-top <= -height) */
  display: block;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  width: 100%;
  height: 100%;
  image-orientation: 0deg;
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.cropper-wrap-box {
  overflow: hidden;
}

.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}

.cropper-modal {
  opacity: 0.5;
  background-color: #000;
}

.cropper-view-box {
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}

.cropper-dashed {
  position: absolute;
  display: block;
  opacity: 0.5;
  border: 0 dashed #eee;
}

.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px;
}

.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px;
}

.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0;
  height: 0;
  opacity: 0.75;
}

.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: " ";
  background-color: #eee;
}

.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px;
}

.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px;
}

.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.cropper-face {
  top: 0;
  left: 0;
  background-color: #fff;
}

.cropper-line {
  background-color: #39f;
}

.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize;
}

.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize;
}

.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize;
}

.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize;
}

.cropper-point {
  width: 5px;
  height: 5px;
  opacity: 0.75;
  background-color: #39f;
}

.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize;
}

.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize;
}

.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize;
}

.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize;
}

.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize;
}

.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize;
}

.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize;
}

.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 1;
}

@media (min-width: 768px) {
  .cropper-point.point-se {
    width: 15px;
    height: 15px;
  }
}

@media (min-width: 992px) {
  .cropper-point.point-se {
    width: 10px;
    height: 10px;
  }
}

@media (min-width: 1200px) {
  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    opacity: 0.75;
  }
}

.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: " ";
  opacity: 0;
  background-color: #39f;
}

.cropper-invisible {
  opacity: 0;
}

.cropper-bg {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
}

.cropper-hide {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
}

.cropper-hidden {
  display: none !important;
}

.cropper-move {
  cursor: move;
}

.cropper-crop {
  cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
</style>
</style>