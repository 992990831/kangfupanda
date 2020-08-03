
export const Constants = {
    
    // APIBaseUrl: process.env.NODE_ENV === "production"? "http://106.75.216.135:8004/" : "https://localhost:44362/",
    // ResourceUrl: process.env.NODE_ENV === "production"? "http://app.kangfupanda.com/Upload/" : "https://localhost:44362/Upload/",
    //APIBaseUrl: process.env.NODE_ENV === "production"? "http://47.111.166.154:8004/" : "https://localhost:44362/",
    APIBaseUrl: process.env.NODE_ENV === "production"? "https://api.kangfupanda.com/" : "https://localhost:44362/",
    //ResourceUrl: process.env.NODE_ENV === "production"? "http://app.kangfupanda.com/Upload/" : "https://localhost:44362/Upload/",
    //ResourceUrl: process.env.NODE_ENV === "production"? "http://47.111.166.154:8004/Upload/" : "https://localhost:44362/Upload/",
    ResourceUrl: process.env.NODE_ENV === "production"? "https://api.kangfupanda.com/Upload/" : "https://localhost:44362/Upload/",
    //专家证书
    ResourceCertUrl: process.env.NODE_ENV === "production"? "https://api.kangfupanda.com/Upload/certificate/" : "https://localhost:44362/Upload/certificate/",

    //专家介绍录像
    ResourceIntroVideoUrl: process.env.NODE_ENV === "production"? "https://api.kangfupanda.com/Upload/introvideo/" : "https://localhost:44362/Upload/introvideo/",

    //快熊康复 AppId:'wxc10ff63ecf588c90',
    //一健点评 AppId:'wx496e5a01291ad836',
    AppId:'wxc10ff63ecf588c90',
    //快熊康复 AppSecret: '7289786fae8511cbe9e94a8aec93e125',
    //一健点评'5a544217123aca4505f8a680de415a35',
    AppSecret: '7289786fae8511cbe9e94a8aec93e125',
    RedirectUrl: 'https://app.kangfupanda.com/#/profile',    

    //最后访问的PostId，回退时需要用到
    LastPostId: 'LastPostId',
    AllPosts: 'AllPosts'
}

