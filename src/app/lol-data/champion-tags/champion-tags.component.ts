import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-champion-tags',
  templateUrl: './champion-tags.component.html',
  styleUrls: ['./champion-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChampionTagsComponent {
  @Input() tags: Array<string> = [];
}
