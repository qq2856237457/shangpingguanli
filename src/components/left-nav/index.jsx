import React, {Component} from "react";
import {Menu,} from 'antd';
import {Link, withRouter} from 'react-router-dom'


import './index.less'
import logo from "../../assets/images/logo.png";
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";

const {SubMenu} = Menu;

class LeftNav extends Component {
  /*
  * 判断当前用户对item是否有权限管理
  *
  * */
  hasAuth = (item) => {
    const {key, isPublic} = item;
    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;
    /*1.如果当前管理员是admin
      2.如果当前item是公开的
      3.当前用户有此item的权限：key有没有menus中
     */
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      //  如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => (menus.indexOf(child.key) !== -1))
    }
    return false;
  };

  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname;
    return menuList.map(item => {
      // 如果当前用户有item对应的权限，才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        if (!item.children) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
          )
        } else {
          // 查找一个与当前路径匹配的子item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
          // 如果存在说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key
          }
          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {
                this.getMenuNodes(item.children)
              }
            </SubMenu>
          )
        }
      }
    })
  };

  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    let path = this.props.location.pathname;
    if (path.indexOf('/product') === 0) {
      // 当前请求的是商品或其子路由界面
      path = '/product'
    }
    const openKey = this.openKey;
    return (
      <div className={'left-nav'}>
        <Link to={''} className={'left-nav-header'}>
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>
        <div style={{width: 200}}>
          <Menu
            selectedKeys={[path]}
            defaultOpenKeys={[openKey]}
            mode="inline"
            theme="dark"
          >
            {
              this.menuNodes
            }
          </Menu>
        </div>
      </div>
    );
  }
}

export default withRouter(LeftNav)