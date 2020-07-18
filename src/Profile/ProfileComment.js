/* 个人主页中的评论 */
import React, { useState, useEffect, useRef } from 'react';
import { Button, List } from 'antd-mobile';
import { Constants } from '../Utils/Constants';

import { HashRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';

import axios from 'axios';

const history = createHashHistory();

const gotoPostDetail = (postId) => {
    history.push(`/postDetail/${postId}`);
}

function ProfileComment(props) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        getComments();
    }, [])

    const getComments = () => {
        axios(`${Constants.APIBaseUrl}/comments/list/profile/?postId=${props.workItem.postId}&postType=${props.workItem.itemType}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            let commentList = res.data.map(comment => {
                return { ...comment, key: comment.comment_id };
            })

            commentList = commentList.filter((comment)=>{
                return  (comment.comment_audit_status==1 ||  (comment.comment_audit_status==0 && props.showPending));
            });
            setComments(commentList);
        })
    }

    return (<div>
        <span style={{ color: '#108ee9', fontSize: '18px' }} onClick={() => {
            gotoPostDetail(props.workItem.id);
        }}>{`标题：${props.workItem.name}`}</span>
        {
            comments && comments.length > 0 ?
                <div className="profileComment">
                    {
                        // comments.map((comment) => {
                            // return (
                                <React.Fragment>
                                    <List>
                                        {

                                            comments.map((comment, index) => {
                                                return (
                                                        <div key={index} style={{ padding: '0 15px', display: 'flex', width: '100%' }}>
                                                            <div className="comment-avator">
                                                                <img src={comment.comment_user_pic.substring(0,4)=='http'?  comment.comment_user_pic : `${Constants.ResourceUrl}/${comment.comment_user_pic}`} alt="" />
                                                            </div>
                                                            <div
                                                                style={{
                                                                    lineHeight: '50px',
                                                                    color: '#888',
                                                                    fontSize: 12,
                                                                    borderTop: '2px solid #F6F6F6',
                                                                    marginLeft: '10px'
                                                                }}
                                                            >{comment.comment_user_name}</div>
                                                            <div
                                                                style={{
                                                                    lineHeight: '50px',
                                                                    color: '#888',
                                                                    fontSize: 12,
                                                                    borderTop: '2px solid #F6F6F6',
                                                                    margin: 'auto'
                                                                }}
                                                            >{comment.comment_content} {comment.comment_audit_status==0? <span style={{color:'red'}}>(待精选)</span>: <></> }</div>

                                                        </div>
                                                )
                                            })

                                        }
                                    </List>
                                </React.Fragment>
                            // )
                        // })
                    }
                </div>
                :
                <div className='profileComment profileCommentContent'>
                    无评论
                </div>
        }

    </div>)
}

export default ProfileComment