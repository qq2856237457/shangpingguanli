import React from "react";
import PropTypes from "prop-types";
import {Form, Input, Tree,} from 'antd';

import menuList from "../../config/menuConfig";

const {Item} = Form;

export default class AuthForm extends React.Component {
  static propTypes = {
    role: PropTypes.object
  };

  constructor(props) {
    super(props);
    const {menus} = this.props.role;
    this.state = {
      checkedKeys: menus
    }
  }


  onCheck = checkedKeys => {
    this.setState({checkedKeys});
  };

  // 为父组件提供最新menus的方法
  getMenus = () => this.state.checkedKeys;

  // 根据新传入的role来更新checkedKeys状态,
  /*
  * 当组件接收到新的属性时自动调用
  * */
  componentWillReceiveProps(nextProps, nextContext) {
    const menus = nextProps.role.menus;
    this.setState({
      checkedKeys: menus
    })
  }


  render() {
    const {role} = this.props;
    return (
      <div>
        <Item
          label="角色名称"
        >
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          treeData={menuList}
          defaultExpandAll={true}
          checkedKeys={this.state.checkedKeys}
          onCheck={this.onCheck}
        />
      </div>
    );
  }
}
