import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PushService {
  webSocket: WebSocket;


  constructor() {

    this.webSocket = new WebSocket("ws://localhost:8080/backend-1.0-SNAPSHOT/connect");
    this.webSocket.onmessage = ((message) => new Notification(
      'Уведомление от лучшего в мире сайта', {body: message.data})
    );
    this.webSocket.onopen = function () {
      console.log("connection opened");
    };

    this.webSocket.onclose = function () {
      console.log("connection closed");
    };

    this.webSocket.onerror = function wserror(message) {
      console.log("error: " + message);
    }
  }


  sendWebSocket(username: string) {
    this.webSocket.send(username)
  }

  disconnect() {
    this.webSocket.close();
  }

}
