import { Animated, Easing } from 'react-native';
import TransitionExecutor from './TransitionExecutor';

// TODO 不应该固定
const EXITED_OFFSET = 240;
const EASING_ENTER = Easing.out(Easing.poly(5));
const EASING_EXIT = Easing.in(Easing.linear);

/**
 * TODO 暂时只支持 从底部向上
 */
export default class Slide implements TransitionExecutor {
  private _transition: any;
  private _animatedValue: Animated.Value;
  animatedStyle: any;

  constructor(transition: any, isEntered?: boolean) {
    this._transition = transition;

    const animatedValue = new Animated.Value(isEntered ? 0 : EXITED_OFFSET);
    this._animatedValue = animatedValue;
    this.animatedStyle = {
      transform: [
        {
          translateY: animatedValue,
        },
      ],
    };
  }

  enter(duration: number) {
    Animated.timing(this._animatedValue, {
      toValue: 0,
      duration,
      easing: EASING_ENTER,
      useNativeDriver: true,
    }).start(this._transition._onEntered);
  }

  exit(duration: number) {
    Animated.timing(this._animatedValue, {
      toValue: EXITED_OFFSET,
      duration,
      easing: EASING_EXIT,
      useNativeDriver: true,
    }).start(this._transition._onExited);
  }
}
