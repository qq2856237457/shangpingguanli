import React from "react";
import {Upload, Modal, message} from 'antd';
import PropTypes from 'prop-types'
import {PlusOutlined} from '@ant-design/icons';

import {reqDeleteImg} from "../../api";
import {BASE_IMG_URL} from "../../utils/constants";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

//图片上传组件

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,   //标识是否显示modal
    previewImage: '',    //大图的地址
    previewTitle: '',
    fileList: [
      // {
      //   uid: '-1',           //每个file自己唯一的iD
      //   name: 'image.png',   // 图片文件名
      //   status: 'done',      //图片状态  done-已上传  uploading：正在上传中
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },

    ],
  };
  static propTypes = {
    imgs: PropTypes.array
  };

  constructor(props) {
    super(props);

    let fileList = [];
    //如果传入了imgs属性
    const {imgs} = this.props;
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,           //每个file自己唯一的iD
        name: img,   // 图片文件名
        status: 'done',      //图片状态  done-已上传  uploading：正在上传中
        url: BASE_IMG_URL + img
      }))
    }
    this.state = {
      previewVisible: false,   //标识是否显示modal
      previewImage: '',    //大图的地址
      previewTitle: '',
      fileList
    }
  }


  getIMgs = () => {
    /*
  * 获取所有已上传图片文件名的数组
  * */
    return this.state.fileList.map(file => (file.name));
  };


  // 隐藏modal
  handleCancel = () => this.setState({previewVisible: false});

  handlePreview = async file => {
    // 显示指定file的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  // file:当前操作的图片（上传/删除）
  // fileList:所有已上传图片文件对象的数组
  handleChange = async ({file, fileList}) => {

    // 一旦上传成功,将当前上传的file信息修正（name，url）
    if (file.status === 'done') {
      const result = file.response;
      if (result.status === 0) {
        message.success('上传图片成功');
        const {name, url} = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error('上传图片失败');
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteImg(file.name);
      const res = result.data;
      if (res.status === 0) {
        message.success('删除图片成功！');
      } else {
        message.error('删除图片失败！');
      }

    }

    // 在操作（上传/删除）过程中更新fileList状态
    this.setState({fileList})
  };

  render() {
    const {previewVisible, previewImage, fileList, previewTitle} = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined/>
        <div style={{marginTop: 8}}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload"   //上传图片的接口
          accept='image/*'      //只接受图片格式
          listType="picture-card"   //预览图片的样式
          name='image'     //请求参数名
          fileList={fileList}   //所有已上传文件列表
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </>
    );
  }
}

