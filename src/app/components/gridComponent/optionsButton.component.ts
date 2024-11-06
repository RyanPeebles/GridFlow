import { Call, core, } from '@angular/compiler';
import {Component, ViewChild, ElementRef, AfterViewInit, output, viewChild, ViewChildren, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { RouterOutlet } from '@angular/router';


@Component({
    selector: 'options-Button',
    templateUrl: '/src/app/components/gridComponent/optionsButton.component.html',
    styleUrl: '/src/app/components/gridComponent/optionsButton.component.css',
    standalone: true,
})

export class optionsButton implements AfterViewInit{
    constructor(){

    }
    dropdwn: HTMLElement
    @HostListener('click',['$event']) onClick(event:MouseEvent){
        this.dropdwn.classList.toggle("showMenu");

       
    }
    
    ngAfterViewInit(): void {
        this.dropdwn = document.getElementById('dropdownList');
    }
    
}