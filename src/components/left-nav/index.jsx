import React, {Component} from "react";
import {Menu, } from 'antd';
import {Link,withRouter} from 'react-router-dom'


import './index.less'
import logo from "../../assets/images/logo.png";
import menuList from "../../config/menuConfig";

const {SubMenu} = Menu;

class LeftNav extends Component {

  getMenuNodes = (menuList) => {
    const path=this.props.location.pathname;
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>
        )
      } else {
        // 查找一个与当前路径匹配的子item
        const cItem=item.children.find(cItem=>cItem.key===path);
        // 如果存在说明当前item的子列表需要打开
        if(cItem){
          this.openKey=item.key
        }
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        )
      }
    })
  };

  componentWillMount() {
    this.menuNodes=this.getMenuNodes(menuList)
  }

  render() {
    const path=this.props.location.pathname;
    const openKey=this.openKey;
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