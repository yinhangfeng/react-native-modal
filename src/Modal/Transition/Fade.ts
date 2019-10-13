import { Animated, Easing } from 'react-native';
import TransitionExecutor from './TransitionExecutor';

const EASING_ENTER = Easing.out(Easing.poly(5));
const EASING_EXIT = Easing.in(Easing.linear);

export default class Fade implements TransitionExecutor {
  private _transition: any;
  private _animatedValue: Animated.Value;
  animatedStyle: any;

  constructor(transition: any, isEntered?: boolean) {
    this._transition = transition;

    const animatedValue = new Animated.Value(isEntered ? 1 : 0);
    this._animatedValue = animatedValue;
    this.animatedStyle = {
      opacity: animatedValue,
    };
  }

  enter(duration: number) {
    Animated.timing(this._animatedValue, {
      toValue: 1,
      duration,
      easing: EASING_ENTER,
      useNativeDriver: true,
    }).start(this._transition._onEntered);
  }

  exit(duration: number) {
    Animated.timing(this._animatedValue, {
      toValue: 0,
      duration,
      easing: EASING_EXIT,
      useNativeDriver: true,
    }).start(this._transition._onExited);
  }
}
