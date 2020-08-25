/**
 * 根据接口文档定义接口请求
 *包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是Promise
 * */

import ajax from './ajax';
import jsonp from "jsonp";

const BASE='';

// 登录
// export function reqLogin(username,password) {
//   return ajax('./login',{username,password},'POST')
// }
export const reqLogin = (username, password) => ajax(BASE+'/login', {username, password}, 'POST');


// 添加用户
export const reqAddUser = (user) => ajax(BASE+'/manage/user/add', user, 'POST');

// 获取一级/二级分类列表
export const reqCategorys=(parentId)=>ajax(BASE+'/manage/category/list',{parentId});

// 添加分类
export const reqAddCategory=(categoryName,parentId)=>ajax(BASE+'/manage/category/add',{categoryName,parentId},'POST');

// 更新分类
export const reqUpdateCategory=(categoryId,categoryName)=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST');


// 获取天气信息
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=E4805d16520de693a3fe707cdc962045`;
    jsonp(url,{},(err,data)=>{
      // 如果成功了
      if (!err&&data.status==='success'){
        const {dayPictureUrl,weather}=data.result[0].weather_data[0];
        console.log('成功了---')
        resolve({dayPictureUrl,weather})
      }else {
        console.log('失败了----')
        reject({dayPictureUrl:'',weather:'晴天'})
      }
    })
  })
};












