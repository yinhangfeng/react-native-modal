import React, { Component } from 'react';
import { StyleSheet, Animated, ViewProps } from 'react-native';
import Fade from './Fade';
import Scale from './Scale';
import Slide from './Slide';
import None from './None';
import TransitionExecutor from './TransitionExecutor';

// XXX 退出动画时间相对于进入动画的比例
const EXIT_TRANSITION_RATIO = 0.65;

export interface TransitionProps extends ViewProps {
  in?: boolean;
  transitionType?: 'none' | 'fade' | 'scale' | 'slide';
  // Direction the child node will enter from. slide 时有效
  direction?: 'left' | 'right' | 'up' | 'down';
  // 动画时间
  duration: number;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  // 是否不显示第一次的动画
  disableInitialTransition?: boolean;
}

/**
 * API 参考 https://github.com/reactjs/react-transition-group
 * TODO
 * 暂时不考虑 transitionType 改变
 * Animated.spring 可以比 timing 有更高的效率?
 * 更好的插值函数 目前参考
 * https://github.com/react-navigation/react-navigation-stack/blob/master/src/views/StackView/StackViewTransitionConfigs.js
 */
export default class Transition extends Component<TransitionProps, any> {
  static getDuration(transitionType: TransitionProps['transitionType']) {
    switch (transitionType) {
      case 'fade':
        return 300;
      case 'scale':
        return 300;
      case 'slide':
        return 350;
      case 'none':
      default:
        return 300;
    }
  }

  // static propTypes = {
  //   in: PropTypes.bool,
  //   transitionType: PropTypes.oneOf(['none', 'fade', 'scale', 'slide']).isRequired,
  //   // Direction the child node will enter from. slide 时有效
  //   direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
  //   // 动画时间
  //   duration: PropTypes.number,
  //   onEnter: PropTypes.func,
  //   onEntered: PropTypes.func,
  //   onExit: PropTypes.func,
  //   onExited: PropTypes.func,
  //   // 是否不显示第一次的动画
  //   disableInitialTransition: PropTypes.bool,
  // };
  // static defaultProps = {};

  private _transitionExecutor!: TransitionExecutor;

  constructor(props: TransitionProps) {
    super(props);

    const { in: isIn, disableInitialTransition } = props;

    const isEntered = isIn && disableInitialTransition;

    this.state = {};

    let transitionExecutor;
    switch (props.transitionType) {
      case 'fade':
        transitionExecutor = new Fade(this, isEntered);
        break;
      case 'scale':
        transitionExecutor = new Scale(this, isEntered);
        break;
      case 'slide':
        transitionExecutor = new Slide(this, isEntered);
        break;
      case 'none':
      default:
        transitionExecutor = new None(this, isEntered);
        break;
    }

    this._transitionExecutor = transitionExecutor;
  }

  componentDidMount() {
    const { in: isIn, disableInitialTransition } = this.props;
    if (isIn && !disableInitialTransition) {
      this._enter();
    }
  }

  componentDidUpdate(prevProps: TransitionProps) {
    if (prevProps.in !== this.props.in) {
      if (this.props.in) {
        this._enter();
      } else {
        this._exit();
      }
    }
  }

  _enter() {
    const { onEnter, duration } = this.props;
    onEnter && onEnter();
    this._transitionExecutor.enter(duration);
  }

  _exit() {
    const { onExit, duration } = this.props;
    onExit && onExit();
    this._transitionExecutor.exit((duration * EXIT_TRANSITION_RATIO) << 0);
  }

  _onEntered = ({ finished }: Animated.EndResult) => {
    if (finished) {
      const { onEntered } = this.props;
      onEntered && onEntered();
    }
  };

  _onExited = ({ finished }: Animated.EndResult) => {
    if (finished) {
      const { onExited } = this.props;
      onExited && onExited();
    }
  };

  render() {
    const { style, transitionType } = this.props;
    return (
      <Animated.View
        needsOffscreenAlphaCompositing={transitionType === 'fade'}
        {...this.props}
        style={StyleSheet.compose(
          this._transitionExecutor.animatedStyle,
          style
        )}
      />
    );
  }
}
