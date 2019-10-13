/**
 * 参考 react-native-paper
 * https://github.com/callstack/react-native-paper/blob/master/src/components/Portal/Portal.js
 */

import React from 'react';
import PortalConsumer from './PortalConsumer';
import PortalHost, { PortalContext } from './PortalHost';
import PortalManagerHolder from './PortalManagerHolder';

export interface PortalProps {
  children: React.ReactNode;
  zIndex?: number;
}

/**
 * Portal allows to render a component at a different place in the parent tree.
 * You can use it to render content which should appear above other elements, similar to `Modal`.
 * It requires a [`Portal.Host`](portal-host.html) component to be rendered somewhere in the parent tree.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Portal, Text } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   render() {
 *     const { visible } = this.state;
 *     return (
 *       <Portal>
 *         <Text>This is rendered at a different place</Text>
 *       </Portal>
 *     );
 *   }
 * }
 * ```
 */
export default class Portal extends React.Component<PortalProps, any> {
  // @component ./PortalHost.js
  static Host = PortalHost;

  // 静态的 manager 方便在非 component tree 中使用
  static manager = PortalManagerHolder;

  render() {
    const { children, zIndex } = this.props;

    return (
      <PortalContext.Consumer>
        {manager => (
          <PortalConsumer manager={manager} zIndex={zIndex}>
            {children}
          </PortalConsumer>
        )}
      </PortalContext.Consumer>
    );
  }
}
