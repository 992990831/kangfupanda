/* 个人主页中的评论 */
import React, { useState, useEffect, useRef } from 'react';
import { Button, List, Modal, TextareaItem, ActionSheet, Toast } from 'antd-mobile';
import { Constants } from '../Utils/Constants';

import { HashRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';

import axios from 'axios';

const history = createHashHistory();

const gotoPostDetail = (postId) => {
    history.push(`/postDetail/${postId}`);
}
let timer = 0;

function ProfileComment(props) {
    const [comments, setComments] = useState([]);
    const [isCommentVisible, setIsCommentVisible] = useState(false);
    const [commentId, setCommentId] = useState(0);
    const commentRef = useRef();

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

            commentList = commentList.filter((comment) => {
                return (comment.comment_audit_status == 1 || (comment.comment_audit_status == 0 && props.showPending));
            });
            setComments(commentList);
        })
    }

    const submit = () => {
        let commentText = commentRef.current.state.value;

        let userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo) {
            this.props.history.push({
                pathname: `../profile`,
            })
        }

        let body = {
            comment_user_id: userInfo.openid,
            comment_user_name: userInfo.nickname,
            comment_user_pic: userInfo.headimgurl,
            comment_content: commentText,
            parentId: commentId
        }

        axios.post(`${Constants.APIBaseUrl}/comments/author/add`, body).then(() => {
            Toast.info('回复已提交', 2);
            setIsCommentVisible(false);
            getComments();
        }).catch(function (error) {
            alert('回复失败');
        });

    }

    const onItemTouchStart = (e) => {
        let userStr = localStorage.getItem("userInfo");
        if(!userStr)
        {
            return;
        }

        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if(props.workItem.openId != userInfo.openid) //登录人和作者不是同一人
        {
            return;
        }

        if (e.target && e.target.innerText) {
            let title = e.target.innerText;
            let commentId = e.target.getAttribute('commentid');
            timer = setTimeout(function () {
                console.log('LongPress');
                e.preventDefault();
                LongPress(commentId, title);
            }, 800);
        }
    }

    const onTouchMove = (e) => {
        console.log('onItemTouchMove');
        clearTimeout(timer);
        timer = 0;
    }

    const onItemTouchEnd = (e) => {
        console.log('onItemTouchEnd');
        clearTimeout(timer);
    }

    const LongPress = (commentId, title) => {
        let wrapProps = {
            onTouchStart: e => e.preventDefault(),
        };

        //setIsCommentVisible(true);
        const options = ['回复', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: options,
            cancelButtonIndex: options.length - 1,
            message: title,
            maskClosable: true,
            wrapProps
        },
            (buttonIndex, rowIndex) => {
                //this.setState({ clicked2: buttonIndex > -1 ? data[rowIndex][buttonIndex].title : 'cancel' });
                if (buttonIndex == 0) {
                    setCommentId(commentId);
                    setIsCommentVisible(true);
                }
            });
    }

    return (<div style={{ textAlign: 'center' }}>
        <span style={{ color: '#108ee9', fontSize: '18px' }} onClick={() => {
            gotoPostDetail(props.workItem.id);
        }}>{`${props.workItem.name}`}</span>
        {
            comments && comments.length > 0 ?
                <div className="profileComment">
                    {
                        // comments.map((comment) => {
                        // return (
                        <React.Fragment>
                            {/* <List> */}
                            {

                                comments.map((comment, index) => {
                                    return (
                                        <div key={index} style={{ padding: '0px 2px 20px 0px', display: 'flex', width: '100%' }}>
                                            <div className="comment-avator">
                                                <img src={comment.comment_user_pic.substring(0, 4) == 'http' ? comment.comment_user_pic : `${Constants.ResourceUrl}/${comment.comment_user_pic}`} alt="" />
                                            </div>
                                            <div
                                                style={{
                                                    lineHeight: '18px',
                                                    color: '#888',
                                                    fontSize: 12,
                                                    // borderTop: '2px solid #F6F6F6',
                                                    marginLeft: '10px'
                                                }}
                                            >
                                                <div style={{ lineHeight: '20px', textAlign: 'left' }}>{comment.comment_user_name}</div>
                                                <div
                                                    style={{
                                                        lineHeight: '18px',
                                                        color: 'black',
                                                        fontSize: 13,
                                                        //   borderTop: '2px solid #F6F6F6',
                                                        margin: 'auto',
                                                        textAlign: 'left'
                                                    }}
                                                    commentid={comment.comment_id}
                                                    onTouchStart={onItemTouchStart}
                                                    onTouchEnd={onItemTouchEnd}
                                                    onTouchMove={onTouchMove}
                                                >{comment.comment_content} {comment.comment_audit_status == 0 ? <span style={{ color: 'red' }}>(待精选)</span> : <></>}</div>
                                                {
                                                    comment.Replies && comment.Replies.length > 0 ?
                                                        comment.Replies.map((reply, index) => {
                                                            return (
                                                                <div style={{marginTop:'10px', textAlign:'left', paddingLeft:'6px', borderLeft:'solid 1px rgb(128, 128, 128)'}}>
                                                                    作者
                                                                    <div>
                                                                        {reply.comment_content}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                        :
                                                        <></>
                                                }
                                            </div>

                                        </div>
                                    )
                                })

                            }
                            {/* </List> */}


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
        {/* {
            props.showPending ?
                <div style={{ textAlign: 'right' }}>
                    <Button type='primary' inline size='small' onClick={() => {
                        setIsCommentVisible(true);
                    }}>回复</Button>
                </div>
                : <></>
        } */}
        <Modal visible={isCommentVisible}
            style={{ width: '95vw' }}
            transparent
            maskClosable={false}
            onClose={() => { setIsCommentVisible(false) }}
            title='回复评论'
            footer={[{
                text: '取消',
                onPress: () => { setIsCommentVisible(false); }
            },
            {
                text: '提交',
                onPress: () => { submit(); }
            }]}
        // wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        // afterClose={() => { alert('afterClose'); }}
        >
            <div style={{ background: 'white', display: 'flex', paddingTop: '10px', paddingBottom: '10px' }}>
                <div style={{ margin: 'auto', display: 'flex', width: '100%' }}>
                    <TextareaItem
                        placeholder="请回复"
                        style={{ width: '80vw', fontSize:'13px' }}
                        ref={commentRef}
                        rows={2}
                    />
                </div>
            </div>
        </Modal>

    </div>)
}

export default ProfileComment