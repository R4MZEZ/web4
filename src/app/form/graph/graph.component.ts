import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.drawGraph();
  }

  drawGraph() : void {
    let canvas = document.querySelector("#canvas");
    // @ts-ignore
    let ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = "assets/graph.svg"
    img.width = 300;
    img.height = 300;
    img.addEventListener("load", function() {
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, 300, 300);
    }, false);


  }

  public reset(): void {
    let canvas = document.querySelector("#canvas");
    // @ts-ignore
    const context = canvas.getContext('2d');
    // @ts-ignore
    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log("clicked");
    this.drawGraph();
  }

}
