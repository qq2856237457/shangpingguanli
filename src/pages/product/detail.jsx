import React, {Component} from "react";
import {Card, List,} from "antd";
import ArrowLeftOutlined from "@ant-design/icons/lib/icons/ArrowLeftOutlined";

import {BASE_IMG_URL} from '../../utils/constants'
import LinkButton from "../../components/link-button";
import {reqCategory} from "../../api";

/*
* Product默认子路由组件
* */
export default class ProductDetail extends Component {
  state = {
    cName1: '',     //一级分类名称
    cName2: ''      //二级分类名称
  };

  async componentDidMount() {
    const {pCategoryId, categoryId} = this.props.location.state.product;
    if (pCategoryId === 0) { //一级分类下的商品
      const result = await reqCategory(categoryId).data;
      const cName1 = result.data.name;
      this.setState({cName1})
    } else {   //二级分类下的商品

      // // 一次性发送多个请求，只有都成功了，才正常处理，问题不大，效率偏低
      // const result1 = await reqCategory(pCategoryId).data;  //获取一级分类列表
      // const result2 = await reqCategory(categoryId).data;  // 获取二级分类列表
      // const cName1 = result1.data.name;
      // const cName2 = result2.data.name;

      // 一次性发送多个请求，只有都成功了，才正常处理
      const results=await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)]);
      const cName1=results[0].data.data.name;
      const cName2=results[1].data.data.name;

      this.setState({
        cName1,
        cName2
      })
    }
  }

  render() {

    // 读取携带过来的state数据
    console.log('asdasdasd',this.props.location.state);
    const {name, desc, price, detail, imgs} = this.props.location.state.product;

    const {cName1, cName2} = this.state;

    const title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined
            style={{marginRight: 10, fontSize: 20}}
            onClick={() => this.props.history.goBack()}
          />
        </LinkButton>
        <span>商品详情</span>
      </span>
    );
    return (
      <Card title={title} className={'product-detail'}>
        <List>
          <List.Item>
            <span className={'left'}>商品名称:</span>
            <span>{name}</span>
          </List.Item>
          <List.Item>
            <span className={'left'}>商品描述:</span>
            <span>{desc}</span>
          </List.Item>
          <List.Item>
            <span className={'left'}>商品价格:</span>
            <span>{price}</span>
          </List.Item>
          <List.Item>
            <span className={'left'}>所属分类:</span>
            <span>{cName1} {cName2 ? '-->' + cName2 : ''}</span>
          </List.Item>
          <List.Item>
            <span className={'left'}>商品图片:</span>
            <span>
              {
                imgs.map((img) => (
                  <img
                    key={img}
                    src={BASE_IMG_URL + img}
                    className='product-img'
                    alt="img"/>
                ))
              }
            </span>
          </List.Item>
          <List.Item>
            <span className={'left'}>商品详情:</span>
            <span dangerouslySetInnerHTML={{__html: {detail}}}/>
          </List.Item>
        </List>
      </Card>
    )
  }
}
