var clipMap={sent_t:0,events:[],x:function(){if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;for(var a,b=["MSXML2.XmlHttp.6.0","MSXML2.XmlHttp.5.0","MSXML2.XmlHttp.4.0","MSXML2.XmlHttp.3.0","MSXML2.XmlHttp.2.0","Microsoft.XmlHttp"],c=0;c<b.length;c++)try{a=new ActiveXObject(b[c]);break}catch(d){}return a},send:function(a,b,c,d,e){void 0===e&&(e=!0);ajax.x();clipMap.x.open(c,a,e),clipMap.x.onreadystatechange=function(){4==clipMap.x.readyState&&b(clipMap.x.responseText)},"POST"==c&&clipMap.x.setRequestHeader("Content-type","application/x-www-form-urlencoded"),clipMap.x.send(d)},get:function(a,b,c,d){var e=[];for(var f in b)e.push(encodeURIComponent(f)+"="+encodeURIComponent(b[f]));clipMap.send(a+(e.length?"?"+e.join("&"):""),c,"GET",null,d)},post:function(a,b,c,d){var e=[];for(var f in b)e.push(encodeURIComponent(f)+"="+encodeURIComponent(b[f]));clipMap.send(a,c,"POST",e.join("&"),d)},init:function(a){this.url==("undefined"!=typeof a.url?a.url:!1),this.wordpress="undefined"!=typeof a.wordpress?a.wordpress:!1,window.addEventListener("mousemove",function(a){this.send_t++;var b={x:a.clientX,y:a.clientY};this.events.push(JSON.stringify(b)),this.send_t>100&&(this.send_t=0,clipMap.post(url,this.events,function(){}))}),window.addEventListener("click",function(a){var b={x:a.clientX,y:a.clientY,tag:a.target.tagName,"class":a.target.getAttribute("class"),id:a.target.getAttribute("id"),href:a.target.getAttribute("href"),src:a.target.getAttribute("src")};clipMap.post(url,JSON.stringify(b),function(){})})}};