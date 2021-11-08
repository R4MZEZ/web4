import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  template: '<h4 id="header">\n' +
            '  Студент: Казаченко Роман Олегович, Группа: P3230, Вариант: 30307\n' +
            '</h4>\n',
  styleUrls: ['../app.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
