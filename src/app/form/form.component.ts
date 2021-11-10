import { Component, OnInit } from '@angular/core';
import {FormServiceService} from "./form-service.service";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: []
})
export class FormComponent implements OnInit {
  outputX: number[];
  selectedX: number;
  resultsX: number[] = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];

  selectedY: number = 0;

  outputR: number[];
  selectedR: number;
  resultsR: number[] = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];

  searchX(event) {
    console.log('event', event);
    this.outputX = this.resultsX.filter(c => c.toString().startsWith(event.query));
  }

  searchR(event) {
    console.log('event', event);
    this.outputR = this.resultsR.filter(c => c.toString().startsWith(event.query));
  }


  ngOnInit(): void {

  }

  constructor(private service: FormServiceService) {
  }

  send() {
    console.log("sent");
    this.service.getHello();
  }
}
