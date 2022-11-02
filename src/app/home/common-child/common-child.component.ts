import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-child',
  templateUrl: './common-child.component.html',
  styleUrls: ['./common-child.component.scss']
})
export class CommonChildComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  primaryBtnFn!: (input: string) => void;

  @Input()
  secondaryBtnFn!: () => void;

}
