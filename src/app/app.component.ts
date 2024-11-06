import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gridComponent } from "./components/gridComponent/grid.component";
import { optionsButton } from "./components/gridComponent/optionsButton.component";
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, gridComponent, NavbarComponent, optionsButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FlowGrid-app';

  @HostListener('click',['$event']) onClick(event: MouseEvent){
    console.log('click');
    var elementReal = event.target as HTMLElement;
    if(!elementReal.matches(".dropdownButton")){
      console.log("hit");
        var dropdwns = document.getElementsByClassName("dropdownContent");
        for(var i = 0; i< dropdwns.length; i++){
          if(dropdwns[i].classList.contains("showMenu")){
            dropdwns[i].classList.remove("showMenu");
          }
        }
   }
  }
}
