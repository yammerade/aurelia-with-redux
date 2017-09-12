import { inject, observable } from 'aurelia-framework';


export class Welcome {

  count = 0;//# of times title was modified

  @observable()
  title = 'Meetup at Ellevation Education';

  constructor() {
    this.people = [
      { fname: 'Tom', lname: 'Smith' },
      { fname: 'Mark', lname: 'Doe' }
    ];
  }

  titleChanged() {
    this.count ++;
  }

  toggleEditElement() {
    this.showEditTitleElement = !this.showEditTitleElement;
  }
}
