import { Animated, Easing } from 'react-native';
import TransitionExecutor from './TransitionExecutor';

const EXITED_SCALE = 0.8;
const EASING_ENTER = Easing.out(Easing.poly(5));
const EASING_EXIT = Easing.in(Easing.linear);

/**
 * TODO
 * http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/dialog_enter.xml
 */
export default class Scale implements TransitionExecutor {
  private _transition: any;
  private _animatedValue: Animated.Value;
  animatedStyle: any;

  constructor(transition: any, isEntered?: boolean) {
    this._transition = transition;

    const animatedValue = new Animated.Value(isEntered ? 1 : EXITED_SCALE);
    this._animatedValue = animatedValue;
    this.animatedStyle = {
      transform: [
        {
          scale: animatedValue,
        },
      ],
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
      toValue: EXITED_SCALE,
      duration,
      easing: EASING_EXIT,
      useNativeDriver: true,
    }).start(this._transition._onExited);
  }
}
