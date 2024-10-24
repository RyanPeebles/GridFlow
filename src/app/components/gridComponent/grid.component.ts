import { core } from '@angular/compiler';
import { Component, ViewChild, ElementRef, AfterViewInit, output, viewChild, ViewChildren, HostListener } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { elementAt, interval } from 'rxjs';


@Component({
    selector:'app-grid',
    standalone:true,
    templateUrl: '/src/app/components/gridComponent/grid.component.html' ,
    styleUrl: '/src/app/components/gridComponent/grid.component.css',
    imports: [RouterOutlet],
       


})


export class gridComponent implements AfterViewInit {
    @ViewChild('myCanvas', {static: false}) myCanvas: ElementRef
    constructor(){
        
        this.mousePos = new coordinate(0,0);
        this.initCellCount = 20; 
        this.zoomLevel = 8;
        this.zoomSpeed = 8;
        this.scaler = 1;
        this.myInterval = 50;
        
       

       // this.offset = 10;
        
    }

    
    
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    origin: coordinate;
    mousePos: coordinate;
    offset: number;
    initCellCount: number;
    virtualOrigin: coordinate;

    zoomLevel: number;
    scaler: number;
    zoomSpeed: number;

    xAxisPOS: coordinate[];
    yAxisPOS: coordinate[];
 
    xAxisNEG: coordinate[];
    yAxisNEG: coordinate[];

    myInterval: number;
    interval: any;

  


    @HostListener('mousemove',['$event']) onMousemove(event: MouseEvent){
        this.mousePos.x = event.clientX;
        this.mousePos.y = event.clientY;
       this.updateScene();
        


    }
    @HostListener('mouseup',['$event']) onMouseup(event: MouseEvent){
        
       
        clearInterval(this.interval);

    }
    @HostListener('mousedown',['$event']) onMousedown(event: MouseEvent){
      
     
        this.interval = setInterval(this.drag,this.myInterval);
        

        

    }
    @HostListener('wheel',['$event']) onScroll(event: WheelEvent){
      

      
        if(event.deltaY <0){
            //zoom in
            
            if(this.zoomLevel>0){
                this.virtualOrigin.x = (this.origin.x - this.mousePos.x)/this.zoomSpeed;
                this.virtualOrigin.y = (this.origin.y - this.mousePos.y)/this.zoomSpeed;
          
                this.origin.x = this.origin.x + this.virtualOrigin.x;
                this.origin.y = this.origin.y + this.virtualOrigin.y;
           
                this.offset +=this.zoomSpeed;
                this.zoomLevel--;
            }
            

        }else if(event.deltaY >0){
            if(this.zoomLevel<10){
                this.virtualOrigin = new coordinate(this.canvas.width/2,this.canvas.height/2);
                this.virtualOrigin.x = (this.virtualOrigin.x - this.origin.x)/this.zoomSpeed;
                this.virtualOrigin.y = (this.virtualOrigin.y - this.origin.y)/this.zoomSpeed;

                this.origin.x = this.origin.x + this.virtualOrigin.x;
                this.origin.y = this.origin.y + this.virtualOrigin.y;

                this.offset -=this.zoomSpeed;
                
                this.zoomLevel++;
            }
            //zoom out
        }
        if(this.zoomLevel<0){
            this.zoomLevel = 0;

        }
        else if(this.zoomLevel > 10){
            this.zoomLevel =10;
        } 
        this.updateAxis();
        this.updateScene();
    }
    
    ngAfterViewInit(): void {
        this.canvas =this.myCanvas.nativeElement;
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.origin = new coordinate(this.canvas.width/2,this.canvas.height/2);
        this.virtualOrigin = new coordinate(this.canvas.width/2,this.canvas.height/2);
        this.offset = 64;
        this.xAxisPOS=[];
        this.yAxisPOS=[];
        this.xAxisNEG=[];
        this.yAxisNEG=[];
       // this.offset = 50;
       // this.createCoords();
        this.initAxis();
        this.drawXY();
        this.drawAxis();
        
      }
    
    drag(){
        console.log("drag");
    }
    updateScene(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.drawPos();
        this.drawXY();
         this.drawAxis();
    }
    drawPos(){
        this.context.strokeStyle = "white";
        this.context.font = '30px serif';
        let localMouseX = Math.round((this.mousePos.x - this.origin.x)/this.offset);
        let localMouseY = Math.round(-(this.mousePos.y - this.origin.y)/this.offset);
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.context.strokeText(`(${localMouseX},${localMouseY})`,20,45);
    }
    drawXY(){
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 1;
            this.xAxisPOS.forEach(element => {
                this.context.stroke(element.path);
                
            });
            this.yAxisPOS.forEach(element =>{
                this.context.stroke(element.path);
            });
            this.xAxisNEG.forEach(element => {
                this.context.stroke(element.path);
                
            });
            this.yAxisNEG.forEach(element =>{
                this.context.stroke(element.path);
            });
      }
    
    drawAxis(){
        
        this.context.beginPath();
       
        this.context.moveTo(this.origin.x,0);
        this.context.lineTo(this.origin.x,this.canvas.height);
        this.context.moveTo(0,this.origin.y);
        this.context.lineTo(this.canvas.width,this.origin.y);
        this.context.lineWidth = 3;
        this.context.strokeStyle= 'red';
        this.context.stroke();
        this.context.closePath();
       

        

    }

