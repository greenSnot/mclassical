/*! Mclassical 2015-08-08 */    
!function(a){function b(){g._animateId=requestAnimationFrame(b),g.pauseAnimation||(c(),TWEEN.update())}function c(){g.frames++,g.ry+=g.autoRotate,e+=g.autoRotate,g.camera.style.webkitTransform="translateZ("+epsilon(g.perspective)+"px) rotateX("+epsilon(g.rx)+"deg) rotateY("+epsilon(g.ry)+"deg)"+g.cameraBaseTransform,g.frames%3==0&&(g._gif_offset-=128,g._gif_offset=g._gif_offset>=0?g._gif_offset:3200,$(".spot_icon").css("background-position-y",g._gif_offset+"px"))}var d,e,f=function(a,b){g.debug&&(console.log(a),b?$("#logger").text(a):$("#logger").append("<div>"+a+"</div>"))},g={autoRotate:0,mode:"viewer",frames:0,debug:!1,pauseAnimation:!1,dom:$("#pano"),cubeSize:1024,ry:0,rx:0,maxfov:120,minfov:60,fov:90,_gif_offset:3200},h={front:"rotateY(90deg)translateZ(-"+g.cubeSize/2+"px)",bottom:"rotateY(90deg)rotateX(90deg)  translateZ(-"+g.cubeSize/2+"px) rotateZ(90deg)",left:"rotateY(90deg)rotateY(90deg)  translateZ(-"+g.cubeSize/2+"px)",back:"rotateY(90deg)rotateY(180deg) translateZ(-"+g.cubeSize/2+"px)",top:"rotateY(90deg)rotateX(-90deg) translateZ(-"+g.cubeSize/2+"px) rotateZ(-90deg)",right:"rotateY(90deg)rotateY(-90deg) translateZ(-"+g.cubeSize/2+"px)"};a.pano=a.pano||g;var i=function(a){a<g.minfov||a>g.maxfov||(g.fov=a,g.container.style["-webkit-transform"]="scale("+Math.tan(g.maxfov/2*Math.PI/180)/Math.tan(g.fov/2*Math.PI/180)+")")},j=new TWEEN.Tween(g).easing(TWEEN.Easing.Quartic.Out),k=function(a,c){$(".sprite").remove(),g._imageDownloaded=0,cancelAnimationFrame(g._animateId);for(var f in a)g[f]=a[f];d=g.rx,e=g.ry,g.loaderDom&&g.loaderDom.show(),c||(g.camera=g.dom.find("#camera")[0],g.container=g.dom.find("#container")[0],g.dom.find(".link").each(function(){$(this).remove()}),g.width=g.dom.width(),g.height=g.dom.height(),g.perspective=g.width/2/Math.tan(g.maxfov/2*Math.PI/180),g.container.style["-webkit-perspective"]=g.perspective+"px",g.camera.style["-webkit-transform"]="translateZ("+g.perspective+"px) rotateX("+g.rx+"deg) rotateY("+g.ry+"deg) translateX("+(g.cubeSize-g.width)/-2+"px) translateY("+(g.cubeSize-g.height)/-2+"px)",g.cameraBaseTransform="translateX("+epsilon((g.cubeSize-g.width)/-2)+"px) translateY("+epsilon((g.cubeSize-g.height)/-2)+"px)"),i(g.fov);var j=0;for(var f in h)$(".cube."+f).css("-webkit-transform",h[f]),$(".cube."+f).css("width",g.cubeSize+2+"px"),$(".cube."+f).css("height",g.cubeSize+2+"px"),g.debug||!g.sceneKey?$(".cube."+f).css("background-color","rgba(255,255,255,1)"):($(".cube."+f)[0].src="http://7xiljm.com1.z0.glb.clouddn.com/images/scenes/"+g.sceneKey+"/allinone.jpg?imageMogr2/gravity/NorthWest/crop/!1024x1024a0a"+1024*j+"/interlace/0/thumbnail/!10p",$(".cube."+f)[0].onload=function(){if(g._imageDownloaded=g._imageDownloaded>0?g._imageDownloaded+1:1,6==g._imageDownloaded){g.loaderDom&&g.loaderDom.hide();var a=0;for(var b in h)navigator.userAgent.indexOf("iPhone")>=0||navigator.userAgent.indexOf("iPad")>=0?$(".cube."+b)[0].setAttribute("src","http://7xiljm.com1.z0.glb.clouddn.com/images/scenes/"+g.sceneKey+"/allinone.jpg?imageMogr2/gravity/NorthWest/crop/!1024x1024a0a"+1024*a+"/interlace/0/thumbnail/!50p"):$(".cube."+b)[0].setAttribute("src","http://7xiljm.com1.z0.glb.clouddn.com/images/scenes/"+g.sceneKey+"/allinone.jpg?imageMogr2/gravity/NorthWest/crop/!1024x1024a0a"+1024*a+"/interlace/0/thumbnail/!100p"),++a}}),j++;if(a&&(p(a.spots),o(a.comments),a.advertisement)){var k=m("advertisement",0,{text:a.advertisement});r(k,0,-200,0)}checkMobile()?(g.container.addEventListener("touchstart",v,!1),g.container.addEventListener("touchmove",u,!1),g.container.addEventListener("touchend",x,!1)):(g.container.addEventListener("mousedown",v,!1),g.container.addEventListener("mousemove",u,!1),g.container.addEventListener("mouseup",x,!1),g.container.addEventListener("mousewheel",w,!1)),b()},l={fx:0,fy:0,sx:0,sy:0},m=function(a,b,c){var d=document.createElement("div");if(d.className=a,d.id=a.split("_")[0]+"_"+b,d.setAttribute("data-id",b),d.style.width="1px",d.style.height="1px",d.style.marginLeft="-50%",d.style.zIndex="20",0==a.indexOf("spot")){d.setAttribute("data-scene",c.scene),d.setAttribute("data-type",c.type),d.setAttribute("data-text",c.text);var e=document.createElement("div");e.className="spot_icon";var f=document.createElement("div");f.className="spot_description",f.innerHTML=c.text,d.appendChild(f),d.appendChild(e)}else if(0==a.indexOf("comment")){d.style.width="auto",d.style.height="auto",d.style.marginLeft="auto",c.is_description&&d.setAttribute("data-is-description",1),c.is_mosaic&&d.setAttribute("data-is-mosaic",1);var g=document.createElement("div");g.className="comment-content",g.innerHTML=c.text,d.appendChild(g)}else if(0==a.indexOf("advertisement")){var h=document.createElement("div"),i=document.createElement("div");h.className="ad",i.className="ad-content",i.innerHTML=c.text,h.appendChild(i),d.appendChild(h)}else if(0==a.indexOf("music")){var j=document.createElement("div");j.className=a+"-content",j.setAttribute("audio_url",c.audio_url),j.style.backgroundImage="url("+c.picture_small+")",j.style.backgroundSize="100%",d.appendChild(j)}else{var j=document.createElement("div");j.className=a+"-content",d.appendChild(j)}return d},n=function(a){var b=a,c=m("music",b.songid,b);t(c,250,b.rx,b.ry)},o=function(a){for(var b in a){var c=a[b],d=m("comment",c.id,{text:c.text,x:c.position_x,y:c.position_y,z:c.position_z,avatar_url:c.avatar_url,type:c.type,is_description:c.is_description,is_mosaic:c.is_mosaic});r(d,1.4*c.position_x,1.4*c.position_y,1.4*c.position_z)}"viewer"==g.mode&&$('.comment[data-is-description="1"]').addClass("readable")},p=function(a){var b={0:"straight",1:"left",2:"right",3:"upleft",4:"upright",5:"dotone",6:"dottwo",7:"finger",8:"magnifier",9:"down"};for(var c in a){var d=a[c],e=m("spot_"+b[d.type],d.id,{text:d.text,scene:d.sceneKey,type:d.type,x:d.position_x,y:d.position_y,z:d.position_z});r(e,2*d.position_x,2*d.position_y,2*d.position_z)}},q=function(a,b,c,d,e){var f=text2Matrix("rotateY("+epsilon(-e)+"deg) rotateX("+epsilon(-d)+"deg) translate3d("+epsilon(a)+"px,"+epsilon(b)+"px,"+epsilon(c)+"px)");return[-parseFloat(f[12]),-parseFloat(f[13]),-parseFloat(f[14])]},r=function(a,b,c,d,e,f){if(d=-d,b=-b,c=-c,void 0!=e&&void 0!=f){var h=q(b,c,d,e,f);return void r(a,h[0],h[1],h[2])}var i=document.createElement("div");i.style.display="inline-block",i.style.position="absolute",i.className="sprite",i.style["-webkit-transform-origin-x"]="0",i.style["-webkit-transform-origin-y"]="0";var j=0==b&&0==d?0:Math.acos(d/Math.pow(b*b+d*d,.5));j=0>b?2*Math.PI-j:j,j=180*j/Math.PI;var k=distance3D(b,c,d,0,0,0);b+=g.cubeSize/2,c+=g.cubeSize/2;var l=text2Matrix("translate3d("+epsilon(b)+"px,"+epsilon(c)+"px,"+epsilon(d)+"px) rotateY("+epsilon(j)+"deg) rotateX("+epsilon((c-g.cubeSize/2)/k*-90)+"deg) rotateY(180deg)");i.style["-webkit-transform"]=matrix2Text(l),i.appendChild(a),g.camera.appendChild(i)},s=function(a,b,c){a=-a,b=-b;var d=g.cubeSize/2,e=g.cubeSize/2,f=text2Matrix("translate3d("+d+"px,"+e+"px,0) rotateY(0deg) rotateX(0deg) rotateY("+(c?-c:0)+"deg) rotateX("+(b?-b:0)+"deg) translateZ("+a+"px)");return[-f[12]+g.cubeSize/2,f[13]-g.cubeSize/2,-f[14]]},t=function(a,b,c,d,e){b=-b,c=-c;var f,h=g.cubeSize/2,i=g.cubeSize/2;if(1==e)return f=text2Matrix("translate3d("+h+"px,"+i+"px,0) rotateY("+-g.ry+"deg) rotateX("+-g.rx+"deg) rotateY("+(d?-d:0)+"deg) rotateX("+(c?-c:0)+"deg) translateZ("+b+"px)"),void r(a,-f[12]+g.cubeSize/2,-f[13]+g.cubeSize/2,-f[14]);f=text2Matrix("translate3d("+h+"px,"+i+"px,0) rotateY("+(d?-d:0)+"deg) rotateX("+(c?-c:0)+"deg) translateZ("+b+"px)");var j=document.createElement("div");j.style.display="inline-block",j.style.position="absolute",j.className="sprite",j.style["-webkit-transform-origin-x"]="0",j.style["-webkit-transform-origin-y"]="0",j.style["-webkit-transform"]=matrix2Text(f),j.appendChild(a),g.camera.appendChild(j)},u=function(a){a.preventDefault(),a.stopPropagation();var b=parseInt(a.clientX>=0?a.clientX:a.touches[0].pageX),c=parseInt(a.clientY>=0?a.clientY:a.touches[0].pageY);if(l.click=!1,!l.onTouching)return!1;if(a.touches&&a.touches.length>1){var h=b,i=c,k=a.touches[1].pageX,m=a.touches[1].pageY,n=distance2D(l.fx,l.fy,l.sx,l.sy)-distance2D(h,i,k,m),o=.12;return g.setFov(g.fov+n*o),l.fx=h,l.fy=i,l.sx=k,l.sy=m,f("fov: "+parseInt(g.fov)+"; rx: "+g.rx.toFixed(2)+"; ry: "+g.ry.toFixed(2),!0),!1}var o=.3;e+=(l.fx-b)*o,d-=(l.fy-c)*o,l.fx=b,l.fy=c,d=d>90?90:d,d=-90>d?-90:d,j.to({ry:e,rx:d},300).start()},v=function(a){a.preventDefault(),a.stopPropagation();var b=parseInt(a.clientX>=0?a.clientX:a.touches[0].clientX),c=parseInt(a.clientY>=0?a.clientY:a.touches[0].clientY);l.fx=b,l.fy=c,l.click=!0,a.touches&&a.touches.length>1&&(l.sx=a.touches[1].pageX,l.sy=a.touches[1].pageY),l.onTouching=!0},w=function(a){a.preventDefault(),a.stopPropagation();var b=a.deltaY;g.setFov(g.fov+.06*b)},x=function(a){a.preventDefault(),a.stopPropagation();var b=parseInt(a.clientX>=0?a.clientX:a.changedTouches[0].pageX),c=parseInt(a.clientY>=0?a.clientY:a.changedTouches[0].pageY);if(l.click){var d=135,e=(b/g.width-.5)*g.fov,f=(c/g.height-.5)*g.fov*g.height/g.width,h=Math.cos(g.fov/2*Math.PI/180)*g.cubeSize,i=(b-g.width/2)/g.width*2,j=(c-g.height/2)/g.width*2,k=Math.sin(g.fov/2*Math.PI/180)*g.cubeSize;e=Math.atan(i*k/h),f=Math.atan(j*k/h),e*=180/Math.PI,f*=180/Math.PI;var m,n=(s(d,f,e),s(d,f,0)),o=distance3D(-Math.tan(e*Math.PI/180)*n[2],-n[1],n[2],0,0,0),p=d/o,r=q(-Math.tan(e*Math.PI/180)*n[2]*p,-n[1]*p,n[2]*p,g.rx,g.ry),t=-r[0],u=-r[1],v=-r[2],w=.4;$(".sprite").each(function(){var a=text2Matrix($(this)[0].style.webkitTransform),b=position2Rotation(t,-u,v),c=position2Rotation(g.cubeSize/2-a[12],a[13]-g.cubeSize/2,-a[14]),d=Math.abs(b[0]-c[0])+Math.abs(b[1]-c[1]);w>d&&(w=d,m=$(this).children().eq(0))}),m&&0==m[0].className.indexOf("music")&&($(".QQMusicAudio").each(function(){$(this)[0].pause()}),$("html").append('<audio style="display:none" class="QQMusicAudio" autoplay="autoplay" src="'+m.find(".music-content").attr("audio_url")+'"></audio>'))}l.onTouching=!1},y=function(a){g.rx=a},z=function(a){g.ry=a};$.extend(a.pano,{setFov:i,setRx:y,setRy:z,init:k,loadSpots:p,loadComments:o,loadMusic:n})}(window);