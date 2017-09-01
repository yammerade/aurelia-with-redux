import { inject, bindable } from 'aurelia-framework';
import { ListStateManager } from 'services/list-state-manager';

@inject(ListStateManager)
export class Name {
  @bindable firstName;
  @bindable lastName;
  nameList = [];

  constructor(listStateManager) {
    this.listStateManager = listStateManager;
  }

  attached() {
    this.listStateManager.init(this.nameList, () => {});
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  submit() {
    this.nameList.push(this.fullName);

    this.listStateManager.updateHandler(this.nameList);
  }

  undo() {
    this.listStateManager.undo();
  }
  redo() {
    this.listStateManager.redo();
  }
  discard() {
    this.listStateManager.discard();
  }
}