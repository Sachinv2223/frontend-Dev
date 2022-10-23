import { Injectable } from '@angular/core';
import { WebrequestService } from './webrequest.service';

@Injectable({
  providedIn: 'root'
})
export class TaskserviceService {

  constructor(private webReqService: WebrequestService) { }

  //*--------List methods--------
  createList(Ltitle: string) {
    return this.webReqService.post('lists', { Ltitle: Ltitle });
  }

  getList() {
    return this.webReqService.get('lists');
  }


  //*--------Task methods--------
  createTask(Ttitle: string, listId: string) {
    return this.webReqService.post(`lists/${listId}/task`, { Ttitle: Ttitle, _listId: listId });
  }

  getTask(listId: string) {
    return this.webReqService.get(`lists/${listId}/task`);
  }

  completeTask(taskParam: { _id: string, Ttitle: string, _listId: string, __v: number, completed: boolean }) {
    if (!taskParam.completed) {
      return this.webReqService.patch(`lists/${taskParam._listId}/task/${taskParam._id}`, {
        completed: true
      })
    } else {
      return this.webReqService.patch(`lists/${taskParam._listId}/task/${taskParam._id}`, {
        completed: false
      })
    }
  }
}
