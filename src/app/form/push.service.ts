import {Injectable} from '@angular/core';


import webpush from "web-push";

@Injectable({
  providedIn: 'root'
})
export class PushService {
  webSocket: WebSocket;
  pushSub: PushSubscription;


  constructor() {

    this.pushSub;
    this.webSocket = new WebSocket("ws://localhost:8080/backend-1.0-SNAPSHOT/connect");
    this.webSocket.onmessage = ((message) => this.showNotification(message));
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

  addSub(sub: PushSubscription) {
    this.pushSub = sub;

  }

  sendWebSocket(username: string) {
    this.webSocket.send(username)
  }

  disconnect() {
    this.webSocket.close();
  }

  private showNotification(message: MessageEvent) {
    let notificationPayload = {
      "notification": {
        "title": "Уведомление",
        "body": message.data,
        "vibrate": [100, 50, 100],
      }
    };
    webpush.sendNotification(this.pushSub, JSON.stringify(notificationPayload) )
  }
}
