import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../../node_modules/primeng/resources/themes/bootstrap4-dark-purple/theme.css', './app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'webapp';

}
