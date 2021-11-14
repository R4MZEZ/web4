import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ValidationService} from "../validator/validation.service";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @Output() resetTable = new EventEmitter();
  @Input() r: number;


  constructor(private validationService: ValidationService) {
  }

  ngOnInit(): void {
    this.drawGraph();
  }

  drawGraph(): void {
    let canvas = document.querySelector("#canvas");
    // @ts-ignore
    let ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = "assets/graph.svg"
    img.width = 300;
    img.height = 300;
    img.addEventListener("load", function () {
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, 300, 300);
    }, false);


  }

  public reset(): void {
    this.resetTable.emit();
    let canvas = document.querySelector("#canvas");
    // @ts-ignore
    const context = canvas!.getContext('2d');
    // @ts-ignore
    context.clearRect(0, 0, canvas!.width, canvas!.height);
    this.drawGraph();
  }


  sendClickedPoint(e) {
    if (!this.validationService.validateR(this.r)) {
      return;
    }

    let x;
    let y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    //@ts-ignore
    x -= document.querySelector("#canvas")!.offsetLeft + 190;
    //@ts-ignore
    y -= document.querySelector("#canvas")!.offsetTop + 202;
    console.log(this.r)
    y = y * this.r * (-1) / 118;
    x = x * this.r / 118;


    console.log(x + ", " + y)
    // const x = event.clientX - rect.left - 43,
    //   y = event.clientY - rect.top - 43;
    // const r = document.getElementById("field-form:inputR").innerHTML;
    // let oldX = document.getElementById("field-form:inputX").value;
    // let oldY = document.getElementById("field-form:inputY").value;
    //
    // document.getElementById("field-form:inputX").value = ((x - 150) * r) / 118.8;
    // document.getElementById("field-form:inputY").value = (y - 150) * r / (-118.8);
    //
    // document.getElementById("field-form:submit-button").click();
    //
    // document.getElementById("field-form:inputX").value = oldX;
    // document.getElementById("field-form:inputY").value = oldY;
    //
    // document.getElementById("field-form:invisible-button").click();
  }

}
