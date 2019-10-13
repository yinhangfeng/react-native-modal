import TransitionExecutor from './TransitionExecutor';

export default class None implements TransitionExecutor {
  private _transition: any;

  constructor(transition: any, isEntered?: boolean) {
    this._transition = transition;
  }

  enter() {
    this._transition._onEntered({ finished: true });
  }

  exit() {
    this._transition._onExited({ finished: true });
  }
}
