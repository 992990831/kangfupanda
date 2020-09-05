import React, { useState, useEffect } from 'react';
import { SwipeAction, ListView, WingBlank, Button, InputItem, ImagePicker, Toast, Picker, List, DatePicker, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';

import { createHashHistory } from 'history';
import { Constants } from '../Utils/Constants';

import axios from 'axios';

const Item = List.Item;

const hashHistory = createHashHistory();

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);

let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

const SaveFeedback = (values, form, callback) => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    debugger;
    let body = {
        openId: userInfo.openid,
        nickName: values.nickName,
        phone: values.phone,
        productName: values.product[0],
        comment: values.comment
    }
    axios.post(`${Constants.APIBaseUrl}/Feedback`, body).then((res) => {
        callback();
        Toast.info('反馈已提交', 2);
        form.setFields({
            phone: '',
            productName: null,
            comment:''
        });
    }).catch(function (error) {
        callback();
        Toast.info('提交失败', 2);
    });
}

const FeedbackEditor = (props) => {
    useEffect(() => {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUserInfo(userInfo);
    }, [props])

    const { getFieldProps, getFieldError } = props.form;
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(false);

    return (<div style={{ textAlign: "center" }}>
        <div style={{ "textAlign": "left" }}>
            <List style={{ backgroundColor: 'white' }}>
                <InputItem
                    {...getFieldProps('nickName', {
                        initialValue: userInfo.nickname,
                        rules: [
                            { required: true, message: '请填写昵称' }
                        ],
                    })}
                    error={!!getFieldError('nickName')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('nickName'), 2);
                    }}
                    placeholder="昵称"
                    style={{ textAlign: 'right' }}
                >昵称<span style={{color:'red'}}>*</span></InputItem>
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
                <Picker            // visible={this.state.sexVisible}
                    data={[
                        { value: 'Netctifirm Advanced 颈霜*升级版', label: 'Netctifirm Advanced 颈霜*升级版' },
                        { value: 'DEJ 眼霜', label: 'DEJ 眼霜' },
                        { value: 'Netctifirm 颈霜*经典版', label: 'Netctifirm 颈霜*经典版' },
                        { value: 'Revox7*淡纹精华', label: 'Revox7*淡纹精华' },
                        { value: 'DEJ 面霜', label: 'DEJ 面霜' },
                        { value: 'A醇0.5', label: 'A醇0.5' },
                        { value: 'VC30%', label: 'VC30%' },
                    ]}

                    cols={1}
                    {...getFieldProps('product', {
                        initialValue: [userInfo.expertise],
                        rules: [
                            { required: true, message: '请选择购买的产品' }
                        ],
                    })}
                    error={!!getFieldError('product')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('product'), 2);
                    }}
                // onChange={value => {

                // }}            
                // onOk={() => this.setState({ sexVisible: false })}
                // onDismiss={() => this.setState({ sexVisible: false })}
                >
                    <Item arrow="horizontal">
                        所购产品<span style={{color:'red'}}>*</span>
                    </Item>
                </Picker>
                <TextareaItem
                    {...getFieldProps('comment', {
                        initialValue: '',
                        rules: [
                            { required: true, message: '请填写反馈' }
                        ],
                    })}
                    count={200}
                    rows={8}
                    placeholder="产品反馈"
                    error={!!getFieldError('comment')}
                    onErrorClick={() => {
                        alert(getFieldError('comment'));
                    }}
                    clear
                    onBlur={() => { console.log('onBlur'); }}
                    onFocus={(e) => { console.log('onFocus'); console.log(e); }}
                >
                </TextareaItem>
            </List>
        </div>

        <div style={{ "backgroundColor": "white", "paddingTop": "30px", "paddingBottom": "30px", "visibility": "{}" }}>
            {/* <Button style={{ width: '30%', height: "40px", lineHeight: "40px", display: 'inline-block' }} onClick={() => {
                hashHistory.push('/Feedback');
            }}>取消</Button> */}
            <Button style={{ width: '30%', height: "40px", lineHeight: "40px", display: 'inline-block' }} loading={loading} type="primary" onClick={() => {
                props.form.validateFields({ force: true }, (error, values) => {
                    if (!error) {
                        setLoading(true);

                        SaveFeedback(values, props.form, () => { setLoading(false) });

                    } else {
                        Toast.fail('请完整填写信息', 2)
                        return;
                    }
                });
            }}>提交</Button>

        </div>

        <div style={{ "marginTop": "20px" }}>

        </div>
    </div>)
}

const FeedbackEditorForm = createForm()(FeedbackEditor);
export default FeedbackEditorForm;

