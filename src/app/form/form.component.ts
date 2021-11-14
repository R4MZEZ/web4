import {Component, OnInit} from '@angular/core';
import {FormServiceService} from "./form-service.service";


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

  constructor(private service: FormServiceService) {
  }

  send() {
    let valid = true;

    if (!this.validateX()) {
      document.getElementById("labelX")!.style.color = "#c42929";
      valid = false;
    } else
      document.getElementById("labelX")!.style.color = "#8C9EAE";

    if (!this.validateY()) {
      document.getElementById("labelY")!.style.color = "#c42929";
      valid = false;
    } else
      document.getElementById("labelY")!.style.color = "#8C9EAE";

    if (!this.validateR()) {
      document.getElementById("labelR")!.style.color = "#c42929";
      valid = false;
    } else
      document.getElementById("labelR")!.style.color = "#8C9EAE";

    if (!valid) return;

    let answer;
    answer = this.service.sendCoordinates(this.selectedX, this.selectedY, this.selectedR);

    answer.then((result) =>{
      this.addPoint(result)
    })

  }

  validateX(): boolean {
    return this.selectedX != undefined &&
      this.selectedX <= 2.5 &&
      this.selectedX >= -2.5
  }

  validateY(): boolean {
    return this.selectedY != undefined &&
      this.selectedY <= 5 &&
      this.selectedY >= -5
  }

  validateR(): boolean {
    return this.selectedR != undefined &&
      this.selectedR <= 2.5 &&
      this.selectedR >= 0
  }

  addPoint(point){
    this.points.push(point);
  }

}
