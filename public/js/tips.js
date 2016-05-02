var Tips={};
Tips.dom=$('#tips-wrap');
Tips.hide=function(){
    Tips.dom.removeClass('show');
}
Tips.show=function(data){
    var defaultOption={
        text:'ERROR',
        duration:2,//2 second
        color:'#D84949'
    }
    for(var i in defaultOption){
        if(!data[i]){
            data[i]=defaultOption[i]
        }
    }
    Tips.dom.html('<div class="tip" style="background:'+data.color+'">'+data.text+'</div>');
    if(Tips.dom.hasClass('show')){
        return;
    }
    Tips.dom.addClass('show');
    setTimeout(Tips.hide,data.duration*1000);
}
