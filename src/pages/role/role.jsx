import React, {Component} from "react";
import {Button, Card, message, Modal, Table} from "antd";
import {PAGE_SIZE} from "../../utils/constants";

import {reqRoles, reqAddRole, reqUpdateRole} from "../../api";
import AddForm from './add-form';
import AuthForm from "./auth-form";
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from '../../utils/dateUtils'

/*
* 角色路由
* */
export default class Role extends Component {
  state = {
    roles: [],        //表单数据
    role: {},          //点击确认的表单数据
    isShowAdd: false,   //是否显示添加框
    isShowAuth: false    //权限设置框
  };

  constructor(props) {
    super(props);
    this.auth = React.createRef()
  }

  getRoles = async () => {
    const result = await reqRoles();
    const res = result.data;
    if (res.status === 0) {
      const roles = res.data;
      this.setState({
        roles
      })
    }
  };


  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render:formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render:formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
  };

  onRow = (role) => {
    return {
      onClick: event => {  //点击行
        this.setState({
          role
        })
      },
    }
  };

  addRole = () => {
    this.form.current.validateFields().then(async value => {
      // 隐藏确认框
      this.setState({
        isShowAdd: false
      });
      // 收集输入数据
      const {roleName} = value;

      // 清除数据
      this.form.current.resetFields();
      // 请求添加
      const result = await reqAddRole(roleName);
      const res = result.data;
      // console.log(res)
      if (res.status === 0) {
        message.success('添加角色成功');
        // 更新roles状态
        const role = res.data;
        // const roles = [...this.state.roles];
        // roles.push(role);
        // this.setState({roles});

        // 根据原本数据更新roles状态，函数的方法改变状态
        this.setState(state => ({
          roles: [...state.roles, role]
        }))


      } else {
        message.error('添加角色失败');
      }
    })
  };

  /*
  * 更新角色
  * */
  updateRole = async () => {
    // 隐藏确认框
    this.setState({
      isShowAuth: false
    });

    const role = this.state.role;
    // 得到最新的menus
    const menus = this.auth.current.getMenus();
    // 设置选中的role的menu
    role.menus = menus;
    role.auth_time = Date.now();
    role.auth_name = memoryUtils.user.username;
    // 请求更新
    const result = await reqUpdateRole(role);
    const res = result.data;

    if (res.status === 0) {
      message.success("设置角色权限成功");

      this.setState({
        roles: [...this.state.roles]
      })

    }
  };


  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {
    const {roles, role, isShowAdd, isShowAuth} = this.state;
    const title = (
      <span>
        <Button type='primary'
                onClick={() => {
                  this.setState({isShowAdd: true})
                }}
        >
          创建角色
        </Button>&nbsp;&nbsp;
        <Button type='primary'
                disabled={!role._id}
                onClick={() => {
                  this.setState({isShowAuth: true})
                }}
        >
          设置权限
        </Button>
      </span>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
          rowSelection={{type: 'radio', selectedRowKeys: [role._id]}}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false});
            this.form.current.resetFields()
          }}
        >
          <AddForm
            setForm={(form) => {
              this.form = form
            }}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({isShowAuth: false});
          }}
        >
          <AuthForm
            ref={this.auth}
            role={role}
          />
        </Modal>
      </Card>
    )
  }

}