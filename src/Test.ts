import Url from './Url';

var url = "/coupon/";
var pattern = "/coupon/:couponId/test/:wtf";

console.log(Url.match(url,pattern));