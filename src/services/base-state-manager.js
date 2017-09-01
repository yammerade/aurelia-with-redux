import { inject } from 'aurelia-framework';
import { createStore } from 'redux';
import { changeable } from 'services/changeable-reducer';

export class BaseStateManager {
	data = {};
	component = 'BASE';
	suppressRefresh = false;
	suppressUpdate = false;
	restoreIndex = 0;
	dirty = false;
	undoable = false;
	redoable = false;

	constructor() {
		this.store = createStore(changeable(this.reducer));
		this.store.subscribe(this.update.bind(this));

		this.actionType = 'INIT';
	}

	//
	// Functions intended to work as is
	//
	init( data, onUpdate ) {
		this.suppressUpdate = true;

		this.data = data;
		this.onUpdate = onUpdate;

		this.updateHandler(data);

		this.setRestorePoint();

		this.suppressUpdate = false;
	}

	update() {
		this.suppressRefresh = true; //observables

		const state = this.store.getState().present;
		this.reassign(state);

		if (!!this.onUpdate && !this.suppressUpdate) {
			this.onUpdate(this.component, state.args);
		}

		//enable observable refresh again on the filter
		setTimeout(() => {
			this.suppressRefresh = false;

			this.checkDirty();
			this.checkUndoable();
			this.checkRedoable();
		},
			50);
	}

	checkUndoable() {
		this.undoable = this.store.getState().past.length > this.restoreIndex;
	}

	checkRedoable() {
		this.redoable = this.store.getState().future.length > 0;
	}

	checkDirty() {
		const current = this.store.getState().present;
		const baseline = this.store.getState().past[this.restoreIndex];

		if (!baseline || !current || !baseline.data || !current.data) {
			this.dirty = false;
		} else {
			this.dirty = !this.isSame(current, baseline);
		}
	}

	undo() {
		this.actionType = 'UNDO';
		this.store.dispatch({
			type: 'UNDO'
		});
	}

	redo() {
		this.actionType = 'REDO';
		this.store.dispatch({
			type: 'REDO'
		});
	}

	discard() {
		this.actionType = 'DISCARD';
		this.store.dispatch({
			type: 'DISCARD',
			restoreIndex: this.restoreIndex
		});
	}

	reset() {
		this.actionType = 'RESET';
		this.store.dispatch({
			type: 'RESET',
			restoreIndex: this.initialState
		});
	}

	setInitialState() {
		this.initialState = this.store.getState().past.length;
		this.setRestorePoint();
	}

	setRestorePoint() {
		this.restoreIndex = this.store.getState().past.length;
		this.dirty = false;
	}

	updateHandler(data) {
		if (!this.suppressRefresh) {
			const event = {
				type: 'UPDATE',
				data: data
			};
			this.store.dispatch(event);
		}
	}

	//
	// Functions that typically need to be overwritten from specific class
	//
	reassign(state) {
		this.data = state.data;
	}

	reducer(state = {}, action) {
		switch (action.type) {
			case 'UPDATE':
				return {
					data: action.data
				};
			default:
				return {
					data: state.data
				};
		}
	}

	isSame(current, baseline) {
		return current === baseline;
	}
}
