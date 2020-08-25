/*
* 能发送异步的ajax请求的函数模块
* 封装axios库
* 函数的返回值是promise对象
* 优化：统一处理请求异常？
*      在外层包一层自己常创建的Promise对象
*       在请求出错时，不reject，而是显示错误提示
* */

import axios from 'axios';
import {message} from "antd"

export default function ajax(url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise;
    // 执行异步ajax请求
    if (type === 'GET') {    // 发送GET请求
      promise = axios.get(url, {// 配置对象
        params: data //指定请求参数
      })
    } else {// 发送POST请求
      promise = axios.post(url, data)
    }

    promise.then(response => {
      // 如果成功了，调用resolve函数
      resolve(response)
    }).catch(err => {
      // 如果失败了，不调用reject，而是提示异常信息
      message.error("请求出错啦! " + err.message)
    })
  });


}