import React, { Component } from 'react';
import Modal, { ModalProps } from './Modal';
import ModalController from './ModalController';

export interface StatefulModalProps extends ModalProps {
  openOnMount?: boolean;
}

/**
 * visible 状态由内部 state 管理的 Modal
 *
 * 扩展 props
 * openOnMount // 在 componentDidMount 时 open
 */
export default class StatefulModal extends Component<StatefulModalProps, any> {
  private _controller: ModalController;

  constructor(props: StatefulModalProps) {
    super(props);

    this.state = {
      visible: false,
    };

    this._controller = props.controller || new ModalController();
    this._controller._modal = this;
  }

  componentDidMount() {
    if (this.props.openOnMount) {
      this.open();
    }
  }

  componentWillUnmount() {
    if (this._controller._modal === this) {
      this._controller._modal = null;
    }
  }

  requestClose = (type = 'custom', data?: any) => {
    let result;
    if (this.props.onRequestClose) {
      result = this.props.onRequestClose(type, data);
    }
    if (result !== false) {
      this.setState({
        visible: false,
      });
    }
    return result;
  };

  open() {
    this.setState({
      visible: true,
    });
  }

  close() {
    this.setState({
      visible: false,
    });
  }

  _onRequestClose = (type: any, data?: any) => {
    if (this.requestClose(type, data) !== false) {
      this.setState({
        visible: false,
      });
    }
  };

  render() {
    return (
      <Modal
        {...this.props}
        visible={this.state.visible}
        onRequestClose={this._onRequestClose}
        controller={this._controller}
      />
    );
  }
}
