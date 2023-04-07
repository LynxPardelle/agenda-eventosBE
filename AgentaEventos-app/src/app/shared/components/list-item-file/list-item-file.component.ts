import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'list-item-file',
  templateUrl: './list-item-file.component.html',
  styleUrls: ['./list-item-file.component.scss'],
})
export class ListItemFileComponent implements OnInit {
  @Input() public file: { name: string; id: string; url?: string } = {
    name: '',
    id: '',
    url: '',
  };
  /* Output */
  @Output() clicked = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
}
