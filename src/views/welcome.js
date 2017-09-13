export class Welcome {

  title = 'Meetup at Ellevation Education';

  constructor() {    
    this.people = [
      { fname: 'Tom', lname: 'Smith' },
      { fname: 'Mark', lname: 'Doe' }
    ];
  }

  toggleEditElement() {
    this.showEditTitleElement = !this.showEditTitleElement;
  }
}
