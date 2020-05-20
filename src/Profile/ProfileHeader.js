import React from 'react';
import { Button } from 'antd-mobile';
import './Profile.css';

const ProfileHeader = props => (
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

)

export default ProfileHeader;