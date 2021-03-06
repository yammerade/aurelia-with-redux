﻿import { createStore } from 'redux';
import { ActionCreators } from 'redux-undo';
import undoable from 'redux-undo';

export class BaseStateManager {
	data = {};
	component = 'BASE';
	restoreIndex = 0;
	dirty = false;
	undoable = false;
	redoable = false;

	constructor() {
		this.store = createStore(undoable(this.reducer));
		this.store.subscribe(this.update.bind(this));
	}

	//
	// Functions intended to work as is
	//
	init( data, onUpdate ) {
		this.data = data;
		this.onUpdate = onUpdate;

		this.updateHandler(data);
	}

	update() {
		const state = this.store.getState().present;
		this.reassign(state);

		this.onUpdate(this.component, state.args);

		this.checkDirty();
		this.checkUndoable();
		this.checkRedoable();
	}

	checkUndoable() {
		this.undoable = this.store.getState().past.length > 1;
	}

	checkRedoable() {
		this.redoable = this.store.getState().future.length > 0;
	}

	checkDirty() {
		const current = this.store.getState().present;
		const baseline = this.store.getState().past[0];

		if (!baseline || !current || !baseline.data || !current.data) {
			this.dirty = false;
		} else {
			this.dirty = !this.isSame(current, baseline);
		}
	}

	undo() {
		this.store.dispatch(ActionCreators.undo());
	}

	redo() {
		this.store.dispatch(ActionCreators.redo());
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
