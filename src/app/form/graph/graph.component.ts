import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ValidationService} from "../validator/validation.service";
import {FormGraphConnectorService} from "../form-graph-connector/form-graph-connector.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @Output() resetTable = new EventEmitter();
  @Input() r: number;
  private subs: Subscription;


  constructor(private validationService: ValidationService,
              private formGraphService: FormGraphConnectorService) {
  }

  ngOnInit(): void {
    this.drawGraph();
    this.subs = this.formGraphService.point$.subscribe((point) => this.drawPoint(point));

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

  getCoords(elem) { // кроме IE8-
    const box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };

  }

  drawPoint(point) {
    const canvas = document.getElementById('canvas');
    // @ts-ignore
    const ctx = canvas.getContext('2d');

    let y = point.y / this.r * (-1) * 118 + 140;
    let x = point.x / this.r * 118 + 140;

    //@ts-ignore
    console.log(this.getCoords(document.querySelector("#canvas")!));


    console.log(x + ', ' + y)


    ctx.beginPath();
    ctx.arc(x, y, 2, 0,2 * Math.PI, false);
    if (point.hit) {
      ctx.fillStyle = '#31c73e';
      ctx.strokeStyle = '#99da90';
    } else {
      ctx.fillStyle = '#9A9898';
      ctx.strokeStyle = '#6b6b6b';
    }
    ctx.fill();
    ctx.lineWidth = 0.4;
    ctx.stroke(); 
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

    this.formGraphService.changeValues(x, y, this.r);
    console.log(x + ", " + y)

  }

}
