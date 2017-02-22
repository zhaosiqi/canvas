function shape(canvas,copy,cobj){
    this.canvas=canvas;
    this.cobj=cobj;
    this.copy=copy;
    this.erasize=10;
    this.width=this.canvas.width;
    this.height=this.canvas.height;
    this.type="line";
    this.style="stroke";
    this.lineWidth=1;
    this.fillStyle="black";
    this.strokeStyle="black";
    this.history=[];
    this.polnum=5;
    this.starnum=5;
    this.isback=true;
}
shape.prototype={

    init:function(){
        // this.cobj.type=this.type;
        // this.cobj.plonum=this.plonum;
        // this.cobj.style=this.style;
        this.cobj.lineWidth=this.lineWidth;
        this.cobj.erasize=this.erasize;
        this.cobj.fillStyle=this.fillStyle;
        this.cobj.strokeStyle=this.strokeStyle;
    },
    draw:function(){
        var that=this;

        this.copy.onmousedown=function(e){
            that.init();
            var sx=e.offsetX;
            var sy=e.offsetY;
            that.copy.onmousemove=function(e){
                that.isback=true;
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0)
                }
                var mx=e.offsetX;
                var my=e.offsetY;

                that[that.type](sx,sy,mx,my);
            }
            that.copy.onmouseup=function(){
                //
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    line:function(sx,sy,mx,my){
        this.cobj.beginPath();
        this.cobj.moveTo(sx,sy);
        this.cobj.lineTo(mx,my);
        this.cobj.closePath();
        this.cobj.stroke();
    },
    rect:function(sx,sy,mx,my){
        this.cobj.beginPath();
        this.cobj.rect(sx,sy,mx-sx,my-sy);
        this.cobj[this.style]();
    },
    arc:function(sx,sy,mx,my){
        this.cobj.beginPath();
        var r=Math.sqrt((mx-sx)*(mx-sx)+(my-sy)*(my-sy));
        this.cobj.arc(sx,sy,r,0,2*Math.PI);
        this.cobj[this.style]();
    },
    polygon:function(sx,sy,mx,my){
        this.cobj.beginPath();
        var angle=360/this.polnum*Math.PI/180;
        var r=Math.sqrt((mx-sx)*(mx-sx)+(my-sy)*(my-sy));
        for(var i=0;i<this.polnum;i++){
            var x=Math.cos(angle*i)*r+sx;
            var y=Math.sin(angle*i)*r+sy;
            this.cobj.lineTo(x,y);
        }
        this.cobj.closePath();
        this.cobj[this.style]();

    },
    star:function(sx,sy,mx,my){
        this.cobj.beginPath();
        var angle=360/(this.starnum*2)*Math.PI/180;
        var r=Math.sqrt((mx-sx)*(mx-sx)+(my-sy)*(my-sy));
        var sr=r/3;
        for(var i=0;i<this.starnum*2;i++){
            if(i%2==0){
                var x=Math.cos(angle*i)*r+sx;
                var y=Math.sin(angle*i)*r+sy;
                this.cobj.lineTo(x,y);
            }else{
                var x=Math.cos(angle*i)*sr+sx;
                var y=Math.sin(angle*i)*sr+sy;
                this.cobj.lineTo(x,y);
            }
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    pen:function(){
        var that=this;
        this.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function(e){
                that.isback=true;
                that.init();
                var endx= e.offsetX;
                var endy= e.offsetY;
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();

            }

            that.copy.onmouseup=function(){

                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
            }
        }
    },
    eraser:function(eraObj){

        if(this.isback==true){
            var that = this;
            that.copy.onmousemove=function(e){
                eraObj.style.display="block";
                var e=e||window.event;
                var ox=e.offsetX-(eraObj.offsetWidth/2);
                var oy=e.offsetY-(eraObj.offsetHeight/2);
                var maxx=that.width-eraObj.offsetWidth;
                var maxy=that.height-eraObj.offsetHeight;

                if(ox<=0){ox=0};
                if(oy<=0){oy=0};
                if(ox>=maxx){ox=maxx};
                if(oy>=maxy){oy=maxy};
                eraObj.style.left=ox+"px";
                eraObj.style.top=oy+"px";



            }
            that.copy.onmousedown=function(e){
                var e=e||window.event;
                var startx= e.offsetX;
                var starty= e.offsetY;
                eraObj.style.left=startx+"px";
                eraObj.style.top=starty+"px";
                eraObj.style.width=that.erasize;
                eraObj.style.height=that.erasize;
                eraObj.style.background="#ccc";
                that.copy.onmousemove=function(e){
                    var e=e||window.event;
                    var lefts=e.offsetX-(eraObj.offsetWidth/2);
                    var tops=e.offsetY-(eraObj.offsetHeight/2);
                    var maxx=that.width-eraObj.offsetWidth;
                    var maxy=that.height-eraObj.offsetHeight;

                    if(lefts<=0){lefts=0};
                    if(tops<=0){tops=0};
                    if(lefts>=maxx){lefts=maxx};
                    if(tops>=maxy){tops=maxy};
                    eraObj.style.left=lefts+"px";
                    eraObj.style.top=tops+"px";
                    // console.log(lefts,tops,that.erasize,that.erasize)
                    that.cobj.clearRect(lefts,tops,that.erasize,that.erasize);
                }

                that.copy.onmouseup=function(){
                    // alert(1);
                    eraObj.style.background="none";
                    that.copy.onmouseup=null;
                    that.copy.onmousemove=null;
                    that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                    that.eraser(eraObj);
                }
            }
        }
    },
    drag:function(dragObj){
        var that=this;
        that.copy.onmousedown=function(e){
            var e=e||window.event;
            dragObj.sx=e.offsetX;
            dragObj.sy=e.offsetY;
            that.copy.onmousemove=function(e){
                var  e=e||window.event;
                var mx=e.offsetX;
                var my=e.offsetY;
                dragObj.w=Math.abs(mx-dragObj.sx);
                dragObj.h=Math.abs(my-dragObj.sy);
                dragObj.style.cssText="width:"+dragObj.w+"px;height:"+dragObj.h+"px;left:"+dragObj.sx+"px;top:"+dragObj.sy+"px;"
            }
            that.copy.onmouseup=function(){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.temp=that.cobj.getImageData(dragObj.sx,dragObj.sy,dragObj.w,dragObj.h);
                that.cobj.clearRect(dragObj.sx,dragObj.sy,dragObj.w,dragObj.h);
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.cobj.putImageData(that.temp,dragObj.sx,dragObj.sy);
                that.move(dragObj);
            }
        }
    },
    move:function(dragObj){
        var that=this;
        that.copy.onmousedown=function(){
            var  e=e||window.event;
            var sx=Math.abs(e.offsetX-dragObj.sx);
            var sy=Math.abs(e.offsetY-dragObj.sy);
            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0, 0, that.width, that.height);
                if (that.history.length > 0) {
                    that.cobj.putImageData(that.history[that.history.length - 1], 0, 0);
                }
                var  e=e||window.event;
                var mx=e.offsetX;
                var my=e.offsetY;
                var x=Math.abs(mx-sx);
                var y=Math.abs(my-sy);
                dragObj.style.cssText="width:"+dragObj.w+"px;height:"+dragObj.h+"px;left:"+x+"px;top:"+y+"px;";
                that.cobj.putImageData(that.temp, x, y);
            }
            that.copy.onmouseup=function(){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                dragObj.style.width=0;
                dragObj.style.height=0;
                that.drag(dragObj);

            }
        }
    },
    fx:function(dataobj,x,y){
        for(var i=0;i<dataobj.width*dataobj.height;i++){
            dataobj.data[i*4+0]=255-dataobj.data[i*4+0];
            dataobj.data[i*4+1]=255-dataobj.data[i*4+1];
            dataobj.data[i*4+2]=255-dataobj.data[i*4+2];
            dataobj.data[i*4+3]=255;
        }
        this.cobj.putImageData(dataobj,x,y);
    },
    msk:function(dataobj,num,x,y){
        /*马赛克 栅格化*/
        var w=dataobj.width/num;
        var h=dataobj.height/num;
        for(var i=0;i<num;i++){
            for(var j=0;j<num;j++){
                var imgdata=this.cobj.getImageData(j*w,i*h,w,h);
                var r=0,g=0,b=0;
                for(var k=0;k<w*h;k++) {
                    r+=imgdata.data[k*4+0];
                    g+=imgdata.data[k*4+1];
                    b+=imgdata.data[k*4+2];
                }
                r=parseInt(r/(w*h));
                g=parseInt(g/(w*h));
                b=parseInt(b/(w*h));

                for(var k=0;k<w*h;k++){
                    imgdata.data[k*4+0]=r;
                    imgdata.data[k*4+1]=g;
                    imgdata.data[k*4+2]=b;
                }
                this.cobj.putImageData(imgdata,x+w*j,y+h*i);
            }
        }
    },
    blur:function(dataobj,num,x,y) {
        /*高斯模糊*/
        var width = dataobj.width, height = dataobj.height;
        var arr=[];
        var num = num;
        for (var i = 0; i < height; i++) {//行
            for (var j = 0; j < width; j++) {//列  x
                var x1=j+num>width?j-num:j;
                var y1=i+num>height?i-num:i;
                var dataObj =this.cobj.getImageData(x1, y1,num, num);
                var r = 0, g = 0, b = 0;
                for (var k = 0; k < dataObj.width * dataObj.height; k++) {
                    r += dataObj.data[k * 4 + 0];
                    g += dataObj.data[k * 4 + 1];
                    b += dataObj.data[k * 4 + 2];
                }
                r = parseInt(r/(dataObj.width*dataObj.height));
                g = parseInt(g/(dataObj.width*dataObj.height));
                b = parseInt(b/(dataObj.width*dataObj.height));
                arr.push(r,g,b,255);
            }
        }
        for(var i=0;i<dataobj.data.length;i++){
            dataobj.data[i]=arr[i]
        }
        this.cobj.putImageData(dataobj,x,y);
    }
}