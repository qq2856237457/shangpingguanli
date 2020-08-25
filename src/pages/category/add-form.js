import React from "react";
import PropTypes from "prop-types";
import {Form, Input,  Select} from 'antd';

const {Option} = Select;


export default class AddForm extends React.Component {
  formRef = React.createRef();
  static propTypes = {
    setForm: PropTypes.func.isRequired,     //用来传递form对象
    categorys: PropTypes.array.isRequired,  //一级分类的数组
    parentId: PropTypes.string.isRequired   //父分类的ID
  };

  componentWillMount() {
    this.props.setForm(this.formRef)
  }

  render() {
    const {categorys, parentId} = this.props;

    return (
      <Form ref={this.formRef} name="add-ref">
        <Form.Item
          name="parentId"
          label="所属分类"
          rules={[{required: true, whitespace: true, message: '请选择分类'}]}
        >
          <Select
            allowClear
            defaultValue={parentId}
          >
            <Option value="0">一级分类</Option>
            {
              categorys.map((item) => (<Option key={item._id} value={item._id}>{item.name}</Option>))
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="categoryName"
          label="分类名称"
          rules={[{required: true, whitespace: true, message: '请输入分类名称'}]}
        >
          <Input placeholder={'请输入分类名称'}/>
        </Form.Item>
      </Form>
    );
  }
}
