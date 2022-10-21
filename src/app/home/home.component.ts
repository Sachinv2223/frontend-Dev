import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskserviceService } from '../Services/taskservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private taskserviceService: TaskserviceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.taskserviceService.getList().subscribe({
      next: (responseLists: any) => {
        this.lists = [...responseLists];
      }
    });

    this.route.paramMap.subscribe({
      next: (params) => {
        this.tempListId = params.get('listId');
        if (this.tempListId != null) {
          this.taskserviceService.getTask(this.tempListId).subscribe({
            next: (responseTasks: any) => {
              this.tasks = [...responseTasks];
            }
          });
        }
      }
    });
  }

  lists: { _id: string, Ltitle: string, __v: number }[] = [];
  tasks: { _id: string, Ttitle: string, _listId: string, __v: number }[] = [];
  tempListId: any = null;

  getTempListId() {
    return this.tempListId;
  }

  isListDataUpdating: boolean = false;
  isTaskDataUpdating: boolean = false;

  createNewList() {
    this.isListDataUpdating = true;
  }

  createNewTask(){
    this.isTaskDataUpdating = true;
  }

  fetchListModifyStatus(status: boolean) {
    this.taskserviceService.getList().subscribe({
      next: (responseList: any) => {
        this.lists = [...responseList];
      }
    });
    this.isListDataUpdating = status;
  }

  fetchTaskModifyStatus(status: boolean) {
    if (this.tempListId != null) {
      this.taskserviceService.getTask(this.tempListId).subscribe({
        next: (responseTasks: any) => {
          this.tasks = [...responseTasks];
        }
      });
    }
    this.isTaskDataUpdating = status;
  }

  fetchAllTasksByListId(listId: string) {
    this.taskserviceService.getTask(listId).subscribe({
      next: (responseTasks: any) => {
        this.tasks = [...responseTasks];
        console.log(this.tasks);
      }
    });
  }

}
