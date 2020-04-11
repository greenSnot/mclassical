     function bindClick(ele,callback,father,children){
         var x,y;
         function ts(e){
             if(e.originalEvent){
                 e=e.originalEvent;
             }
             x=e.touches[0].pageX;
             y=e.touches[0].pageY;
         }
         function te(e){
             if(e.originalEvent){
                 e=e.originalEvent;
             }
             var _x=e.changedTouches[0].pageX;
             var _y=e.changedTouches[0].pageY;
             if(distance2D(_x,_y,x,y)<6){
                 callback.call(this,e);
             }
         }
         if(father){
             father.delegate(children,'touchstart',ts);
             father.delegate(children,'touchend',te);
         }else{
             ele.on('touchstart',ts);
             ele.on('touchend',te);
         }
     }

var urlencode =function(str) {  
    str = (str + '').toString();   

    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
} 
var urldecode=function(zipStr){  
    if(!zipStr){
        return zipStr;
    }
    var uzipStr="";  
    for(var i=0;i<zipStr.length;i++){  
        var chr = zipStr.charAt(i);  
        if(chr == "+"){  
            uzipStr+=" ";  
        }else if(chr=="%"){  
            var asc = zipStr.substring(i+1,i+3);  
            if(parseInt("0x"+asc)>0x7f){  
                uzipStr+=decodeURI("%"+asc.toString()+zipStr.substring(i+3,i+9).toString());  
                i+=8;  
            }else{  
                uzipStr+=AsciiToString(parseInt("0x"+asc));  
                i+=2;  
            }  
        }else{  
            uzipStr+= chr;  
        }  
    }  
  
    return uzipStr;  
}

function htmlencode(value){
  return $('<div/>').text(value).html();
}

function htmldecode(value){
  return $('<div/>').html(value).text();
}

function speech(text){
    var src = 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=' + text;
    var audio= "<audio style='display:none' src='"+src+"' autoplay='autoplay' ></audio>";
    $('html').append(audio);
}

var unicode2Chr=function(str) { 
 if ('' != str) { 
  var st, t, i 
  st = ''; 
  for (i = 1; i <= str.length/4; i ++){ 
   t = str.slice(4*i-4, 4*i-2); 
   t = str.slice(4*i-2, 4*i).concat(t); 
   st = st.concat('%u').concat(t); 
  } 
  st = unescape(st); 
  return(st); 
 } 
 else 
  return(''); 
} 

    var getFloat=function(a){
        var b='';
        for(var i in a){
            if((a[i]>=0&&a[i]<=9)||a[i]=='.'){
                b+=a[i];
            }
        }
        return parseFloat(b);
    }

    var epsilon = function ( value ) {

        value=parseFloat(value);
        return Math.abs( value ) < 0.000001 ? 0 : value.toFixed(5);

    };

    function checkMobile(){
        if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) 
                || /Android/i.test(navigator.userAgent) 
                || /BlackBerry/i.test(navigator.userAgent) 
                || /IEMobile/i.test(navigator.userAgent) 
                || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
                    if(/iPad/i.test(navigator.userAgent)){
                        if(/MicroMessenger/i.test(navigator.userAgent)){
                            return 3; //微信
                        }
                        return 2;//平板
                    }else{
                        if(/MicroMessenger/i.test(navigator.userAgent)){
                            return 3; //微信
                        }
                        return 1;//手机
                    }
                }else{
                    return 0;
                }
    }

    window.requestAnimationFrame= (function () { 
        return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        // if all else fails, use setTimeout 
        function (callback) { 
            return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps 
        }; 
    })(); 

    window.cancelAnimationFrame= (function () { 
        return window.cancelAnimationFrame || 
        window.webkitCancelAnimationFrame || 
        window.mozCancelAnimationFrame || 
        window.oCancelAnimationFrame || 
        function (id) { 
            window.clearTimeout(id); 
        }; 
    })(); 
