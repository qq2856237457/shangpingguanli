import React, {Component} from "react";
import {Redirect} from 'react-router-dom'
import {Form, Input, Button, message} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

import {reqLogin} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

import './login.less';
import logo from '../../assets/images/logo.png';


/*
* 登录的路由组件
* */
export default class Login extends Component {
  onFinish = async values => {
    if (values) {
      const {username, password} = values;
      const response = await reqLogin(username, password);
      const result = response.data;
      if (result.status === 0) {
        message.success('登录成功！');
        const user = result.data;
        memoryUtils.user = user;
        storageUtils.saveUser(user);
        this.props.history.replace('/')
      } else {
        message.error(result.msg)
      }
    } else {
      console.log("检验失败")
    }
  };

  render() {
    const user = memoryUtils.user;
    if (user && user._id) {
      return <Redirect to='/'/>
    }
    return (
      <div className={'login'}>
        <header className={'login-header'}>
          <img src={logo} alt="logo"/>
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className={'login-content'}>
          <h2>用户登录</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{remember: true}}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {required: true, whitespace: true, message: '请输入用户名'},
                {min: 4, message: '用户名至少要有4位'},
                {max: 12, message: '用户名最多不超过12位'},
                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成'}
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {required: true, whitespace: true, message: '请输入密码'},
                {min: 4, message: '密码至少要有4位'},
                {max: 12, message: '密码最多不超过12位'},
                {pattern: /^[a-zA-Z0-9.]+$/, message: '密码必须是英文、数字或.组成'}
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon"/>}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )

  }
}