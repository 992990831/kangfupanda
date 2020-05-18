import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './Profile.css';
import { Button } from 'antd-mobile';

class Profile extends Component {
    openCamera()
    {
      this.refs.btnCamera.click();
    }

    render() {
        return (
            <React.Fragment>
                <div className="profileHeader">
                    <div className="profileHeaderPicContainer">
                        <img src="http://106.75.216.135/resources/doctor1.jpg" alt="" className="profileHeadPic" />
                    </div>
                    <div className="profileHeaderContentContainer">
                        <div className="profileHeaderRow">
                            <div className="profileHeaderContent">粉丝</div>
                            <div className="profileHeaderContent">关注</div>
                            <div className="profileHeaderContent">获赞</div>
                        </div>
                        <div className="profileHeaderRowCount">
                            <div className="profileHeaderContent">666</div>
                            <div className="profileHeaderContent">777</div>
                            <div className="profileHeaderContent">888</div>
                        </div>
                        <div className="profileHeaderRow">
                            <Button style={{ width: '90%', margin: 'auto' }}>编辑个人信息</Button>
                        </div>
                    </div>
                </div>
                <div className="profileName">
                    治疗师Albert
                </div>
                <div>
                    <span style={{color: 'rgb(105, 164, 43)', fontWeight:'bold'}}>我的视频</span> 
                </div>
                <div className='videoContainer'>
                    <button className="publish" onClick={this.openCamera.bind(this)}>
                        <img src={[require("../assets/images/publish2.png")]} alt="" />
                    </button>
                </div>
                <input type="file" accept="image/*" ref='btnCamera' style={{display:'none'}}>
              </input>
            </React.Fragment>
        )
    }
}

export default Profile;