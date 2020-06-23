import React, { Component } from 'react';
import { WingBlank, Button, InputItem, ImagePicker, Toast, Picker, List, DatePicker } from 'antd-mobile';
import { createForm } from 'rc-form';
import axios from 'axios';
import { createHashHistory } from 'history';
import { Constants } from '../Utils/Constants';

const Item = List.Item;

const hashHistory = createHashHistory();

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);

let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

class ComplainPage extends React.Component {
    state = {
        isLoading: false
    }

    submit() {
        this.props.form.validateFields({ force: true }, (error, values) => {
            if (!error) {
                this.setState({
                    isLoading: true
                })

                debugger;
              let body = {
                itemId: this.props.location.state.postId,
                itemType: this.props.location.state.itemType,
                phone: values.phone,
                title: this.props.location.state.name,
                complain: values.complain
              };
              let that = this;
                axios.post(`${Constants.APIBaseUrl}/complain`, body).then(res => {
                    hashHistory.goBack();
                }).catch(function (error) {
                    that.setState({
                        isLoading: false
                    })
                    console.log(error);
                    Toast.fail('提交失败', 2)
                });
            } else {
                Toast.fail('请完整填写信息', 2)
                return;
            }
        });
    }

    back() {
        hashHistory.goBack();
    }

    render() {
        let post = this.props.location.state;

        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "24px" }}>投诉信息</p>
                <div style={{ "textAlign": "left" }}>
                    <List style={{ backgroundColor: 'white' }}>
                        <InputItem
                            {...getFieldProps('name', {
                                initialValue: post? post.name : null,
                                rules: [
                                    { required: true, message: '作品名称不能为空' },
                                ],
                            })}
                            error={!!getFieldError('name')}
                            onErrorClick={() => {
                                alert(getFieldError('name'));
                            }}
                            placeholder="作品名称"
                            style={{ textAlign: 'right' }}
                        >作品名称</InputItem>
                        <InputItem
                            type="phone"
                            {...getFieldProps('phone', {
                                initialValue: null,
                                rules: [
                                    { required: false, message: '请输入手机号' }
                                ],
                            })}
                            clear
                            error={!!getFieldError('phone')}
                            onErrorClick={() => {
                                alert(getFieldError('phone'));
                            }}
                            placeholder="手机号"
                            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                            style={{ textAlign: 'right' }}
                        >手机号</InputItem>
                        <InputItem
                            {...getFieldProps('complain', {
                                rules: [
                                    { required: true, message: '投诉内容不能为空' }
                                ],
                            })}
                            error={!!getFieldError('complain')}
                            onErrorClick={() => {
                                alert(getFieldError('complain'));
                            }}
                            placeholder="投诉内容"
                            style={{ textAlign: 'right' }}
                        >投诉内容</InputItem>
                    </List>
                </div>

                <div style={{ "backgroundColor": "white", "paddingTop": "30px", "paddingBottom": "30px", "visibility": "{}" }}>
                    <Button style={{ width: '30%', height: "40px", lineHeight: "40px", display: 'inline-block' }} onClick={this.back.bind(this)}>取消</Button>
                    <Button style={{ width: '30%', height: "40px", lineHeight: "40px", display: 'inline-block', marginLeft: '50px' }} loading={this.state.isLoading} type="primary" onClick={this.submit.bind(this)}>提交</Button>

                </div>

                <div style={{ "marginTop": "20px" }}>

                </div>
            </div>)
    }
}

const ComplainForm = createForm()(ComplainPage);
export default ComplainForm;