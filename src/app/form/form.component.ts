import {Component, OnInit} from '@angular/core';
import {FormServiceService} from "./form-service.service";
import {ValidationService} from "./validator/validation.service";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: []
})
export class FormComponent implements OnInit {
  points: any[] = [];

  outputX: number[];
  selectedX: number;
  resultsX: number[] = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];

  selectedY: number = 0;

  outputR: number[];
  selectedR: number;
  resultsR: number[] = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];

  searchX(event) {
    this.outputX = this.resultsX.filter(c => c.toString().startsWith(event.query));
  }


  searchR(event) {
    this.outputR = this.resultsR.filter(c => c.toString().startsWith(event.query));
  }


  ngOnInit(): void {

  }

  constructor(private sendService: FormServiceService, private validateService: ValidationService) {
  }

  send() {
    let valid = true;

    if (!this.validateService.validateX(this.selectedX)) valid = false;
    if (!this.validateService.validateY(this.selectedY)) valid = false;
    if (!this.validateService.validateR(this.selectedR)) valid = false;

    if (!valid) return;

    let answer;
    answer = this.sendService.sendCoordinates(this.selectedX, this.selectedY, this.selectedR);

    answer.then((result) =>{
      this.addPoint(result)
    })

  }

  addPoint(point){
    this.points.push(point);
  }

  clearTable() {
    this.points = []
  }
}
