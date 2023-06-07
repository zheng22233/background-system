//传入一个时间戳
export function formatDate(timestamp){
    const time = new Date(timestamp);
    const year = Math.floor(time.getFullYear());
    const mouth = Math.floor(time.getMonth()+1).toString().padStart(2,"0");
    const day = Math.floor(time.getDate()).toString().padStart(2,"0");
    const hour = Math.floor(time.getHours()).toString().padStart(2,"0");
    const minute = Math.floor(time.getMinutes()).toString().padStart(2,"0");
    const second = Math.floor(time.getSeconds()).toString().padStart(2,"0");

    const arr = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
    const week = arr[time.getDay()];

    return `${year}-${mouth}-${day} ${hour}:${minute}:${second} ${week}`
}