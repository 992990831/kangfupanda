import React, { Component } from 'react';
import './App.css';

import { HashRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import Home from './home/Home';
import CardDetail from './Card/CardDetail';
import Profile from './Profile/Profile';
import DoctorList from './Doctors/DoctorList';
import { TabBar } from 'antd-mobile';

import { createHashHistory } from 'history';

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
    };
  }

  //let selected = 'home';


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

          </div>
          <div className="redBook-main">
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/cardDetail/:id" component={CardDetail} />
              <Route path="/found" component={DoctorList} />
              <Route path="/profile" component={Profile} />
              <Route path="/" render={() => {
                return false ?
                  <div>home</div> : <Redirect to={{
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
