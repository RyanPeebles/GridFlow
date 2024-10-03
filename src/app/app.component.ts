import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gridComponent } from "./components/gridComponent/grid.component";
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, gridComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FlowGrid-app';
}
