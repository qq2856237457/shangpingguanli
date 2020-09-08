import React, {Component} from "react";
import {Card, Form, Input, Cascader, Upload, Button} from "antd";

import LinkButton from "../../components/link-button";
import ArrowLeftOutlined from "@ant-design/icons/lib/icons/ArrowLeftOutlined";
import {reqCategorys} from "../../api";
import PicturesWall from './pictures-wall';
import RichTextEditor from "./rich-text-editor";

const {Item} = Form;
const {TextArea} = Input;


/*
* Product添加和更新子路由组件
* */

// 1.子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
// 2.父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
/*
* 使用ref
*   1.创建ref容器：this.pw=React.createRef()
*   2.将ref容器交给需要获取的标签元素<PicturesWall ref={this.pw}/>
*   3.通过ref容器读取标签元素：this.pw.current
* */

export default class ProductAddUpdate extends Component {
  formRef = React.createRef();

  state = {
    options: []
  };

  constructor(props) {
    super(props);

    // 创建用来保存ref标识的标签对象容器
    this.pw=React.createRef()
  }

  initOptions = async (categorys) => {
    // 根据category生成option数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false   //默认不是叶子
    }));

    // 如果是一个二级分类的商品的更新
    const {isUpdate, product} = this;
    const {pCategoryId, categoryId} = product

    if (isUpdate && pCategoryId !== '0') {
      // 获取响应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      // 生成二级下拉列表的options
      const cOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }));

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)

      // 关联对应的一级option上
      targetOption.children = cOptions

    }
    // 更新状态
    this.setState({
      options
    })
  };

  getCategorys = async (parentId) => {
    // async  函数的返回值是一个新的promise对象，promise的结果和值是有async的结果来决定的

    // 可以获取一级或二级列表
    const result = await reqCategorys(parentId);
    const res = result.data;
    if (res.status === 0) {
      const categorys = res.data;
      if (parentId === '0') {
        // 如果是一级列表
        this.initOptions(categorys)
      } else {//二级列表
        return categorys //返回二级列表===>当前async函数返回的promise就会成功且value为categorys
      }
    }
  };


  // 用来加载下一级列表的回调函数
  loadData = async selectedOptions => {

    // 得到的option
    const targetOption = selectedOptions[selectedOptions.length - 1];

    // 显示loading效果
    targetOption.loading = true;

    // 根据选中的分类，异步获取二级列表 await得到的是promise的返回的值
    const subCategorys = await this.getCategorys(targetOption.value);

    // 隐藏loading效果
    targetOption.loading = false;


    if (subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表的options
      const cOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }));
      // 关联到当前的option上
      targetOption.children = cOptions
    } else {//当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }


  };

  submit = () => {
    // 进行表单验证，如果通过了，才发送请求
    this.formRef.current.validateFields().then(value => {
      console.log(value);
      const imgs=this.pw.current.getIMgs();
      console.log(imgs)
    }).catch(err => {
      alert('失败')
    })
  };

  validatorPrice = (rule, value, callback) => {
    // 验证价格的自定义函数
    if (value * 1 > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  };


  componentDidMount() {
    this.getCategorys('0')
  }

  componentWillMount() {

    // 取出携带的state
    const product = this.props.location.state;  //如果是添加，没有值，否则有值
    // 保存是否是更新的标识
    this.isUpdate = !!product;  //强制转换为布尔值
// 保存商品（如果没有，则是空对象）
    this.product = product || {}
  }

  render() {

    const {isUpdate, product} = this;
    const {pCategoryId, categoryId,imgs} = product;

    // 用来接收级联分类ID的数组
    const categoryIds = [];

    if (isUpdate) {
      if (pCategoryId === '0') {
        // 如果商品是一个一级分类商品
        categoryIds.push(categoryId);
      } else {
        // 如果商品是一个二级分类商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }

    }

    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: {span: 2},  //左侧label的宽度
      wrapperCol: {span: 8},// 右侧包裹的宽度
    };
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
            <ArrowLeftOutlined style={{fontSize: 20}}/>
            <span>{isUpdate ? '修改商品' : '添加商品'}</span>
        </LinkButton>
      </span>
    );
    return (
      <Card title={title}>
        <Form {...formItemLayout} ref={this.formRef}>
          <Item
            label='商品名称'
            name={'name'}
            initialValue={product.name}
            rules={[{required: true, whitespace: true, message: '请输入商品名称'}]}
          >
            <Input placeholder={'请输入商品名称'}/>
          </Item>
          <Item
            label='商品描述'
            name={'desc'}
            initialValue={product.desc}
            rules={[{required: true, whitespace: true, message: '请输入商品描述'}]}
          >
            <TextArea placeholder="请输入商品描述" autoSize={{minRows: 2, maxRows: 6}}/>
          </Item>
          <Item
            label='商品价格'
            name={'price'}
            initialValue={product.price}
            rules={[
              {required: true, whitespace: true, message: '请输入商品价格'},
              {validator: this.validatorPrice}
            ]}
          >
            <Input type='number' placeholder={'请输入商品价格'} addonAfter={'元'}/>
          </Item>
          <Item
            label='商品分类'
            name={'categoryIds'}
            rules={[{required: true, message: '请选择商品分类'}]}
          >
            <Cascader
              options={this.state.options}
              loadData={this.loadData}
              placeholder={'请选择商品分类'}
            />
          </Item>
          <Item
            label='商品图片'
          >
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item
            label='商品详情'
            labelCol={{span:2}}
            wrapperCol={{span:20}}
          >
            {/*<RichTextEditor/>*/}
          </Item>
          <Item>
            <Button type={'primary'} onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
