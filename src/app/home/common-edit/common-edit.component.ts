import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-edit',
  templateUrl: './common-edit.component.html',
  styleUrls: ['./common-edit.component.scss']
})
export class CommonEditComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  primaryBtnFn!: (input: string) => void;

  @Input()
  secondaryBtnFn!: () => void;

  @Input()
  oldValue!: string;

}
