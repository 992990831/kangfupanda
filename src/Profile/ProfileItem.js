/* 个人主页中的作品 */
import React, {  useState, useEffect, useRef } from 'react';
import { Button } from 'antd-mobile';
import { Constants } from '../Utils/Constants';

import { HashRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';

const history = createHashHistory();

const gotoPostDetail = (postId) =>{
    history.push(`/postDetail/${postId}`);
}

function ProfileItem(props) {
    return(<div>
        <img style={{height:'80px'}} src={`${Constants.ResourceUrl}${props.workItem.posterUri}`} 
        onClick={()=> {gotoPostDetail(props.workItem.id)}}
        />
        
        <div className="profileItem">
            <div className="profileItemHeader">
                <div className="profileItemContent">评论</div>
                <div className="profileItemContent">获赞</div>
            </div>
            <div className="profileItemHeader">
                <div className="profileItemContent">10</div>
                <div className="profileItemContent">88</div>
            </div>
        </div>
    </div>)
}

export default ProfileItem