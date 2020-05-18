import React, { Component } from 'react';
import './DoctorList.css'
import Doctor from './Doctor'

class DoctorList extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        const { list, type } = this.props;
        return (
            <React.Fragment>
                <div className="header">
                    <div className="search-nav" onClick={() => {
                        console.log('click search')
                    }}>
                        <img src={[require("../assets/images/search.png")]} alt="" className="search-icon" />
                        <span>大家都在搜"张文宏"</span>
                    </div>
                </div>
                <div className='doctorListContainer'>
                    {/* <div className="doctorListLeft">
                        {
                            doctorListMockData.map((item, index) => {
                                return (
                                    <Doctor item={item} key={index} />
                                )
                            })
                        }
                    </div> */}
                    <div className="doctorListLeft">
                        {
                            doctorListMockData.left.map((item, index) => {
                            return (
                                <Doctor item={item} type={type} key={index} />
                            )
                            })
                        }
                    </div>
                    <div className="doctorListRight">
                        {
                            doctorListMockData.right.map((item, index) => {
                            return (
                                <Doctor item={item} type={type} key={index} />
                            )
                            })
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const doctorListMockData = {
    left:[
        {
            name: 'Albert',
            photo: 'http://106.75.216.135/resources/doctor1.jpg',
            years: 15,
            level: 'L1',
            verified: true,
            scholar: '博士生导师',
            starNum: 999,
            note: '卫健部执业认证康复治疗师，对运动损伤方面的康复有丰富经验。'
        },
        {
            name: 'Brad',
            photo: 'http://106.75.216.135/resources/brad.jpg',
            years: 10,
            level: 'L1',
            verified: true,
            scholar: '博士生导师',
            starNum: 999,
            note: '主要擅长下肢生物力学调整，关节障碍无痛调整，肌肉骨骼急慢性疼痛及运动损伤调理。'
        },
        {
            name: 'Ciel',
            level: 'L1',
            photo: 'http://106.75.216.135/resources/Ciel.jpg',
            years: 25,
            scholar: '博士生导师',
            starNum: 999,
            note: '擅长颈肩腰腿痛的复健和早期中风及术后家庭康复方案'
        },
        {
            name: 'Delicia',
            level: 'L2',
            photo: 'http://106.75.216.135/resources/Delicia.jpg',
            years: 20,
            scholar: '博士生导师',
            starNum: 999,
            note: '专注于白领啊人群的颈椎病和上交叉等体态问题问题'
        },
        {
            name: 'Henry',
            level: 'L2',
            photo: 'http://106.75.216.135/resources/Henry.jpg',
            years: 28,
            scholar: '博士生导师',
            starNum: 999,
            note: 'PTA擅长各类颈肩综合征，下腰痛，骨盆旋移综合征'
        }
    ],
    right: [
        {
            name: 'Delicia',
            level: 'L1',
            verified: true,
            photo: 'http://106.75.216.135/resources/Delicia.jpg',
            years: 20,
            scholar: '博士生导师',
            starNum: 999,
            note: '专注于白领啊人群的颈椎病和上交叉等体态问题问题'
        },
        {
            name: 'Henry',
            level: 'L2',
            photo: 'http://106.75.216.135/resources/Henry.jpg',
            years: 28,
            scholar: '博士生导师',
            starNum: 999,
            note: 'PTA擅长各类颈肩综合征，下腰痛，骨盆旋移综合征'
        },
        {
            name: 'Leo',
            level: 'L2',
            photo: 'http://106.75.216.135/resources/Leo.jpg',
            years: 28,
            scholar: '博士生导师',
            starNum: 999,
            note: '擅长运动损伤包括膝关节交叉韧带重建术后损康复，肩袖损伤后的康复治疗以及各种骨关节术后的康复'
        },
        {
            name: 'SunnyChu',
            level: 'L2',
            photo: 'http://106.75.216.135/resources/SunnyChu.png',
            years: 28,
            scholar: '博士生导师',
            starNum: 999,
            note: '产后康复、脑瘫、产瘫。骨折及老年系统疾病。16年主管物理治疗师'
        },
        {
            name: 'TitoHo',
            level: 'L2',
            photo: 'http://106.75.216.135/resources/TitoHo.jpg',
            years: 28,
            scholar: '博士生导师',
            starNum: 999,
            note: '运用系统的手法+运动方案解决肌肉骨骼慢性痛症和功能问题'
        }
    ]
}

export default DoctorList;