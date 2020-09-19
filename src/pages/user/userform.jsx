import React from "react";
import PropTypes from "prop-types";
import {Form, Input, Select} from 'antd';

const {Option} = Select;

export default class UserForm extends React.PureComponent {
  formRef = React.createRef();
  static propTypes = {
    setForm: PropTypes.func.isRequired,     //用来传递form对象
    roles: PropTypes.array.isRequired,       //roles 角色数组
    user: PropTypes.object
  };

  componentWillMount() {
    this.props.setForm(this.formRef)
  }

  render() {

    const {roles,user} = this.props;
    const formItemLayout = {
      labelCol: {span: 4},  //左侧label的宽度
      wrapperCol: {span: 20},// 右侧包裹的宽度
    };
    return (
      <Form {...formItemLayout} ref={this.formRef}>
        <Form.Item
          name="username"
          label="用户名:"
          initialValue={user.username}
          rules={[{required: true, whitespace: true, message: '请输入用户名'}]}
        >
          <Input placeholder={'请输入用户名'}/>
        </Form.Item>
        {
          user._id ? null : (
            <Form.Item
              name="password"
              label="密码:"
              initialValue={user.password}
              rules={[{required: true, whitespace: true, message: '请输入密码'}]}
            >
              <Input type={'password'} placeholder={'请输入密码'}/>
            </Form.Item>
          )
        }
        <Form.Item
          name="phone"
          label="手机号:"
          initialValue={user.phone}
          rules={[{required: true, whitespace: true, message: '请输入手机号'}]}
        >
          <Input placeholder={'请输入手机号'}/>
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱:"
          initialValue={user.email}
          rules={[{required: true, whitespace: true, message: '请输入邮箱'}]}
        >
          <Input placeholder={'请输入邮箱'}/>
        </Form.Item>
        <Form.Item
          name="role_id"
          label="角色"
        >
          <Select defaultValue={user.role_id}>
            {
              roles.map(role => <Option value={role._id} key={role._id}>{role.name}</Option>)
            }
          </Select>
        </Form.Item>
      </Form>
    );
  }
}
