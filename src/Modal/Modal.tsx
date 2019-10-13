import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
  ViewStyle,
  ViewProps,
} from 'react-native';
import Theme from '../../Theme';
import WindowInsetsView from '../WindowInsetsView';
import Portal from '../Portal';
import ModalController from './ModalController';
import Transition, { TransitionProps } from './Transition';

export interface ModalProps extends ViewProps {
  visible?: boolean;
  // 是否禁止播放一开始就为 visible 的动画
  disableInitialTransition?: boolean;
  // 点击蒙层是否允许关闭
  backdropClosable?: boolean;
  // @android 点击返回按钮是否允许关闭
  backClosable?: boolean;
  // 是否禁止订阅 BackHandler 事件 禁止之后 backClosable 不起作用 (该属性在 modal 显示之后修改无效)
  disableBackHandler?: boolean;
  transitionType?: TransitionProps['transitionType'];
  transitionProps?: TransitionProps;
  backdropStyle?: ViewStyle;
  // (type) => void 点击返回按钮或遮罩时回调 type: 'back' 'backdrop'
  onRequestClose?: (type: any, data: any) => void | boolean;
  onWillShow?: () => void;
  onShow?: () => void;
  onWillDismiss?: () => void;
  onDismiss?: () => void;
  // 是否禁用 Portal
  disablePortal?: boolean;
  // 是否隐藏 backdrop
  hideBackdrop?: boolean;
  insetTop?: boolean;
  insetBottom?: boolean;
  // ModalController
  controller?: ModalController;
  contentContainerStyle?: ViewStyle;
  // 内容位置 对应 contentContainerStyle justifyContent
  position?: 'top' | 'center' | 'bottom';
  // TODO zIndex 与 BackHandler
  zIndex?: number;
}

interface ModalState {
  rendered: boolean;
}

/**
 * The Modal component is a simple way to present content above an enclosing view.
 * TODO
 * 自定义动画
 * Fade 动画放在 Backdrop 上
 * 键盘
 */
export default class Modal extends Component<ModalProps, ModalState> {
  // static propTypes = {
  //   visible: PropTypes.bool,
  //   // 是否禁止播放一开始就为 visible 的动画
  //   disableInitialTransition: PropTypes.bool,
  //   // 点击蒙层是否允许关闭
  //   backdropClosable: PropTypes.bool,
  //   // @android 点击返回按钮是否允许关闭
  //   backClosable: PropTypes.bool,
  //   // 是否禁止订阅 BackHandler 事件 禁止之后 backClosable 不起作用 (该属性在 modal 显示之后修改无效)
  //   disableBackHandler: PropTypes.bool,
  //   transitionType: Transition.propTypes.transitionType,
  //   transitionProps: PropTypes.object,
  //   backdropStyle: PropTypes.any,
  //   // (type) => void 点击返回按钮或遮罩时回调 type: 'back' 'backdrop'
  //   onRequestClose: PropTypes.func,
  //   onWillShow: PropTypes.func,
  //   onShow: PropTypes.func,
  //   onWillDismiss: PropTypes.func,
  //   onDismiss: PropTypes.func,
  //   // 是否禁用 Portal
  //   disablePortal: PropTypes.bool,
  //   // 是否隐藏 backdrop
  //   hideBackdrop: PropTypes.bool,
  //   insetTop: PropTypes.bool,
  //   insetBottom: PropTypes.bool,
  //   // ModalController
  //   // controller: PropTypes.object,
  //   // contentContainerStyle,
  //   // 内容位置 对应 contentContainerStyle justifyContent
  //   position: PropTypes.oneOf(['top', 'center', 'bottom']),
  //   // TODO zIndex 与 BackHandler
  //   zIndex: PropTypes.number,
  // };

  static defaultProps = {
    // visible: false,
    // disableInitialTransition: false,
    // backdropClosable: false,
    backClosable: true,
    insetTop: true,
    insetBottom: true,
    position: 'center',
    transitionType: 'fade',
  };

  static getDerivedStateFromProps(nextProps: ModalProps, prevState: ModalState) {
    if (nextProps.visible && !prevState.rendered) {
      return {
        rendered: true,
      };
    }

    return null;
  }

  private _controller: ModalController;
  private _backSub: any;

