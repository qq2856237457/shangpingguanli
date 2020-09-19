import React, {PureComponent} from "react";
import {Button, Card, Table, Modal, message} from "antd";

import {reqDeleteUsers, reqUsers, reqAddOrUpdateUser} from "../../api";
import LinkButton from "../../components/link-button";
import {formateDate} from "../../utils/dateUtils";
import {PAGE_SIZE} from "../../utils/constants";
import UserForm from "./userform";


export default class User extends  PureComponent {
  state = {
    users: [],     //所有用户列表
    roles: [],     //所有角色列表
    isShow: false,  //是否显示确认框
  };


  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.state.roles.find(role => role._id === role_id).name
      }
      ,
      {
        title: '操作',
        render: (user) => (
          <span>
           <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
           <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
         </span>
        )
      }
    ]
  };

  deleteUser = (user) => {
    // console.log(user)
    // 删除指定用户
    Modal.confirm({
      title: `确认删除${user.username}吗？`,
      onOk: async () => {
        const result = await reqDeleteUsers(user._id);
        const res = result.data;
        if (res.status === 0) {
          message.success('删除用户成功');
          this.getUsers()
        }
      }
    })

  };

  showAdd = () => {
    // 显示添加界面
    this.user = null;
    this.setState({
      isShow: true,
    });


  };

  showUpdate = (user) => {
    // 显示修改界面
    this.user = user;   //保存user
    this.setState({
      isShow: true,
    });

  };

  addOrUpdateUser = () => {
    // 修改或添加用户
    this.setState({
      isShow: false
    });

    // 1.收集数据
    this.form.current.validateFields().then(async value => {
      const user = value;
      this.form.current.resetFields();
      // 如果是更新，需要给user指定_id属性
      if (this.user) {
        user._id = this.user._id;
      }
      // 2.提交添加请求
      const result = await reqAddOrUpdateUser(user);
      const res = result.data;
      if (res.status === 0) {
        message.success(`${this.user ? '修改' : '添加'}用户成功`);
        // 3.更新列表显示
        this.getUsers()
      } else {
        message.error('创建用户失败');
      }
    })
  };


  getUsers = async () => {
    const result = await reqUsers();
    const res = result.data;

    const {users, roles} = res.data;
    this.setState({
      users,
      roles
    })
  };


  componentDidMount() {
    this.getUsers()
  }

  componentWillMount() {
    this.initColumns()
  }

  render() {
    const {users, isShow, roles} = this.state;
    const user = this.user || {};
    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>;
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
        />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.current.resetFields();
            this.setState({isShow: false});
          }}
        >
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
            user={user}
          />
        </Modal>

      </Card>
    )
  }

}