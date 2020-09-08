import React, {Component} from "react";
import {Button, Card, message, Table, Modal} from 'antd';
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

import LinkButton from "../../components/link-button";
import {reqCategorys, reqUpdateCategory, reqAddCategory} from "../../api";
import AddForm from './add-form';
import UpdateForm from "./update-form";


export default class Category extends Component {
  state = {
    loading: false,     //是否正在获取数据中
    categorys: [],     //一级分类列表
    subCategorys: [],   //二级分类列表
    parentId: '0',      //当前需要显示的分类列表的父分类ID
    parentName: '',      //当前需要显示的分类列表的父分类名称
    showStatus: 0      //显示添加/修改的对话框，0--都不显示  1--只显示添加  2--显示修改
  };


  // 初始化Table的所有列的数组
  initColumns = () => {

    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (categorys) => (
          <span>
        <LinkButton onClick={() => {

          this.showUpdate(categorys)
        }}>修改分类</LinkButton>
            {
              //判断父id是否等于0,等于0显示一级分类，否则不显示
              this.state.parentId === '0' ?
                <LinkButton onClick={() => this.showSubcategorys(categorys)}>查看子分类</LinkButton> : null
            }
      </span>
        )
      }
    ];
  };

  // 发送ajax请求异步获取一级/二级分类列表显示
  getCategorys = async (parentId) => {
    parentId = parentId || this.state.parentId;

    this.setState({
      loading: true//发送请求前显示loading
    });
    // 发送ajax请求数据
    const res = await reqCategorys(parentId);

    this.setState({
      loading: false//发送请求后隐藏loading
    });
    const result = res.data;
    if (result.status === 0) {
      const categorys = result.data;

      if (parentId === '0') {
        this.setState({
          categorys
        })
      } else {
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('获取失败')
    }
  };


  // 显示二级分类列表
  showSubcategorys = (categorys) => {

    // 更新状态
    this.setState({
      parentId: categorys._id,
      parentName: categorys.name
    }, () => {
      // 在状态更新且重新render（）后执行(setstate是异步更新状态的)
      // 获取二级分类列表显示
      this.getCategorys()
    });


  };


  // 显示一级分类列表
  showCategorys = () => {
    this.setState({
      subCategorys: [],
      parentId: '0',
      parentName: ''
    })
  };


  // 响应点击取消
  handleCancel = () => {
    // 清除输入数据
    this.form.current.resetFields();
    // 隐藏显示框
    this.setState({
      showStatus: 0
    })
  };

  // 响应点击添加
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  };

  // 响应点击修改
  showUpdate = (category) => {
    this.setState({
      showStatus: 2
    });
    this.category = category
  };

  // 添加
  addCategorys = async () => {
    message.success('添加成功');
    this.setState({
      showStatus: 0
    });
    // 1.收集数据并提交发送请求
    const {parentId, categoryName} = this.form.current.getFieldsValue(['parentId', 'categoryName']);

    // 清除输入数据
    this.form.current.resetFields();
    const result = await reqAddCategory(categoryName, parentId);
    if (result.data.status === 0) {
      // 重新获取分类列表显示
      // if (parentId === this.state.parentId) {
      //   this.getCategorys()
      // } else if (parentId === '0') {//在二级列表下添加一级分类，重新获取一级列表，但是不会显示
      //   this.getCategorys('0')
      // }
      this.getCategorys()
    }

  };

  // 修改
  updateCategorys = async () => {
    message.success('修改成功');
    // 1.修改成功，隐藏确定框
    this.setState({
      showStatus: 0
    });
    // 准备数据
    const categoryId = this.category._id;
    const categoryName = this.form.current.getFieldValue('categoryName');
    console.log(this.form.current);
    // 清除输入数据
    this.form.current.resetFields();
    // 2.发送请求更新分类
    const result = await reqUpdateCategory(categoryId, categoryName);
    if (result.data.status === 0) {
      //3.重新显示列表
      this.getCategorys()
    }

  };

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getCategorys();
  }

  render() {
    const {categorys, loading, parentId, parentName, subCategorys, showStatus} = this.state;
    const category = this.category || {};//如果没有指定空对象

    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <span>--> {parentName}</span>
      </span>
    );
    const extra = (
      <Button type={"primary"} onClick={this.showAdd}>
        <PlusOutlined/> 添加
      </Button>
    );
    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            loading={loading}
            bordered
            rowKey='_id'
            columns={this.columns}
            dataSource={parentId === '0' ? categorys : subCategorys}
            pagination={{defaultPageSize: 5, showQuickJumper: true}}
          />
        </Card>
        <Modal
          title="添加"
          visible={showStatus === 1}
          onOk={this.addCategorys}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => {
              this.form = form
            }}
          />
        </Modal>
        <Modal
          title="修改"
          visible={showStatus === 2}
          onOk={this.updateCategorys}
          onCancel={this.handleCancel}
        >
          <UpdateForm categoryName={category.name}
                      setForm={(form) => {
                        this.form = form
                      }}
          />
        </Modal>
      </div>
    )
  }
}