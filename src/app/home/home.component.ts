import { AfterContentChecked, AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { TaskserviceService } from '../Services/taskservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private taskserviceService: TaskserviceService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {

    this.taskserviceService.getList().subscribe({
      next: (responseLists: any) => {
        this.lists = [...responseLists];
      }
    });
    
    /* This method is used to fetch the listId from the URL and then fetch the tasks of that listId. */
    this.fetchingTempListIdAndTaskFromURL();

    //! this is done because during refresh access token, ngOnint is not fired (or its being executed early before method in httpInterceptor completes). so we need the tempListId to show its task if we refresh page that time.
    this.authService.accessTokenRefreshedSubject.subscribe({
      next: (res) => {
        console.log(res);
        this.fetchingTempListIdAndTaskFromURL();
      }
    })
  }

  lists: { _id: string, Ltitle: string, __v: number }[] = [];
  tasks: { _id: string, Ttitle: string, _listId: string, __v: number, completed: boolean }[] = [];
  tempListId: any = null;

  getTempListId() {
    return this.tempListId;
  }

  /* This method is used to fetch the listId from the URL and then fetch the tasks of that listId. */
  private fetchingTempListIdAndTaskFromURL = () => {
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

  isListDataUpdating: boolean = false;
  isTaskDataUpdating: boolean = false;

  createNewList() {
    this.isListDataUpdating = true;
  }

  createNewTask() {
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

  onTaskClick(taskParam: { _id: string, Ttitle: string, _listId: string, __v: number, completed: boolean }) {
    //we want to set the task to be completed and vice-versa
    this.taskserviceService.completeTask(taskParam).subscribe({
      next: (res) => {
        this.fetchTaskModifyStatus(false);
      },
      error: (err) => {
        console.log(err);
        this.fetchTaskModifyStatus(false);
      }
    })
  }

  onLogoutBtnCllick() {
    this.authService.logOut();
  }

}
