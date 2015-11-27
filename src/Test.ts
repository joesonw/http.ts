import Url from './entity/Url';

var url = "/coupon/1sehjkhj2ds/test/asdasd?dg=asd&asd";
var pattern = "/coupon/*";

console.log(Url.match(url,pattern));