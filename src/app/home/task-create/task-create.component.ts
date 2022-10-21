import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskserviceService } from 'src/app/Services/taskservice.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {

  constructor(private taskservice: TaskserviceService) { }

  ngOnInit(): void {
  }

  @Output()
  isTaskDataModifyEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  tempListId!: string;

  cancelTaskModify() {
    this.isTaskDataModifyEmitter.emit(false);
  }

  createTask(taskInput: string) {
    if (taskInput != '') {
      this.taskservice.createTask(taskInput, this.tempListId).subscribe({
        next: (res: any) => {
          this.isTaskDataModifyEmitter.emit(false);
        }
      })
    }
  }

}
