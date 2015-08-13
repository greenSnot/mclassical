!function(global) {


     var log = function (a,overlap) {

         if(!pano.debug){
             return;
         }

         console.log(a);

         if (overlap) {
             $('#logger').text(a);
         } else {
             $('#logger').append('<div>'+a+'</div>');
         }

     }

     var pano={

         autoRotate:0,
         mode:'viewer',
         frames:0,

         debug : false,
         pauseAnimation: false,

         dom       : $('#pano'),

         cubeSize : 1024,

         ry : 0,       // Rotate * degree around y axis
         rx : 0,       // Rotate * degree around x axis
         maxfov : 120, // Max field of view (degree)
         minfov : 60,  // Min field of view (degree)
         fov : 90,     // Default field of view

         _gif_offset:3200
     }

     var _cubeConfig={

             front :"rotateY(90deg)"+                "translateZ(-" + (pano.cubeSize/2)+"px)",
             bottom:"rotateY(90deg)"+"rotateX(90deg)  translateZ(-" + (pano.cubeSize/2)+"px) rotateZ(90deg)",
             left  :"rotateY(90deg)"+"rotateY(90deg)  translateZ(-" + (pano.cubeSize/2)+"px)",
             back  :"rotateY(90deg)"+"rotateY(180deg) translateZ(-" + (pano.cubeSize/2)+"px)",
             top   :"rotateY(90deg)"+"rotateX(-90deg) translateZ(-" + (pano.cubeSize/2)+"px) rotateZ(-90deg)",
             right :"rotateY(90deg)"+"rotateY(-90deg) translateZ(-" + (pano.cubeSize/2)+"px)"

         };


     var _rx;
     var _ry;

     global.pano= global.pano|| pano;

     var _setFov = function (degree) {

         if(degree<pano.minfov||degree>pano.maxfov){

             return;

         }

         pano.fov=degree;
         pano.container.style['-webkit-transform']='scale('+Math.tan(pano.maxfov/2*Math.PI/180)/Math.tan(pano.fov/2*Math.PI/180)+')';

    }


     var tween = new TWEEN.Tween(pano)
                          //.easing(TWEEN.Easing.Exponential.Out);
                          .easing(TWEEN.Easing.Quartic.Out);
                          //.easing(TWEEN.Easing.Cubic.Out);
                          //.easing(TWEEN.Easing.Linear);


     var _init = function(config,ajax){
         $('.sprite').remove();
         pano._imageDownloaded=0;

         cancelAnimationFrame(pano._animateId);

         for(var i in config){
             pano[i]=config[i];
         }

         _rx=pano.rx;
         _ry=pano.ry;

         if(pano.loaderDom){
             pano.loaderDom.show();
         }

         if(!ajax){

            pano.camera    = pano.dom.find('#camera')[0],
            pano.container = pano.dom.find('#container')[0],
            pano.dom.find('.link').each(function(){
                $(this).remove();
            });

            pano.width=pano.dom.width();
            pano.height=pano.dom.height();

            pano.perspective=pano.width/2/Math.tan(pano.maxfov/2*Math.PI/180);

            pano.container.style['-webkit-perspective']=pano.perspective+'px';

            pano.camera.style['-webkit-transform']='translateZ('+pano.perspective+'px) rotateX('+pano.rx+'deg) rotateY('+pano.ry+'deg) translateX('+((pano.cubeSize-pano.width)/-2)+'px) translateY('+((pano.cubeSize-pano.height)/-2)+'px)';
            pano.cameraBaseTransform='translateX('+epsilon((pano.cubeSize-pano.width)/-2)+'px) translateY('+epsilon((pano.cubeSize-pano.height)/-2)+'px)';

         }
         _setFov(pano.fov);

         var counter=0;

         for(var i in _cubeConfig){

             $('.cube.'+i).css('-webkit-transform',_cubeConfig[i]);
             $('.cube.'+i).css('width' ,pano.cubeSize+2+'px');        // 2 more pixels for overlapping gaps ( chrome's bug )
             $('.cube.'+i).css('height',pano.cubeSize+2+'px');        // 2 more pixels for overlapping gaps ( chrome's bug )

             if (pano.debug||!pano.sceneKey) {

                 $('.cube.'+i).css('background-color','rgba(255,255,255,1)');

             } else {

                 $('.cube.'+i)[0].src='http://7xiljm.com1.z0.glb.clouddn.com/images/scenes/'+pano.sceneKey+'/allinone.jpg?imageMogr2/gravity/NorthWest/crop/!1024x1024a0a'+(counter*1024)+'/interlace/0/thumbnail/!10p';

                 $('.cube.'+i)[0].onload=function(){
                     pano._imageDownloaded=pano._imageDownloaded>0?pano._imageDownloaded+1:1;
                     if(pano._imageDownloaded==6){

                         if(pano.loaderDom){

                             pano.loaderDom.hide();

                         }

                         var c=0;
                         for(var i in _cubeConfig){
                             if(navigator.userAgent.indexOf('iPhone')>=0||navigator.userAgent.indexOf('iPad')>=0){
                                 $('.cube.'+i)[0].setAttribute('src','http://7xiljm.com1.z0.glb.clouddn.com/images/scenes/'+pano.sceneKey+'/allinone.jpg?imageMogr2/gravity/NorthWest/crop/!1024x1024a0a'+(c*1024)+'/interlace/0/thumbnail/!50p');
                             }else{
                                 $('.cube.'+i)[0].setAttribute('src','http://7xiljm.com1.z0.glb.clouddn.com/images/scenes/'+pano.sceneKey+'/allinone.jpg?imageMogr2/gravity/NorthWest/crop/!1024x1024a0a'+(c*1024)+'/interlace/0/thumbnail/!100p');
                             }
                             ++c;
                         }


                     }
                 }

             }

             counter++;

         }

         if(config){
             _loadSpots(config.spots);
             _loadComments(config.comments);

            if ( config.advertisement ){
                var element=genElement('advertisement',0,{text:config.advertisement});
                addSpriteByPosition(element,0,-200,0);
            }
         }

         if ( checkMobile() ) {

             pano.container.addEventListener('touchstart',mouseDown,false);
             pano.container.addEventListener('touchmove' ,mouseMove,false);
             pano.container.addEventListener('touchend'  ,mouseUp  ,false);

         } else {

             pano.container.addEventListener('mousedown' ,mouseDown ,false);
             pano.container.addEventListener('mousemove' ,mouseMove ,false);
             pano.container.addEventListener('mouseup'   ,mouseUp   ,false);
             pano.container.addEventListener('mousewheel',mouseWheel,false);

         }

         _animate();

     }

     var touches = {

         fx:0,   // First  finger x
         fy:0,   // First  finger y
         sx:0,   // Second finger x
         sy:0    // Second finger y

     };

     var genElement=function(type,id,extra){

         var element= document.createElement('div');
         element.className=type;
         element.id=type.split('_')[0]+'_'+id;
         element.setAttribute('data-id',id);

         element.style.width="1px";
         element.style.height="1px";
         element.style.marginLeft='-50%';
         element.style.zIndex="20";

         if(type.indexOf('spot')==0){
             element.setAttribute('data-scene',extra.scene);
             element.setAttribute('data-type',extra.type);
             element.setAttribute('data-text',extra.text);
             var spot=document.createElement('div');
             spot.className='spot_icon';
             var description=document.createElement('div');
             description.className='spot_description';
             description.innerHTML=extra.text;
             element.appendChild(description);
             element.appendChild(spot);
         }else if(type.indexOf('comment')==0){
             element.style.width="auto";
             element.style.height="auto";
             element.style.marginLeft='auto';
             if(extra.is_description){
                 element.setAttribute('data-is-description',1);
             }
             if(extra.is_mosaic){
                 element.setAttribute('data-is-mosaic',1);
             }
             var comment=document.createElement('div');
             comment.className="comment-content";
             comment.innerHTML=extra.text;
             element.appendChild(comment);
         }else if(type.indexOf('advertisement')==0){
             var ad=document.createElement('div');
             var content=document.createElement('div');
             ad.className='ad';
             content.className='ad-content';
             content.innerHTML=extra.text;
             ad.appendChild(content);
             element.appendChild(ad);
         }else if(type.indexOf('music')==0){
             var e=document.createElement('div');
             e.className=type+'-content';
             e.setAttribute('audio_url',extra.audio_url);
             e.setAttribute('songname',extra.songname);
             e.setAttribute('singer',extra.singer);
             e.setAttribute('albumname',extra.albumname);
             e.setAttribute('picture_big',extra.picture_big);
             e.setAttribute('picture_small',extra.picture_small);
             e.setAttribute('rx',extra.rx);
             e.setAttribute('ry',extra.ry);
             e.style['backgroundImage']='url('+extra.picture_small+')';
             e.style['z-index']=extra.zindex;
             e.style['backgroundSize']='100%';
             element.appendChild(e);
         }else{
             var e=document.createElement('div');
             e.className=type+'-content';
             element.appendChild(e);
         }

         return element;

     }

     var _loadMusic=function(music){
         var t=music;
         var element=genElement('music',t.songid,t);
         addSpriteByRotation(element,350,t.rx,t.ry);
     }

     var _loadComments=function(comments){
            // Loading Comments
            for(var i in comments){
                var t=comments[i];
                var element=genElement('comment',t.id,{text:t.text,x:t.position_x,y:t.position_y,z:t.position_z,avatar_url:t.avatar_url,type:t.type,is_description:t.is_description,is_mosaic:t.is_mosaic});
                addSpriteByPosition(element,t.position_x*1.4,t.position_y*1.4,t.position_z*1.4);
            }
            if(pano.mode=='viewer'){
                $('.comment[data-is-description="1"]').addClass('readable');
            }
     }

     var _loadSpots=function(spots){

         var spotType = {
             0:'straight',
             1:'left',
             2:'right',
             3:'upleft',
             4:'upright',
             5:'dotone',
             6:'dottwo',
             7:'finger',
             8:'magnifier',
             9:'down'
         };

         for(var i in spots){
             var t=spots[i];
             var element=genElement('spot_'+spotType[t.type],t.id,{text:t.text,scene:t.sceneKey,type:t.type,x:t.position_x,y:t.position_y,z:t.position_z});
             addSpriteByPosition(element,t.position_x*2,t.position_y*2,t.position_z*2);
             //pano.spots[i].iconDom=$('#spot_'+t.id).find('.spot_icon');
         }

     }

     var rotate=function(x,y,z,rx,ry){
         var t=text2Matrix('rotateY('+epsilon(-ry)+'deg) rotateX('+epsilon(-rx)+'deg) translate3d('+epsilon(x)+'px,'+epsilon(y)+'px,'+epsilon(z)+'px)');
         return([-parseFloat(t[12]),
                 -parseFloat(t[13]),
                 -parseFloat(t[14])]);
     }

     var addSpriteByPosition=function(element,x,y,z,rx,ry){

         z=-z;
         x=-x;
         y=-y;

         if(rx!=undefined&&ry!=undefined){
             var rotation=rotate(x,y,z,rx,ry);
             addSpriteByPosition(element,rotation[0],rotation[1],rotation[2]);
             return;
         }

         var wrap= document.createElement('div');
         wrap.style.display='inline-block';
         wrap.style.position='absolute';
         wrap.className="sprite";

         wrap.style['-webkit-transform-origin-x']='0';
         wrap.style['-webkit-transform-origin-y']='0';

         var arc=x==0&&z==0?0:Math.acos(z/Math.pow(x*x+z*z,0.5));

         arc=x<0?2*Math.PI-arc:arc;
         arc=arc*180/Math.PI;

         var r=distance3D(x,y,z,0,0,0);
         x+=pano.cubeSize/2;
         y+=pano.cubeSize/2;


         var transform=text2Matrix('translate3d('+epsilon(x)+'px,'+epsilon(y)+'px,'+epsilon(z)+'px) rotateY('+epsilon(arc)+'deg) rotateX('+epsilon((y-pano.cubeSize/2)/r*-90)+'deg) rotateY(180deg)');

         wrap.style['-webkit-transform']=matrix2Text(transform);

         wrap.appendChild( element );
         pano.camera.appendChild( wrap );
     }

     var rotation2Position=function(z,rx,ry){

         z=-z;
         rx=-rx;

         var x=pano.cubeSize/2;
         var y=pano.cubeSize/2;

         var transform = text2Matrix( 'translate3d('+x+'px,'+y+'px,0) rotateY('+(0)+'deg) rotateX('+(0)+'deg) rotateY('+(ry?-ry:0)+'deg) rotateX('+(rx?-rx:0)+'deg) translateZ('+z+'px)' );
         return [-transform[12]+pano.cubeSize/2,transform[13]-pano.cubeSize/2,-transform[14]];

     }

     var addSpriteByRotation=function(element,z,rx,ry,aroundCamera){

         z=-z;
         rx=-rx;
         var transform;

         var x=pano.cubeSize/2;
         var y=pano.cubeSize/2;

         if(aroundCamera!=true){

             transform = text2Matrix( 'translate3d('+x+'px,'+y+'px,0) rotateY('+(ry?-ry:0)+'deg) rotateX('+(rx?-rx:0)+'deg) translateZ('+z+'px)' );
         }else{

             transform = text2Matrix( 'translate3d('+x+'px,'+y+'px,0) rotateY('+(-pano.ry)+'deg) rotateX('+(-pano.rx)+'deg) rotateY('+(ry?-ry:0)+'deg) rotateX('+(rx?-rx:0)+'deg) translateZ('+z+'px)' );
             addSpriteByPosition(element,-transform[12]+pano.cubeSize/2,-transform[13]+pano.cubeSize/2,-transform[14]);
             return;

         }

         var wrap= document.createElement('div');
         wrap.style.display='inline-block';
         wrap.style.position='absolute';
         wrap.className="sprite";

         wrap.style['-webkit-transform-origin-x']='0';
         wrap.style['-webkit-transform-origin-y']='0';

         wrap.style['-webkit-transform']=matrix2Text(transform);

         wrap.appendChild( element );
         pano.camera.appendChild( wrap );
     }

     var mouseMove = function (event) {

         event.preventDefault();
         event.stopPropagation();

         var x=parseInt(event.clientX>=0?event.clientX:event.touches[0].pageX);
         var y=parseInt(event.clientY>=0?event.clientY:event.touches[0].pageY);

         touches.click=false;

         if(!touches.onTouching){

             return false;

         }

         if(event.touches&&event.touches.length>1){

                 var cfx=x;                          // Current frist  finger x
                 var cfy=y;                          // Current first  finger y
                 var csx=event.touches[1].pageX;     // Current second finger x
                 var csy=event.touches[1].pageY;     // Current second finger y

                 var dis= distance2D(touches.fx,touches.fy,touches.sx,touches.sy)-distance2D(cfx,cfy,csx,csy);

                 var ratio=0.12;
                 pano.setFov(pano.fov+dis*ratio);

                 touches.fx=cfx;
                 touches.fy=cfy;
                 touches.sx=csx;
                 touches.sy=csy;

                 log('fov: '+parseInt(pano.fov)+'; rx: '+pano.rx.toFixed(2)+'; ry: '+pano.ry.toFixed(2),true);

                 return false;

         }

         var ratio=0.3;

         _ry=_ry+(touches.fx-x)*ratio;
         _rx=_rx-(touches.fy-y)*ratio;

         touches.fx=x;
         touches.fy=y;

         _rx=_rx>90?90  :_rx;
         _rx=_rx<-90?-90:_rx;

         if(1||checkMobile()){
          tween
               .to({ry:_ry,rx:_rx},300)
               .start();
         }else{
             pano.camera.style['-webkit-transition']='all 0.3s ease-out';
             pano.rx=_rx;
             pano.ry=_ry;
         }


     };

     var mouseDown = function (event) {

         event.preventDefault();
         event.stopPropagation();

         var x=parseInt(event.clientX>=0?event.clientX:event.touches[0].clientX);
         var y=parseInt(event.clientY>=0?event.clientY:event.touches[0].clientY);

         touches.fx=x;
         touches.fy=y;
         touches.click=true;

         if (event.touches&&event.touches.length>1) {

             touches.sx = event.touches[1].pageX;
             touches.sy = event.touches[1].pageY;

         }

         touches.onTouching = true;

     }

     var mouseWheel = function (event) {

         event.preventDefault();
         event.stopPropagation();

         var offset=event.deltaY;
         pano.setFov(pano.fov+offset*0.06);

     }

     var mouseUp = function (event) {

         event.preventDefault();
         event.stopPropagation();

         var x=parseInt(event.clientX>=0?event.clientX:event.changedTouches[0].pageX);
         var y=parseInt(event.clientY>=0?event.clientY:event.changedTouches[0].pageY);

         if (touches.click) {     // Single click

             var R=350;

             var ry=(x/pano.width-0.5)*pano.fov;
             var rx=(y/pano.height-0.5)*pano.fov*pano.height/pano.width;
             var r=Math.cos(pano.fov/2*Math.PI/180)*pano.cubeSize;
             var ratiox=(x-pano.width/2)/pano.width*2;
             var ratioy=(y-pano.height/2)/pano.width*2;
             var P=Math.sin(pano.fov/2*Math.PI/180)*pano.cubeSize;

             ry=Math.atan(ratiox*P/r);
             rx=Math.atan(ratioy*P/r);

             ry*=180/Math.PI;
             rx*=180/Math.PI;

             var xyz=rotation2Position(R,rx,ry);
             var xyz2=rotation2Position(R,rx,0);

             var rr=distance3D(-Math.tan(ry*Math.PI/180)*xyz2[2],-xyz2[1],xyz2[2],0,0,0);
             var ratio=R/rr;

             var rotation=rotate(-Math.tan(ry*Math.PI/180)*xyz2[2]*ratio,-xyz2[1]*ratio,xyz2[2]*ratio,pano.rx,pano.ry);
             var ax=-rotation[0];
             var ay=-rotation[1];
             var az=-rotation[2];

             var click_rotation=position2Rotation(ax,-ay,az);

             var minOffset=0.4;
             var minDistance=100;
             var nearest;
             $('.sprite').each(function(){
                 var matrix=text2Matrix($(this)[0].style.webkitTransform);
                 //var object_rotation=position2Rotation(pano.cubeSize/2-matrix[12],matrix[13]-pano.cubeSize/2,-matrix[14]);
                 //var offset=Math.abs(click_rotation[0]-object_rotation[0])+Math.abs(click_rotation[1]-object_rotation[1]);
                 //if(offset<minOffset){
                 //    minOffset=offset;
                 //    nearest=$(this).children().eq(0);
                 //}
                 var distance=distance3D(ax,-ay,az,pano.cubeSize/2-matrix[12],matrix[13]-pano.cubeSize/2,-matrix[14]);
                 if(distance<minDistance){
                     minDistance=distance;
                     nearest=$(this).children().eq(0);
                 }
             });

             if(nearest){

                 if(nearest[0].className.indexOf('music')==0){
                     $('#audio')[0].pause();
                     var content=nearest.find('.music-content');

                     pano.autoRotate=0;
                     _setRxRy(content.attr('rx')*-1,content.attr('ry'),1);

                     setTimeout(function(){
                        $('#music-album').css('background-image','url('+content.attr('picture_small')+')');
                        $('#music-album-full').css('background-image','url('+content.attr('picture_big')+')');
                        $('#music-songname').text(content.attr('songname'));
                        $('#music-albumname').text(content.attr('albumname'));
                        $('#music-singer').text(content.attr('singer'));
                        $('#music-details').addClass('show');
                     },300);
                     $('#audio').attr('src',content.attr('audio_url'));
                 }
            }

         }

         touches.onTouching=false;

     }


     function _animate() {
         pano._animateId=requestAnimationFrame( _animate );
         if(!pano.pauseAnimation){
             _update();
             TWEEN.update();
         }
     }

     function _update() {
         pano.frames++;

         pano.ry+=pano.autoRotate;
         _ry+=pano.autoRotate;

         pano.camera.style.webkitTransform = 'translateZ('+epsilon(pano.perspective)+'px)'+' rotateX('+epsilon(pano.rx)+'deg) rotateY('+epsilon(pano.ry)+'deg)'+ pano.cameraBaseTransform;

         if(pano.frames%3==0){
             pano._gif_offset-=128;
             pano._gif_offset=pano._gif_offset>=0?pano._gif_offset:3200;
             //for(var i in pano.spots){
                //pano.spots[i].iconDom.css('background-position-y',pano._gif_offset+'px');
             //}
             $('.spot_icon').css('background-position-y',pano._gif_offset+'px');
         }
     }

     var _setRxRy=function(rx,ry,smooth){
         rx=parseFloat(rx);
         ry=parseFloat(ry);
         if(smooth){
             pano.ry=pano.ry%360;
             _rx=rx;
             if(ry-pano.ry%360>180)pano.ry+=360;
             if(pano.ry%360-ry>180)pano.ry-=360;
             _ry=ry;
             tween
                  .to({ry:_ry,rx:_rx},300)
                  .start();
         }else{
             pano.rx=rx;
             pano.ry=ry;
         }
     }

     var _setRx=function(rx,smooth){
         rx=parseFloat(rx);
         if(smooth){
             _rx=rx;
             tween
                  .to({ry:_ry,rx:_rx},300)
                  .start();
         }else{
             pano.rx=rx;
         }
     }

     var _setRy=function(ry,smooth){
         ry=parseFloat(ry);
         if(smooth){
             if(ry-pano.ry%360>180)pano.ry+=360;
             if(pano.ry%360-ry>180)pano.ry-=360;
             _ry=ry;
             console.log('ry:'+_ry);
             console.log('panory:'+pano.ry);
             tween
                  .to({ry:_ry,rx:_rx},300)
                  .start();
         }else{
             pano.ry=ry;
         }
     }

     $.extend(global.pano,{
        setFov: _setFov,
        setRx: _setRx,
        setRy: _setRy,
        init: _init,
        loadSpots: _loadSpots,
        loadComments: _loadComments,
        loadMusic: _loadMusic,
     });
}(window);
