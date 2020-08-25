import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Modal} from 'antd';

import menuList from "../../config/menuConfig";
import {formateDate} from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {reqWeather} from '../../api/index';
import LinkButton from "../link-button";
import './index.less';


const {confirm} = Modal;

class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()),
    dayPictureUrl: '',
    weather: ''
  };

  // 启动定时器，更新当前时间
  getData = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({currentTime});
    }, 1000)
  };


  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('北京');
    this.setState({dayPictureUrl, weather});
  };

  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(cItem => (cItem.key === path));
        if (cItem) {
          title = cItem.title
        }
      }
    });
    return title
  };
  logout = () => {
    confirm({
      title: '你要退出吗?',
      onOk: () => {
        // 清除数据，
        storageUtils.removeUser();
        memoryUtils.user = {};
        // 返回login
        this.props.history.replace('./login');
      }
    });
  };

  componentDidMount() {
    this.getData();
    this.getWeather()
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const {currentTime, dayPictureUrl, weather} = this.state;
    const userName = memoryUtils.user.username;
    const title = this.getTitle();
    return (
      <div className={'header'}>
        <div className="header-top">
          <span>欢迎，{userName}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header)