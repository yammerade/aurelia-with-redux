import { transient } from 'aurelia-framework';
import { BaseStateManager } from 'services/base-state-manager';

@transient()
export class ListStateManager extends BaseStateManager {

  reassign(state) {
    while (this.data.length > 0) {
      this.data.pop();
    }
    for (let item of state.data) {
      this.data.push(deepCopy(item));
    }
  }

  reducer(state = {}, action) {
    switch (action.type) {
      case 'UPDATE':
          return {
            data: action.data.map(d => d)
          };
      default:
        return {
          data: state.data
        };
    }
  }

	isSame(current, baseline) {
    if (current.data.length !== baseline.data.length) {
      return false;
    }
    for (let item of baseline.data) {
      if (current.data.find(f => f === item) === undefined) {
        return false
      }
    }
		return true;
	}

}

export function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}
