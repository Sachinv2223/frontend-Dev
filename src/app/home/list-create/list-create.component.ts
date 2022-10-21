import { List } from './../../models/list.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskserviceService } from 'src/app/Services/taskservice.service';

@Component({
  selector: 'app-list-create',
  templateUrl: './list-create.component.html',
  styleUrls: ['./list-create.component.scss']
})
export class ListCreateComponent implements OnInit {

  @Output()
  isListDataModifyEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private taskservice: TaskserviceService) { }

  ngOnInit(): void {
  }

  cancelListModify() {
    this.isListDataModifyEmitter.emit(false);
  }

  createList(listInput: string) {
    this.taskservice.createList(listInput).subscribe({
      next: (_res) => {
        this.isListDataModifyEmitter.emit(false);
      }
    })
  }

}