    initAxis(){
        for(let x = this.origin.x+this.offset; x < this.canvas.width; x = x +this.offset){
            let p = new Path2D();
            p.moveTo(x,0);
            p.lineTo(x,this.canvas.height);
            p.closePath();
            let c = new coordinate(x,0,(x-this.origin.x)/this.offset,0,p);
            this.xAxisPOS.push(c);
        }
        for(let x = this.origin.x  -this.offset; x >= 0; x = x -this.offset){
            let p = new Path2D();
            p.moveTo(x,0);
            p.lineTo(x,this.canvas.height);
            p.closePath();

            let c = new coordinate(x,0,((x-this.origin.x)/this.offset),0,p);
            this.xAxisNEG.push(c)
        }

        for(let y = this.origin.y  -this.offset; y >= 0; y = y -this.offset){
            let p = new Path2D();
            p.moveTo(0,y);
            p.lineTo(this.canvas.width,y);
            p.closePath();

            let c = new coordinate(0,y,0,(y-this.origin.y)/this.offset,p);
            this.yAxisPOS.push(c)
        }

        for(let y = this.origin.y  -this.offset; y < this.canvas.height; y = y + this.offset){
            let p = new Path2D();
            p.moveTo(0,y);
            p.lineTo(this.canvas.width,y);
            p.closePath();

            let c = new coordinate(0,y,0,(y-this.origin.y)/this.offset,p);
            this.yAxisNEG.push(c)
        }

    }
    updateAxis(){
        this.context.lineWidth = 1;
 
      
        this.context.strokeStyle = 'white';

        this.xAxisPOS.forEach(coord=>{
            
                let v2x =this.origin.x -coord.x;
                coord.x = coord.x + v2x;
                coord.x += Math.abs(this.offset*coord.local_x);
            
                coord.path = new Path2D();
                coord.path.moveTo(coord.x,0);
                coord.path.lineTo(coord.x,this.canvas.height);
                coord.path.closePath();
        });
        this.xAxisNEG.forEach(coord=>{
           
                let v2x = this.origin.x -coord.x;
                coord.x = coord.x + v2x;
                coord.x -= Math.abs(this.offset*coord.local_x);
                
            
                coord.path = new Path2D();
                coord.path.moveTo(coord.x,0);
                coord.path.lineTo(coord.x,this.canvas.height);
                coord.path.closePath();
        });
        this.yAxisPOS.forEach(coord=>{
            
           
                let v2y = this.origin.y -coord.y;
                coord.y = coord.y + v2y;

                coord.y += Math.abs(this.offset*coord.local_y);
            
                coord.path = new Path2D();
                coord.path.moveTo(0,coord.y);
                coord.path.lineTo(this.canvas.width,coord.y);
                coord.path.closePath();
        });
        this.yAxisNEG.forEach(coord=>{
           

                let v2y = this.origin.y - coord.y;
                coord.y = coord.y + v2y;

                coord.y -= Math.abs(this.offset*coord.local_y);
               
            
          
                coord.path = new Path2D();
                coord.path.moveTo(0,coord.y);
                coord.path.lineTo(this.canvas.width,coord.y);
                coord.path.closePath();
        });


        if(this.xAxisNEG[this.xAxisNEG.length-1].x >= this.offset){
            for(let i = this.xAxisNEG[this.xAxisNEG.length-1].x; i>=0; i= i - this.offset){
            
            let newCoord = new coordinate(i,0,this.xAxisNEG[this.xAxisNEG.length-1].local_x -1,0);
            
            newCoord.path = new Path2D();
            newCoord.path.moveTo(newCoord.x,0);
            newCoord.path.lineTo(newCoord.x,this.canvas.height);
            newCoord.path.closePath();
            this.xAxisNEG.push(newCoord);
            }
            
        }


        if(this.xAxisPOS[this.xAxisPOS.length-1].x < this.canvas.width - this.offset){
            for(let i = this.xAxisPOS[this.xAxisPOS.length-1].x; i<this.canvas.width; i= i + this.offset){
          
            let newCoord = new coordinate(i,0,this.xAxisPOS[this.xAxisPOS.length-1].local_x +1,0);
         
            newCoord.path = new Path2D();
            newCoord.path.moveTo(newCoord.x,0);
            newCoord.path.lineTo(newCoord.x,this.canvas.height);
            newCoord.path.closePath();
            this.xAxisPOS.push(newCoord);
            }
            
        }


        if(this.yAxisPOS[this.yAxisPOS.length-1].y > this.offset){
            for(let i = this.yAxisPOS[this.yAxisPOS.length-1].y; i>=0; i= i - this.offset){
          
            let newCoord = new coordinate(0,i,0,this.yAxisPOS[this.yAxisPOS.length-1].local_y +1);
         
            newCoord.path = new Path2D();
            newCoord.path.moveTo(0,newCoord.y);
            newCoord.path.lineTo(this.canvas.width,newCoord.y);
            newCoord.path.closePath();
            this.yAxisPOS.push(newCoord);
            }
            
        }

        if(this.yAxisPOS[this.yAxisPOS.length-1].y < this.canvas.height - this.offset){
            for(let i = this.yAxisPOS[this.yAxisPOS.length-1].y; i<=this.canvas.height; i= i + this.offset){
          
            let newCoord = new coordinate(0,i,0,this.yAxisPOS[this.yAxisPOS.length-1].local_y -1);
         
            newCoord.path = new Path2D();
            newCoord.path.moveTo(0,newCoord.y);
            newCoord.path.lineTo(this.canvas.width,newCoord.y);
            newCoord.path.closePath();
            this.yAxisPOS.push(newCoord);
            }
            
        }
        //this.drawXY();
    }
}

 class coordinate{
    constructor(x:number,y:number,localX:number=0,localY:number=0, path:Path2D = null){
        this.x = x;
        this.y = y;
        this.local_x = localX;
        this.local_y = localY;
        this.name = `(${this.x},${this.y})`;
        this.path = path;
    }
    name: string;
    path: Path2D;
    x: number;
    y: number;
    readonly local_x: number;
    readonly local_y: number;

   
}
