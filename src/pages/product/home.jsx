import React, {Component} from "react";
import {Card, Select, Input, Button, Table, message} from "antd";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

import LinkButton from "../../components/link-button";
import {reqProducts, reqSearchProducts, reqUpdateStatus} from "../../api/index";
import {PAGE_SIZE} from "../../utils/constants";

const {Option} = Select;

/*
* Product默认子路由组件
* */
export default class ProductHome extends Component {
  state = {
    total: 0,                 //商品总数量
    products: [],             //商品列表
    loading: false,            //是否在加载中
    searchName: '',            //搜索的内容
    searchType: 'productName'  //搜索的类型

  };

  /*初始化table的列的数组*/
  initColums = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price //当前指定了对应的属性，传入的是对应的属性值
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const {status, _id} = product;
          const newStatus = status === 1 ? 2 : 1;
          return (
            <span>
              <Button
                type={'primary'}
                onClick={() => this.updateStatus(_id, newStatus)}
              >{status === 1 ? '下架' : '上架'}</Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              {/*将product对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ];
  };

  /*获取指定页码的列表数据显示*/
  getProducts = async (pageNum) => {
    this.pageNum = pageNum; //保存当前的pageNum，让其他方法也能看到
    let result;
    const {searchName, searchType} = this.state;
    this.setState({loading: true});   //显示loading
    if (searchName) {
      //如果searchName有值， 说明是搜索分页
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    } else {
      // 如果searchName没有值，说明是一般分页
      result = await reqProducts(pageNum, PAGE_SIZE);
    }
    this.setState({loading: false});   //隐藏loading
    const res = result.data;
    // console.log(res);
    if (res.status === 0) {
      // 取出分页数据，更新状态，显示分页列表
      const {total, list} = res.data;
      this.setState({
        total,
        products: list
      })
    }
  };

  // 更新指定商品的状态
  updateStatus = async (productID, status) => {
    const result = await reqUpdateStatus(productID, status);
    const res=result.data;
    if (res.status === 0) {
      message.success('更新商品成功');
      this.getProducts(this.pageNum);
    }
  };


  componentWillMount() {
    this.initColums()
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    const {products, total, loading, searchName, searchType} = this.state;

    const title = (
      <span>
        <Select
          defaultValue={searchType}
          style={{width: 150}}
          onChange={(value) => this.setState({searchType: value})}
        >
          <Option value={'productName'}>按名称搜索</Option>
          <Option value={'productDesc'}>按描述搜索</Option>
        </Select>
        <Input
          placeholder={'关键字'}
          style={{width: 150, margin: '0 15px'}}
          value={searchName}
          onChange={event => this.setState({searchName: event.target.value})}
        />
        <Button type={'primary'} onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    );
    const extra = (
      <Button type={"primary"} onClick={() => this.props.history.push('/product/addupdate')}>
        <PlusOutlined/> 添加商品
      </Button>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          loading={loading}
          rowKey={'_id'}
          dataSource={products}
          columns={this.columns}
          pagination={{
            current:this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />
      </Card>
    )
  }
}
