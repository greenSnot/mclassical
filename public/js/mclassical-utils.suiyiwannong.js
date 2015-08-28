var urlencode =function(str) {  
    str = (str + '').toString();   

    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
} 
var urldecode=function(zipStr){  
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
     var distance2D = function(a,b,c,d){

         return Math.pow((a-c)*(a-c)+(b-d)*(b-d),0.5);

     }

     var distance3D = function(a,b,c,d,e,f){

         return Math.pow((a-d)*(a-d)+(b-e)*(b-e)+(c-f)*(c-f),0.5);

     }

     function position2Rotation(x,y,z){
         var r=distance3D(x,y,z,0,0,0);
         var rx=Math.acos(z/r);
         var ry=Math.asin(y/Math.sin(rx)/r);
         return [rx,ry];
     }

    var epsilon = function ( value ) {

        value=parseFloat(value);
        return Math.abs( value ) < 0.000001 ? 0 : value.toFixed(5);

    };

     var text2Matrix=function(t){
         var m=new WebKitCSSMatrix(t);
         return [
             epsilon(m.m11),epsilon( m.m12),epsilon(m.m13),epsilon(m.m14),
             epsilon(m.m21),epsilon( m.m22),epsilon(m.m23),epsilon(m.m24),
             epsilon(m.m31),epsilon( m.m32),epsilon(m.m33),epsilon(m.m34),
             epsilon(m.m41),epsilon( m.m42),epsilon(m.m43),epsilon(m.m44)
         ];
     }

     var matrix2Text=function(a,b,c,d ,e,f,g,h, i,j,k,l, m,n,o,p){
         if(typeof(a)=='object'){
             return 'matrix3d('+(a.join(','))+')';
         }
         return 'matrix3d('+a+','+b+','+c+','+d+','+e+','+f+','+g+','+h+','+i+','+j+','+k+','+l+','+m+','+n+','+o+','+p+')';
     }

     var multiplyMatrix=function(a,b){
        var m=
         [
           a[0] *b[0]+a[1] *b[4]+a[2] *b[8]+a[3] *b[12], a[0] *b[1]+a[1] *b[5]+a[2] *b[9]+a[3] *b[13], a[0] *b[2]+a[1] *b[6]+a[2] *b[10]+a[3] *b[14], a[0] *b[3]+a[1] *b[7]+a[2] *b[11]+a[3] *b[15],
           a[4] *b[0]+a[5] *b[4]+a[6] *b[8]+a[7] *b[12], a[4] *b[1]+a[5] *b[5]+a[6] *b[9]+a[7] *b[13], a[4] *b[2]+a[5] *b[6]+a[6] *b[10]+a[7] *b[14], a[4] *b[3]+a[5] *b[7]+a[6] *b[11]+a[7] *b[15],
           a[8] *b[0]+a[9] *b[4]+a[10]*b[8]+a[11]*b[12], a[8] *b[1]+a[9] *b[5]+a[10]*b[9]+a[11]*b[13], a[8] *b[2]+a[9] *b[6]+a[10]*b[10]+a[11]*b[14], a[8] *b[3]+a[9] *b[7]+a[10]*b[11]+a[11]*b[15],
           a[12]*b[0]+a[13]*b[4]+a[14]*b[8]+a[15]*b[12], a[12]*b[1]+a[13]*b[5]+a[14]*b[9]+a[15]*b[13], a[12]*b[2]+a[13]*b[6]+a[14]*b[10]+a[15]*b[14], a[12]*b[3]+a[13]*b[7]+a[14]*b[11]+a[15]*b[15]
         ];
         return m;
     }

     var multiplyMatrixs=function(list){
         if(list.length==1){
             return list[0];
         }
         var t=[multiplyMatrix(list[1],list[0])];
         for(var j=2;j<list.length;++j){
             t.push(list[j]);
         }
         return multiplyMatrixs(t);
     }

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
