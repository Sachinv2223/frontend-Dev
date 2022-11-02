import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { TaskserviceService } from '../Services/taskservice.service';
import { faCog } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private taskserviceService: TaskserviceService, private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    /* Fetching all the lists from the database and storing them in the lists array. */
    this.fetchAllList();

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

  /* This is used to import the font-awesome icon. */
  faCog = faCog;

  lists: { _id: string, Ltitle: string, __v: number }[] = [];
  tasks: { _id: string, Ttitle: string, _listId: string, __v: number, completed: boolean }[] = [];
  tempListId: any = null;
  tempList: { _id: string; Ltitle: string; __v: number; } = { _id: '', Ltitle: '', __v: 0 };

  getTempListId() {
    return this.tempListId;
  }

  /* Fetching all the lists from the database and storing them in the lists array. */
  private fetchAllList = () => {
    this.taskserviceService.getList().subscribe({
      next: (responseLists: any) => {
        this.lists = [...responseLists];
      }
    });
  }

  private fetchAllTaskFromTempListId = () => {
    this.taskserviceService.getTask(this.tempListId).subscribe({
      next: (responseTasks: any) => {
        this.tasks = [...responseTasks];
      }
    });
  }

  /* This method is used to fetch the listId from the URL and then fetch the tasks of that listId. */
  private fetchingTempListIdAndTaskFromURL = () => {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.tempListId = params.get('listId');
        if (this.tempListId != null) {
          this.fetchAllTaskFromTempListId();
        }
      }
    });
  }

  isListDataCreating: boolean = false;
  isTaskDataCreating: boolean = false;
  isListDataEditing: boolean = false;
  isTaskDataEditing: boolean = false;

  createNewList() {
    this.isListDataCreating = true;
  }

  createNewTask() {
    this.isTaskDataCreating = true;
  }

  editList() {
    this.getTempListValue();
    this.isListDataEditing = true;
  }

  editTask() {
    this.isTaskDataEditing = true;
  }

  // fetchListCreateStatus(status: boolean) {
  //   this.taskserviceService.getList().subscribe({
  //     next: (responseList: any) => {
  //       this.lists = [...responseList];
  //     }
  //   });
  //   this.isListDataCreating = status;
  // }

  // fetchTaskCreateStatus(status: boolean) {
  //   if (this.tempListId != null) {
  //     this.taskserviceService.getTask(this.tempListId).subscribe({
  //       next: (responseTasks: any) => {
  //         this.tasks = [...responseTasks];
  //       }
  //     });
  //   }
  //   this.isTaskDataCreating = status;
  // }

  /**
   * The function takes a listId as a parameter, and then calls the getTask() function from the
   * taskserviceService, which returns an observable. The observable is then subscribed to, and the
   * response is stored in the tasks array
   * @param {string} listId - string - The id of the list that we want to fetch the tasks for.
   */
  fetchAllTasksByListId(listId: string) {
    this.taskserviceService.getTask(listId).subscribe({
      next: (responseTasks: any) => {
        this.tasks = [...responseTasks];
        console.log(this.tasks);
      }
    });
  }

  //we want to set the task to be completed and vice-versa
  /**
   * The function takes in a task object as a parameter, and then calls the completeTask function in
   * the task service, which then calls the completeTask function in the task API, which then calls the
   * completeTask function in the task controller, which then calls the completeTask function in the
   * task model, which then updates the task in the database
   * @param taskParam - { _id: string, Ttitle: string, _listId: string, __v: number, completed: boolean
   * }
   */
  onTaskClick(taskParam: { _id: string, Ttitle: string, _listId: string, __v: number, completed: boolean }) {
    this.taskserviceService.completeTask(taskParam).subscribe({
      next: (_res) => {
        // this.fetchingTempListIdAndTaskFromURL;
        this.fetchAllTaskFromTempListId();
      },
      error: (err) => {
        console.log(err);
        // this.fetchingTempListIdAndTaskFromURL;
        this.fetchAllTaskFromTempListId();
      }
    })
  }

  onLogoutBtnCllick() {
    this.authService.logOut();
  }

  onDeleteListBtnClick() {
    this.taskserviceService.deleteList(this.tempListId).subscribe({
      next: (res) => {
        this.router.navigate(['/lists'])
        console.log(res);
      }
    })
  }


  //*---------- child component methods ---------
  createList = (listInput: string) => {
    this.taskserviceService.createList(listInput).subscribe({
      next: (_res) => {
        this.fetchAllList();
        this.isListDataCreating = false;
      }
    })
  };

  cancelCreateList = () => {
    this.isListDataCreating = false;
  }

  createTask = (taskInput: string) => {
    if (taskInput != '') {
      this.taskserviceService.createTask(taskInput, this.tempListId).subscribe({
        next: (_res: any) => {
          this.taskserviceService.getTask(this.tempListId).subscribe({
            next: (responseTasks: any) => {
              this.tasks = [...responseTasks];
              this.isTaskDataCreating = false;
            }
          });

          //? below method is working, but there is a time lag, since we cant use then() to chain functions to observables.
          // this.fetchAllTaskFromTempListId();
          // this.isTaskDataCreating = false;
        }
      })
    }
  }

  cancelCreateTask = () => {
    this.isTaskDataCreating = false;
  }

  // This for showing the old value in the input box (or as placeholder) before entering edited valu
  getTempListValue = () => {
    this.taskserviceService.getSpecificList(this.tempListId).subscribe({
      next: (specifiListDoc: any) => {
        this.tempList = specifiListDoc;
        // console.log(this.tempList.Ltitle);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  saveEditList = (listInput: string) => {
    this.taskserviceService.updateList(this.tempListId, listInput).subscribe({
      next: (_res) => {
        this.fetchAllList();
        this.isListDataEditing = false;
      }
    })
  }

  cancelEditList = () => {
    this.isListDataEditing = false;
  }

}