  constructor(props: ModalProps) {
    super(props);

    this.state = {
      rendered: !!props.visible,
    };

    this._controller = props.controller || new ModalController();
    if (!this._controller._modal) {
      this._controller._modal = this;
    }
  }

  componentDidMount() {
    if (this.props.visible) {
      this._subBackListener();
    }
  }

  componentDidUpdate(prevProps: ModalProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this._subBackListener();
      } else {
        this._unsubBackListener();
      }
    }
  }

  componentWillUnmount() {
    this._unsubBackListener();
    if (this._controller._modal === this) {
      this._controller._modal = null;
    }
  }

  requestClose(type = 'custom', data?: any) {
    if (this.props.onRequestClose) {
      return this.props.onRequestClose(type, data);
    }
  }

  _handleBack = () => {
    if (this.props.backClosable) {
      this.requestClose('back');
    }
    return true;
  };

  _subBackListener() {
    if (!this.props.disableBackHandler) {
      this._backSub = BackHandler.addEventListener('hardwareBackPress', this._handleBack);
    }
  }

  _unsubBackListener() {
    if (this._backSub) {
      this._backSub.remove();
      this._backSub = null;
    }
  }

  _onBackdropPress = () => {
    if (this.props.backdropClosable) {
      this.requestClose('backdrop');
    }
  };

  _onWillShow = () => {
    this.props.onWillShow && this.props.onWillShow();
  };

  _onShow = () => {
    this.props.onShow && this.props.onShow();
  };

  _onWillDismiss = () => {
    this.props.onWillDismiss && this.props.onWillDismiss();
  };

  _onDismiss = () => {
    this.setState({
      rendered: false,
    });
    this.props.onDismiss && this.props.onDismiss();
  };

  render() {
    if (!this.state.rendered) return null;

    let {
      visible,
      disableInitialTransition,
      disablePortal,
      insetTop,
      insetBottom,
      children,
      backdropStyle,
      hideBackdrop,
      position,
      transitionType,
      transitionProps,
      contentContainerStyle,
      style,
      zIndex,
      ...otherProps
    } = this.props;

    if (React.isValidElement(children)) {
      children = React.cloneElement(children, {
        modalController: this._controller,
      });
    } else if (typeof children === 'function') {
      // FaCC
      children = children({
        visible,
        controller: this._controller,
        modalController: this._controller,
      });
    }

    let contentPositionStyle;
    if (position === 'top') {
      contentPositionStyle = {
        justifyContent: 'flex-start',
      };
    } else if (position === 'bottom') {
      contentPositionStyle = {
        justifyContent: 'flex-end',
      };
    }

    const transitionDuration = Transition.getDuration(transitionType);

    const content = (
      <Transition
        accessibilityViewIsModal
        accessibilityLiveRegion="polite"
        {...otherProps}
        in={visible}
        disableInitialTransition={disableInitialTransition}
        duration={transitionDuration}
        transitionType={transitionType === 'none' ? 'none' : 'fade'}
        onEnter={this._onWillShow}
        onEntered={this._onShow}
        onExit={this._onWillDismiss}
        onExited={this._onDismiss}
        style={StyleSheet.compose(
          styles.container,
          style
        )}
      >
        {!hideBackdrop && (
          <TouchableWithoutFeedback onPress={this._onBackdropPress}>
            <View
              style={StyleSheet.compose(
                styles.backdrop,
                backdropStyle
              )}
            />
          </TouchableWithoutFeedback>
        )}

        <Transition
          {...transitionProps}
          pointerEvents="box-none"
          in={visible}
          disableInitialTransition={disableInitialTransition}
          duration={transitionDuration}
          transitionType={transitionType === 'fade' ? 'none' : transitionType}
          style={StyleSheet.absoluteFill}
        >
          <WindowInsetsView
            insetTop={insetTop}
            insetBottom={insetBottom}
            pointerEvents="box-none"
            style={[styles.contentContainer, contentPositionStyle, contentContainerStyle]}
          >
            {children}
          </WindowInsetsView>
        </Transition>
      </Transition>
    );

    if (disablePortal) {
      return content;
    }

    return <Portal zIndex={zIndex}>{content}</Portal>;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: Theme.current.palette.backdrop,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
