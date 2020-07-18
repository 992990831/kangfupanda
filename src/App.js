import React, { Component } from 'react';
import './App.css';

import { HashRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import Home from './home/Home';
import UnAuthorized from './home/UnAuthorized';
import PostDetail from './Post/PostDetail';
import Profile from './Profile/Profile';
import DoctorList from './Doctors/DoctorList';
import DoctorDetail from './Doctors/DoctorDetail';
import { TabBar, Toast } from 'antd-mobile';

import { createHashHistory } from 'history';

import ProfileEditorForm  from './Profile/ProfileEditor';

import DoctorProfile  from './Doctors/DoctorProfile';

import ComplainForm from './Complain/ComplainForm';

import axios from 'axios';
import { Constants } from './Utils/Constants';

function getQueryString(url, name) {
  url = url.split('?')[1];

  if(!url)
  return null;

  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = url.match(reg);
  if (r != null) {
      return decodeURI(r[2]);
  }
  return null;
}

class App extends Component {
  // let btnCamera = null;

  // function openCamera()
  // {
  //   btnCamera.click();
  // }
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
      showToolBar: true
    };
  }

  //let selected = 'home';

  init() {
    //对应模拟登录的情况
    let openId = getQueryString(window.location.href, 'openId');
    if(openId)
    {
      axios.get(`${Constants.APIBaseUrl}/user/${openId}`, {
        headers: { 'Content-Type': 'application/json' }
      }).then(res => {
          let userInfo = res.data;
          let template = `{"nickname":"${userInfo.nickName}", "openid":"${userInfo.openId}", "city":"${userInfo.city}","headimgurl":"${userInfo.headpic}"}`;

          localStorage.setItem("userInfo",template);
          //window.location.reload();
          const history = createHashHistory();
          history.push(window.location.host);

        }).catch(function (error) {
            console.log(error);
        });
      
    }

    axios.interceptors.request.use(config => {
      let userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo.openid) {
          config.headers.openid=userInfo.openid;
          config.headers.nickname= escape(userInfo.nickname);
        }
      }
      
      return config
    }, err => {
      Toast.info(err, 3);
      console.log(err)
    })

  }

  checkLogin() {
    let userInfoStr = localStorage.getItem("userInfo");

    if (!userInfoStr) {        
        const history = createHashHistory();
        //localStorage是异步存储，所以必须有个延迟
        window.setTimeout(() => {
          history.push({
                pathname: `../profile`,
            })
        }, 300);
        
        return false;
    }

    return true;
};

