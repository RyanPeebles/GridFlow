import { Component, ViewChild, ElementRef, AfterViewInit, output, viewChild, ViewChildren, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';


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
        
    }

    
    
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    origin: coordinate;
    mousePos: coordinate;
    offeset: number;
    initCellCount: number;
    virtualOrigin: coordinate;
    

    

    @HostListener('wheel',['$event']) onScroll(event: WheelEvent){
      

        this.mousePos.x = event.clientX;
        this.mousePos.y= event.clientY;
        if(event.deltaY <0){
            //zoom in
            
            this.virtualOrigin.x = (this.origin.x - this.mousePos.x)/10;
            this.virtualOrigin.y = (this.origin.y - this.mousePos.y)/10;
            console.log(this.origin);
            this.origin.x = this.origin.x + this.virtualOrigin.x;
            this.origin.y = this.origin.y + this.virtualOrigin.y;
            console.log(this.origin);
          

        }else if(event.deltaY >0){
            this.virtualOrigin = new coordinate(this.canvas.width/2,this.canvas.height/2);
            this.virtualOrigin.x = (this.virtualOrigin.x - this.origin.x)/10;
            this.virtualOrigin.y = (this.virtualOrigin.y - this.origin.y)/10;

            this.origin.x = this.origin.x + this.virtualOrigin.x;
            this.origin.y = this.origin.y + this.virtualOrigin.y;
            //zoom out
        }
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        
        //this.createCoords();
        this.drawAxis();
    }
    
    ngAfterViewInit(): void {
        this.canvas =this.myCanvas.nativeElement;
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.origin = new coordinate(this.canvas.width/2,this.canvas.height/2);
        this.virtualOrigin = new coordinate(this.canvas.width/2,this.canvas.height/2);
        this.offeset = this.origin.x/this.initCellCount;
        
       // this.offeset = 50;
        this.createCoords();
        this.drawAxis();
        
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
    createCoords(){
        this.context.lineWidth = 1;

        this.context.beginPath();
        this.context.strokeStyle = 'white';
        for(let x = (this.origin.x)+this.offeset; x < this.canvas.width; x = x +this.offeset){
            this.context.moveTo(x,0);
            this.context.lineTo(x,this.canvas.height);
        }
        for(let x = (this.origin.x ) -this.offeset; x >= 0; x = x -this.offeset){
            this.context.moveTo(x,0);
            this.context.lineTo(x,this.canvas.height);
        }
        for(let y = (this.origin.y ) + this.offeset; y < this.canvas.height; y = y +this.offeset){
            this.context.moveTo(0,y);
            this.context.lineTo(this.canvas.width,y);
        }
        for(let y = (this.origin.y)- this.offeset; y >= 0; y = y -this.offeset){
            this.context.moveTo(0,y);
            this.context.lineTo(this.canvas.width,y);
        }
        this.context.stroke();
    }
}

 class coordinate{
    constructor(x:number,y:number){
        this.x = x;
        this.y = y;
        this.name = '(${x},${y})';
    }
    name: string;
    x: number;
    y: number;
}
