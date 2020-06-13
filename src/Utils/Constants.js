
export const Constants = {
    
    // APIBaseUrl: process.env.NODE_ENV === "production"? "http://106.75.216.135:8004/" : "https://localhost:44362/",
    // ResourceUrl: process.env.NODE_ENV === "production"? "http://app.kangfupanda.com/Upload/" : "https://localhost:44362/Upload/",
    //APIBaseUrl: process.env.NODE_ENV === "production"? "http://47.111.166.154:8004/" : "https://localhost:44362/",
    APIBaseUrl: process.env.NODE_ENV === "production"? "https://api.kangfupanda.com/" : "https://localhost:44362/",
    //ResourceUrl: process.env.NODE_ENV === "production"? "http://app.kangfupanda.com/Upload/" : "https://localhost:44362/Upload/",
    //ResourceUrl: process.env.NODE_ENV === "production"? "http://47.111.166.154:8004/Upload/" : "https://localhost:44362/Upload/",
    ResourceUrl: process.env.NODE_ENV === "production"? "https://api.kangfupanda.com/Upload/" : "https://localhost:44362/Upload/",
    AppId:'wxc10ff63ecf588c90',
    AppSecret: '7289786fae8511cbe9e94a8aec93e125',
    RedirectUrl: 'https://app.kangfupanda.com/#/profile',    
}

