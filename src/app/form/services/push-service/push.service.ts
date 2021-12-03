import {EventEmitter, Injectable, Output} from '@angular/core';
import {Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class PushService {
  webSocket: WebSocket;

  public roleChanged$ = new Subject<number>();

  public changeRole(changed: number) {
    this.roleChanged$.next(changed);
  }

  constructor() {

    this.webSocket = new WebSocket("ws://localhost:8080/backend-1.0-SNAPSHOT/connect");
    this.webSocket.onmessage = ((message) => {
        let newRole: number;
        switch (message.data.substr(22)){
          case "Модератор":
            newRole = 2;
            break;
          case "Администратор":
            newRole = 3;
            break;
          default:
            newRole = 1;
            break;
        }
        this.changeRole(newRole);
        new Notification('Уведомление от лучшего в мире сайта', {body: message.data})
      }
    );
  }

  sendWebSocket(username: string) {
    this.webSocket.send(username)
  }

  disconnect() {
    this.webSocket.close();
  }

}
