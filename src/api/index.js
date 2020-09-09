/**
 * 根据接口文档定义接口请求
 *包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是Promise
 * */

import ajax from './ajax';
import jsonp from "jsonp";
import product from "../pages/product/product";

const BASE = '';

// 登录
// export function reqLogin(username,password) {
//   return ajax('./login',{username,password},'POST')
// }
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');


// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST');

// 获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId});

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {
  categoryName,
  parentId
}, 'POST');

// 更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', {
  categoryId,
  categoryName
}, 'POST');

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId});

// 获取商品列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize});


// 更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {
  productId,
  status
}, 'POST');


/*
搜索商品分页列表，（根据商品名称/商品描述）
searchType:搜索的类型，productName,productDesc
*/
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search',
  {
    pageNum,
    pageSize,
    [searchType]: searchName
  }
);

// 删除指定商品名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST');

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST');

// 修改商品
// export const reqUpdateProduct=(product)=>ajax(BASE+'/manage/product/update',product,'POST');

// 获取天气信息
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=E4805d16520de693a3fe707cdc962045`;
    jsonp(url, {}, (err, data) => {
      // 如果成功了
      if (!err && data.status === 'success') {
        const {dayPictureUrl, weather} = data.result[0].weather_data[0];
        console.log('成功了---');
        resolve({dayPictureUrl, weather})
      } else {
        console.log('失败了----');
        reject({dayPictureUrl: '', weather: '晴天'})
      }
    })
  })
};













