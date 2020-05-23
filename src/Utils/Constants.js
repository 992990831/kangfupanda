
export const Constants = {
    
    APIBaseUrl: process.env.NODE_ENV === "production"? "http://106.75.216.135:8004/" : "https://localhost:44362/",
    ResourceUrl: process.env.NODE_ENV === "production"? "http://106.75.216.135:8004/Upload" : "https://localhost:44362/Upload",
}
