import { Constants } from '../Utils/Constants';

//https://www.cnblogs.com/zhangbob/p/10039440.html
//https://www.w3school.com.cn/html5/canvas_drawimage.asp
export const PlayVideo = (canvas, stopBtn, playBtn, exitBtn, closeCallBack) => {
    //这里一定要单独定义，不能用匿名方法，否则removeEventListener的时候会不知道移除哪个方法
    //https://blog.csdn.net/hangGe0111/article/details/90447905
    
    if (canvas) {
        //获取canvas上下文
        let ctx = canvas.getContext('2d');
 
        //创建video标签，并且设置相关属性
        let video = document.createElement('video');


        function Play(){
            if (!video.paused){
                return;
            }
    
            video.play();
        }
    
        function Stop() {
            video.pause();
        }
    

        //video.style= {width:'600', height:'300'};
        video.style= {width:window.innerWidth, height:'300'};
 
        video.preload = true;
        video.autoplay = true;
        video.src=`${Constants.ResourceIntroVideoUrl}intro.mp4`;
        //document.body.appendChild(video);
 
        //监听video的play事件，一旦开始，就把video逐帧绘制到canvas上
        // video.addEventListener('play',() => {
        //     let play = () => {
        //         //ctx.drawImage(video,0,0, 600, 300);
        //         ctx.drawImage(video,0,0, window.innerWidth, 300);
        //         requestAnimationFrame(play);
        //     };
 
        //     play();
        // },false)
        var i=0;
        video.addEventListener('play', function() {i=window.setInterval(function() {ctx.drawImage(video,0,0,window.innerWidth, 300)},20);},false);
        video.addEventListener('pause',function() {window.clearInterval(i);},false);
        video.addEventListener('ended',function() {clearInterval(i);},false);  

        //暂停/播放视频
        // canvas.addEventListener('click',() => {
        //     if (!video.paused) {
        //         video.pause();
        //     } else {
        //         video.play();
        //     }
        // },false);
        //不要用匿名方法，否则会在removeEventLister的时候不知道remove哪个
        canvas.addEventListener('click',Play,false);

        if(stopBtn)
        {
            // stopBtn.addEventListener('click',() => {
            //     video.pause();
            // },false);
            //不要用匿名方法
            stopBtn.addEventListener('click',Stop,false);
        }

        if(playBtn)
        {
            playBtn.addEventListener('click',Play,false);
        }

        if(exitBtn)
        {
            exitBtn.addEventListener('click',() => {
                video.pause();
                //删除监听
                canvas.removeEventListener("click",Play);
                playBtn.removeEventListener("click",Play);
                stopBtn.removeEventListener("click",Stop);
                exitBtn.removeEventListener("click",Stop);

                if(closeCallBack)
                {
                    closeCallBack();
                }
            },false);
        }
    }
}