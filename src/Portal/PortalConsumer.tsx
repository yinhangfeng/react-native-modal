/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PortalManagerContextType from './PortalManagerContextType';

interface PortalConsumerProps {
  manager: PortalManagerContextType;
  zIndex?: number;
}

export default class PortalConsumer extends React.Component<PortalConsumerProps, any> {
  private _key!: number;

  componentDidMount() {
    if (!this.props.manager) {
      throw new Error(
        __DEV__
          ? 'Looks like you forgot to wrap your root component with `Provider` component from `react-native-paper`.\n\n' +
            "Please read our getting-started guide and make sure you've followed all the required steps.\n\n" +
            'https://callstack.github.io/react-native-paper/getting-started.html'
          : 'no PortalHost'
      );
    }

    this._key = this.props.manager.mount(this.props.children, this.props.zIndex);
  }

  componentDidUpdate() {
    this.props.manager.update(this._key, this.props.children, this.props.zIndex);
  }

  componentWillUnmount() {
    this.props.manager.unmount(this._key);
  }

  render() {
    return null;
  }
}