saveLastVisitUrl()
{
  //保存当前链接，在微信登录后可以回到这里
  let search= window.location.hash;
  localStorage.setItem("redirectSearch", search.substring(2));
}

  componentDidMount(){
    //this.setSelectedIcon();
    this.init();
  }

  componentDidUpdate(){
    //this.setSelectedIcon();
    //this.checkLogin();
  }

  componentWillReceiveProps(){
    //this.setSelectedIcon();
  }

  componentWillMount(){
    //check login status
    this.checkLogin();
  }

  render() {
    const history = createHashHistory();
    return (
      <Router>
        <div className="App">
          <div className="tabbar">
            {/* <div className="nav-link">
            <NavLink to="/home" activeClassName="selected">研习社</NavLink>
          </div>
          <div className="nav-link">
            <NavLink to="/doctors" activeClassName="selected">发现</NavLink>
          </div>
       
          <div className="nav-link">
            <NavLink to="/profile" activeClassName="selected">我的</NavLink>
          </div> */}
          {
            this.state.showToolBar?
            <div style={{ width: '100%' }}>
              <TabBar
                unselectedTintColor="#949494"
                tintColor="#80e316"
                barTintColor="white"
              >
                <TabBar.Item
                  title="研习社"
                  key="研习社"
                  icon={<div style={{
                    width: '22px',
                    height: '22px',
                    background: 'url(http://app.kangfupanda.com/resources/home.png) center center /  21px 21px no-repeat'
                  }}
                  />
                  }
                  selectedIcon={<div style={{
                    width: '22px',
                    height: '22px',
                    background: 'url(http://app.kangfupanda.com/resources/home2.png) center center /  21px 21px no-repeat'
                  }}
                  />
                  }
                  selected={this.state.selectedTab == 'home'}
                  onPress={() => {
                    this.setState({
                      selectedTab: 'home'
                    })
                    history.push('/home');
                  }}
                  data-seed="logId"
                >
                  {/* {renderContent('Life')} */}
                </TabBar.Item>
                <TabBar.Item
                  icon={
                    <div style={{
                      width: '22px',
                      height: '22px',
                      background: 'url(http://app.kangfupanda.com/resources/found.png) center center /  21px 21px no-repeat'
                    }}
                    />
                  }
                  selectedIcon={
                    <div style={{
                      width: '22px',
                      height: '22px',
                      background: 'url(http://app.kangfupanda.com/resources/found2.png) center center /  21px 21px no-repeat'
                    }}
                    />
                  }
                  title="发现"
                  key="发现"
                  selected={this.state.selectedTab == 'found'}
                  onPress={() => {
                    this.setState({
                      selectedTab: 'found'
                    })
                    history.push('/found');
                  }}
                  data-seed="logId1"
                >
                </TabBar.Item>
                <TabBar.Item
                  icon={
                    <div style={{
                      width: '22px',
                      height: '22px',
                      background: 'url(http://app.kangfupanda.com/resources/me.png) center center /  21px 21px no-repeat'
                    }}
                    />
                  }
                  selectedIcon={
                    <div style={{
                      width: '22px',
                      height: '22px',
                      background: 'url(http://app.kangfupanda.com/resources/me2.png) center center /  21px 21px no-repeat'
                    }}
                    />
                  }
                  title="我的"
                  key="我的"
                  selected={this.state.selectedTab == 'profile'}
                  onPress={() => {
                    this.setState({
                      selectedTab: 'profile'
                    })
                    history.push('/profile');
                  }}
                >
                </TabBar.Item>
              </TabBar>
            </div>
            :
            <></>

          }
            
          </div>
          <div className="redBook-main">
            <Switch>
              {/* <Route path="/home" component={Home} />
              <Route path="/complain" component={ComplainForm} />
              <Route path="/PostDetail/:id" component={PostDetail} />
              <Route path="/profile/doctor/:openid" component={DoctorProfile} />
              <Route path="/found" exact component={DoctorList} />
              <Route path="/found/detail"  component={DoctorDetail} />
              <Route path="/profile" exact  component={Profile} />
              <Route path="/profile/edit" component={ProfileEditorForm} />
              <Route path="/" render={() => {
                return false ?
                  <div>home</div> : <Redirect to={{
                    pathname: '/home',
                  }} />
              }}></Route> */}

              <Route path="/home" 
              exact render={()=>{
                this.saveLastVisitUrl();

                if(!this.state.showToolBar)
                {
                  this.setState({
                    showToolBar: true
                  })
                }

                //为了从外部链接过来的时候，下面的工具条能正常显示
                if(this.state.selectedTab != 'home')
                {
                  this.setState({selectedTab:'home'});
                }
                
                return <Home></Home>
              }}
              />

              <Route path="/unauthorized" 
              exact render={()=>{
                if(this.state.showToolBar)
                {
                  //未授权页面，把工具条隐藏起来
                  this.setState({
                    showToolBar: false
                  })
                }
                
                return <UnAuthorized></UnAuthorized>
              }}
              />


              <Route path="/complain" component={ComplainForm} />

              <Route path="/PostDetail/:postId"
              exact 
              render={()=>{
                this.saveLastVisitUrl();
                if(!this.state.showToolBar)
                {
                  this.setState({
                    showToolBar: true
                  })
                }
                
                if(this.state.selectedTab != 'home')
                {
                  this.setState({selectedTab:'home'});
                }
                
                return <PostDetail></PostDetail>
              }}
              />

              <Route path="/profile/doctor/:openid"
              render={()=>{
                //this.checkLogin();
                if(!this.state.showToolBar)
                {
                  this.setState({
                    showToolBar: true
                  })
                }

                if(this.state.selectedTab != 'profile')
                {
                  this.setState({selectedTab:'profile'});
                }
                
                return <DoctorProfile></DoctorProfile>
              }}
              />

              <Route path="/found" exact
                render={()=>{
                  this.saveLastVisitUrl();
                  if(!this.state.showToolBar)
                  {
                    this.setState({
                      showToolBar: true
                    })
                  }

                  //为了从外部链接过来的时候，下面的工具条能正常显示
                  if(this.state.selectedTab != 'found')
                  {
                    this.setState({selectedTab:'found'});
                  }
                  
                  return <DoctorList></DoctorList>
                }}
              />

              <Route path="/found/detail"
                render={()=>{
                  this.saveLastVisitUrl();
                  if(!this.state.showToolBar)
                  {
                    this.setState({
                      showToolBar: true
                    })
                  }  

                  if(this.state.selectedTab != 'found')
                  {
                    this.setState({selectedTab:'found'});
                  }
                  
                  return <DoctorDetail></DoctorDetail>
                }}
              />

              <Route path="/profile" exact 
              render={()=>{
                if(this.state.selectedTab != 'profile')
                  {
                    this.setState({selectedTab:'profile'});
                  }
                
                return <Profile></Profile>
              }} />

              <Route path="/profile/edit" component={ProfileEditorForm} />

              <Route path="/" render={() => {
                this.saveLastVisitUrl();
                 if(!this.state.showToolBar)
                 {
                   this.setState({
                     showToolBar: true
                   })
                 } 

                return <Redirect to={{
                    pathname: '/home',
                  }} />
              }}></Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
