import React, { Component, Fragment } from 'react';
import './PostList.css'
import Post from './Post'
import CarouselExt from '../Tool/CarouselExt';

import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile';

const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];
const NUM_ROWS = 10;
let pageIndex = 0;

function genData(pIndex = 0) {
  const dataArr = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    dataArr.push(`row - ${(pIndex * NUM_ROWS) + i}`);
  }
  return dataArr;
}


class PostList extends Component {
  constructor(props){
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      list: [],
      type: '',

      dataSource,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      useBodyScroll: false,
    }
  }

  componentDidMount() {
    const hei = this.state.height;// - this.lv.offsetTop;

    // setTimeout(() => {
    //   debugger;
    //   this.rData = genData();
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(genData()),
    //     height: hei,
    //     refreshing: false,
    //     isLoading: false,
    //   });
    // }, 1500);
  }

  componentDidUpdate() {
    //这里会影响Post Detail的内容滚动
    // if (this.state.useBodyScroll) {
    //   document.body.style.overflow = 'auto';
    // } else {
    //   document.body.style.overflow = 'hidden';
    // }
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.list || nextProps.list.length==0)
    {
      return;
    }

    this.setState({
        list: nextProps.list
      }, 
      ()=>{
        const hei = this.state.height;

        if(Array.isArray(this.rData ))
        {
          this.rData = [...this.rData, ...genData(++pageIndex)];
        }
        else{
          this.rData = genData();
        }
        
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.rData), //this.state.dataSource.cloneWithRows(genData()),
          height: hei,
          refreshing: false,
          isLoading: false,
        });
      }
    );

    
  }

  /*关注之后更新 */
  onFollowed(openId){
    let userInfo = JSON.parse(localStorage.getItem("userInfo")); 
    let newList = this.state.list;
    newList.forEach(post => {
      if(post.openId == openId)
      {
          post.followed=true;
      }
    });
    
    this.setState({
      list: newList
    })
  }

  // onRefresh = () => {
  //   this.setState({ refreshing: true, isLoading: true });
  //   // simulate initial Ajax
  //   setTimeout(() => {
  //     this.rData = genData();
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(this.rData),
  //       refreshing: false,
  //       isLoading: false,
  //     });
  //   }, 600);
  // };

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });

    if(this.props.loadMore)
    {
      this.props.loadMore(5);
    }

    // setTimeout(() => {
    //   this.rData = [...this.rData, ...genData(++pageIndex)];
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(this.rData),
    //     isLoading: false,
    //   });
    // }, 1000);
  };


  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    
    //let index = data.length - 1;
    let index = this.state.list.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = this.state.list.length - 1;
      }
      const obj = this.state.list[index--];
      return (
        <div key={rowID}
          style={{
            padding: '0 15px',
            backgroundColor: 'white',
          }}
        >
          <Post item={obj} onFollowed={this.onFollowed.bind(this)}/>
          {/* {obj.name}
          <div style={{ height: '50px', lineHeight: '50px', color: '#888', fontSize: '18px', borderBottom: '1px solid #ddd' }}>
            {obj.title}
          </div>
          <div style={{ display: '-webkit-box', display: 'flex', padding: '15px' }}>
            <img style={{ height: '63px', width: '63px', marginRight: '15px' }} src={obj.poster} alt="" />
            <div style={{ display: 'inline-block' }}>
              <div style={{ marginBottom: '8px', color: '#000', fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '250px' }}>{obj.des}-{rowData}</div>
              <div style={{ fontSize: '16px' }}><span style={{ fontSize: '30px', color: '#FF6E27' }}>{rowID}</span> 元/任务</div>
            </div>
          </div> */}
        </div>
      );
    };
    return (
    //   <div className="list-container">
    //     <div className="single">
    //       {
    //         this.state.list.map((item, index) => {
    //           return (
    //             <Post item={item} key={index} onFollowed={this.onFollowed.bind(this)}/>
    //           )
    //         })             
    //       }
    //     </div>
    // </div>
    <div style={{paddingTop:'60px'}}>
      {/* <Button
        style={{ margin: '30px 15px' }}
        inline
        onClick={() => this.setState({ useBodyScroll: !this.state.useBodyScroll })}
      >
        {this.state.useBodyScroll ? 'useBodyScroll' : 'partial scroll'}
      </Button> */}
      <ListView
        key={this.state.useBodyScroll ? '0' : '1'}
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        // renderHeader={() => <span>Pull to refresh</span>}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading ? 'Loading...' : 'Loaded'}
        </div>)}
        renderRow={row}
        renderSeparator={separator}
        useBodyScroll={this.state.useBodyScroll}
        style={this.state.useBodyScroll ? {} : {
          height: this.state.height,
          border: '1px solid #ddd',
          margin: '5px 0',
        }}
        pullToRefresh={false}
        // pullToRefresh={<PullToRefresh
        //   refreshing={this.state.refreshing}
        //   onRefresh={this.onRefresh}
        // />}
        onEndReached={this.onEndReached}
        pageSize={5}
      />
    </div>);
  }
}

export default PostList;