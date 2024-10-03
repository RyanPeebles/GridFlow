import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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

    
    canvas: ElementRef<HTMLCanvasElement>;

    context: CanvasRenderingContext2D;

    ngAfterViewInit(): void {
        this.context = this.canvas.nativeElement.getContext('2d');
      }
    
}