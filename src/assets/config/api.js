/**
 * Created by Z97 on 2017/6/15.
 */
import Axios from 'axios'
import qs from 'qs'
import {
  getCookie
} from '../commonjs/util'
Axios.defaults.baseURL = 'http://150.0.1.149:9090/api/1'; //接口地址

Axios.defaults.withCredentials = true; //让ajax携带cookie
Axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;text/html;charset=UTF-8'; //配置请求头
Axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  const uid = localStorage.getItem('uid')
  // 判断请求的类型
  // 如果是post请求就把默认参数拼到data里面
  // 如果是get请求就拼到params里面
  if (config.method === 'post') {
    let data = qs.parse(config.data)
    config.data = qs.stringify({
      token: getCookie('token'),
      ...config.data
    })
  } else if (config.method === 'get') {
    config.params = {
      token: getCookie('token'),
      ...config.params
    }
  }
  return config;
}, function (error) {
  return Promise.reject(error);
})

// Axios.defaults.headers['token'] = '5e1439171ea8492e89ea679091f9fb19'

var ENV = "test"; // 控制开关,dev 开发环境，release,master环境时改为prod
export default {
  pathUrl: function () {
    var URLS = {
      dev: {
        UPLOAD: '/upload', //测试上传地址
        SCM: 'http://dev.scm.admin.smimovie.com', //前端地址
        MJK: 'http://dev.scm.admin.smimovie.com:9090', //请求地址
        WEB_URL: {
          WEB_MIAO: ''
        }
      },
      prod: {
        UPLOAD: 'http://www.miningcircle.com', //图片上传地址
        SCM: 'http://scm.admin.smimovie.com', //前端地址
        MJK: 'http://dev.scm.admin.smimovie.com', //请求地址
        WEB_URL: {
          WEB_MIAO: ''
        }
      },
      test: {
        UPLOAD: 'http://www.miningcircle.com', //图片上传地址
        SCM: 'http://scm.admin.smimovie.com', //前端地址
        MJK: 'http://150.0.1.128:9090', //请求地址
        WEB_URL: {
          WEB_MIAO: ''
        }
      }
    }
    return URLS[ENV];
  }
}
