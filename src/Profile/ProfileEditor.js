import React, { useState, useEffect } from 'react';
import { SwipeAction, ListView, WingBlank, Button, InputItem, ImagePicker, Toast, Picker, List, DatePicker, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';

import { createHashHistory } from 'history';
import { Constants } from '../Utils/Constants';

import axios from 'axios';

const Item = List.Item;

const hashHistory = createHashHistory();

const SaveProfile = (values, callback) => {    
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));

    let body = {
        openId: userInfo.openid,
        nickName: values.nickName,
        city: values.city,
        expertise: (values.expertise && values.expertise.length>0)? values.expertise[0] : '',
        note: values.note
      }
      axios.post(`${Constants.APIBaseUrl}/user/profile`, body).then((res)=>{
        callback();
        hashHistory.push('/profile');
      }).catch(function (error) {
        callback();
        Toast.info('更新失败',2);
      });
}

const ProfileEditor = (props) => {
    useEffect(() => {
        if(props.location.state)
        {
            setUserInfo(props.location.state);
        }
    }, [props])

    const { getFieldProps, getFieldError } = props.form;
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(false);

    return (<div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "24px" }}>个人信息编辑</p>
        <div style={{ "textAlign": "left" }}>
            <List style={{ backgroundColor: 'white' }}>
                <InputItem
                    {...getFieldProps('nickName', {
                        initialValue: userInfo.nickName,
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
                >昵称</InputItem>
                <InputItem
                    {...getFieldProps('city', {
                        initialValue: userInfo.city,
                        rules: [
                            { required: true, message: '请填写城市' }
                        ],
                    })}
                    error={!!getFieldError('city')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('city'), 2);
                    }}
                    placeholder="城市"
                    style={{ textAlign: 'right' }}
                >城市</InputItem>
                <Picker            // visible={this.state.sexVisible}
                    data={[
                        { value: '医学护肤', label: '医学护肤' },
                        { value: '医学减重', label: '医学减重' },
                    ]}

                    cols={1}
                    {...getFieldProps('expertise', {
                        initialValue: [userInfo.expertise],
                        rules: [
                            { required: true, message: '请选择特长' }
                        ],
                    })}
                    error={!!getFieldError('expertise')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('expertise'), 2);
                    }}
                // onChange={value => {

                // }}            
                // onOk={() => this.setState({ sexVisible: false })}
                // onDismiss={() => this.setState({ sexVisible: false })}
                >
                    <Item arrow="horizontal">
                        特长
                    </Item>
                </Picker>
                <TextareaItem
                    {...getFieldProps('note', {
                        initialValue: userInfo.note,
                        rules: [
                            { required: true, message: '请填写个人简介' }
                        ],
                    })}
                    count={200}
                    rows={8}
                    placeholder="个人简介"
                    error={!!getFieldError('expertise')}
                    onErrorClick={() => {
                        alert(getFieldError('expertise'));
                    }}
                    clear
                    onBlur={() => { console.log('onBlur'); }}
                    onFocus={(e) => { console.log('onFocus'); console.log(e); }}
                >
                </TextareaItem>
            </List>
        </div>

        <div style={{ "backgroundColor": "white", "paddingTop": "30px", "paddingBottom": "30px", "visibility": "{}" }}>
            <Button style={{ width: '30%', height: "40px", lineHeight: "40px", display: 'inline-block' }} onClick={() => {
                hashHistory.push('/profile');
            }}>取消</Button>
            <Button style={{ width: '30%', height: "40px", lineHeight: "40px", display: 'inline-block', marginLeft: '50px' }} loading={loading} type="primary" onClick={() => {
                props.form.validateFields({ force: true }, (error, values) => {
                    if (!error) {
                        setLoading(true);
                        
                        SaveProfile(values, ()=> {setLoading(false)});

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

const ProfileEditorForm = createForm()(ProfileEditor);
export default ProfileEditorForm;

