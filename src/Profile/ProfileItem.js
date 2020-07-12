/* 个人主页中的作品 */
import React, {  useState, useEffect, useRef } from 'react';
import { Button } from 'antd-mobile';
import { Constants } from '../Utils/Constants';

import { HashRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';

import Lazyload from 'react-lazyload';

const history = createHashHistory();

const gotoPostDetail = (postId) =>{
    history.push(`/postDetail/${postId}`);
}

function ProfileItem(props) {
    return(<div>
        <div style={{fontSize:'12px', textAlign:'left', paddingBottom:'2px'}}>
            <span>{props.workItem.name}</span>
        </div>
        <Lazyload>
            <img style={{height:'80px'}} src={`${Constants.ResourceUrl}/${props.workItem.poster}`} 
            onClick={()=> {
                gotoPostDetail(props.workItem.postId)}}
            />
        </Lazyload>
        <div className="profileItem">
            <div className="profileItemHeader">
                <div className="profileItemContent">评论</div>
                <div className="profileItemContent">获赞</div>
            </div>
            <div className="profileItemHeader">
                <div className="profileItemContent">{props.workItem.commentCount}</div>
                <div className="profileItemContent">{props.workItem.likeCount}</div>
            </div>
        </div>
    </div>)
}

export default ProfileItem