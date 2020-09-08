import React from "react";
import PropTypes from "prop-types";
import {Form, Input} from 'antd';




export default class UpdateForm extends React.Component {
  formRef = React.createRef();
  static propTypes={
    categoryName:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  };

  componentWillMount() {
    // 将formRef对象通过setForm（）传递给父组件
    this.props.setForm(this.formRef)
  }



  render() {
    const {categoryName}=this.props;

    return (
      <Form ref={this.formRef} name="update-ref" >

        <Form.Item
          name="categoryName"
          label="分类名称"
          initialValue={categoryName}
          rules={[{required: true, whitespace: true, message: '请输入分类名称'}]}
        >
          <Input placeholder={'请输入分类名称'}/>
        </Form.Item>
      </Form>
    );
  }
}
