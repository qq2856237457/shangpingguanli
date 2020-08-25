import React, {Component} from "react";
import {Redirect, Route, Switch} from 'react-router-dom'
import {Layout} from 'antd';

import memoryUtils from "../../utils/memoryUtils";
import Header from "../../components/header";
import LeftNav from "../../components/left-nav";

import Category from "../category/category";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";
import Home from "../home/home";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import Order from "../order/order";


const {Footer, Sider, Content} = Layout;
/*
* 后台页面的路由组件
* */
export default class Admin extends Component {
  render() {
    const user = memoryUtils.user;
    if (!user || !user._id) {
      return <Redirect to="/login"/>
    }
    return (
      <Layout style={{height: "100%"}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>header</Header>
          <Content style={{margin:20,backgroundColor: "#fff"}}>
            <Switch>
              <Route path={'/home'} component={Home}/>
              <Route path={'/category'} component={Category}/>
              <Route path={'/product'} component={Product}/>
              <Route path={'/role'} component={Role}/>
              <Route path={'/user'} component={User}/>
              <Route path={'/charts/bar'} component={Bar}/>
              <Route path={'/charts/line'} component={Line}/>
              <Route path={'/charts/pie'} component={Pie}/>
              <Route path={'/order'} component={Order}/>
              <Redirect to={'/home'}/>
            </Switch>
          </Content>
          <Footer style={{textAlign: "center", color: "#7d7d7d"}}>推荐使用谷歌浏览器，以获得最好的体验</Footer>
        </Layout>
      </Layout>
    )
  }

}