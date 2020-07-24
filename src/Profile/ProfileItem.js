/* 个人主页中的作品 */
import React, {  useState, useEffect, useRef } from 'react';
import { Button } from 'antd-mobile';
import { Constants } from '../Utils/Constants';

import { HashRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import { withRouter } from 'react-router-dom'

import Lazyload from 'react-lazyload';
import './ProfileItem.css'

//const history = createHashHistory();

function ProfileItem(props) {
    
    const gotoPostDetail = (postId) =>{
        // history.push(`/postDetail/${postId}`, {
        //     back: '/found'
        // });
        props.history.push({
            pathname: `/postDetail/${postId}`,
            state: { back: props.location.pathname }
        });
    }

    return(<div>
        <div style={{fontSize:'12px', textAlign:'left', paddingBottom:'2px'}}>
            <div className="profileItemTitle">{props.workItem.name}</div>
        </div>
        {/* <Lazyload> */}
            <img style={{height:'80px'}} src={`${Constants.ResourceUrl}/${props.workItem.poster}`} 
            onClick={()=> {
                gotoPostDetail(props.workItem.postId)}}
            />
        {/* </Lazyload> */}
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

export default withRouter(ProfileItem)