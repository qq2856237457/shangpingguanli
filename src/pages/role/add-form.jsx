import React from "react";
import PropTypes from "prop-types";
import {Form, Input} from 'antd';



export default class AddForm extends React.Component {
  formRef = React.createRef();
  static propTypes = {
    setForm: PropTypes.func.isRequired,     //用来传递form对象
  };

  componentWillMount() {
    this.props.setForm(this.formRef)
  }

  render() {
    return (
      <Form ref={this.formRef} >
        <Form.Item
          name="roleName"
          label="角色名称"
          rules={[{required: true, whitespace: true, message: '请输入角色名称'}]}
        >
          <Input placeholder={'请输入角色名称'}/>
        </Form.Item>
      </Form>
    );
  }
}
