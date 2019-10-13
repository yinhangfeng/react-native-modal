import React, { Context } from 'react';
import { View, StyleSheet } from 'react-native';
import PortalManager from './PortalManager';
import PortalManagerHolder from './PortalManagerHolder';
import PortalManagerContextType from './PortalManagerContextType';

export const PortalContext: Context<PortalManagerContextType> = React.createContext(null as any);

interface Operation {
  type: string;
  key: number;
  children?: React.ReactNode;
  zIndex?: number;
}

/**
 * Portal host renders all of its children `Portal` elements.
 * For example, you can wrap a screen in `Portal.Host` to render items above the screen.
 * If you're using the `Provider` component, it already includes `Portal.Host`.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Text } from 'react-native';
 * import { Portal } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <Portal.Host>
 *         <Text>Content of the app</Text>
 *       </Portal.Host>
 *     );
 *   }
 * }
 * ```
 *
 * Here any `Portal` elements under `<App />` are rendered alongside `<App />` and will appear above `<App />` like a `Modal`.
 */
export default class PortalHost extends React.Component {
  static displayName = 'Portal.Host';

  private _nextKey: number;
  private _queue: Operation[];
  private _manager?: PortalManager;
  private _managerContext: PortalManagerContextType;

  constructor(props: any) {
    super(props);

    this._nextKey = 0;
    this._queue = [];
    // this._manager = null;

    this._managerContext = {
      mount: this._mount,
      update: this._update,
      unmount: this._unmount,
    };

    if (__DEV__ && PortalManagerHolder.manager) {
      PortalManagerHolder.__oldManager = PortalManagerHolder.manager;
    }
    PortalManagerHolder.manager = this._managerContext;
  }

  componentDidMount() {
    const manager = this._manager;
    const queue = this._queue;

    while (queue.length && manager) {
      const action = queue.pop() as Operation;

      // eslint-disable-next-line default-case
      switch (action.type) {
        case 'mount':
          manager.mount(action.key, action.children, action.zIndex);
          break;
        case 'update':
          manager.update(action.key, action.children, action.zIndex);
          break;
        case 'unmount':
          manager.unmount(action.key);
          break;
      }
    }

    if (__DEV__) {
      setTimeout(() => {
        if (PortalManagerHolder.__oldManager) {
          console.warn('存在多个 PortalHost Portal.manager 可能无法工作');
        }
      });
    }
  }

  componentWillUnmount() {
    if (PortalManagerHolder.manager === this._managerContext) {
      PortalManagerHolder.manager = null;
    }
    if (__DEV__) {
      if (PortalManagerHolder.__oldManager === this._managerContext) {
        PortalManagerHolder.__oldManager = null;
      }
    }
  }

  _setManager = (manager: PortalManager) => {
    this._manager = manager;
  };

  _mount = (children: React.ReactNode, zIndex?: number) => {
    const key = this._nextKey++;

    if (this._manager) {
      this._manager.mount(key, children, zIndex);
    } else {
      this._queue.push({ type: 'mount', key, children, zIndex });
    }

    return key;
  };

  _update = (key: number, children: React.ReactNode, zIndex?: number) => {
    if (this._manager) {
      this._manager.update(key, children, zIndex);
    } else {
      const op = { type: 'mount', key, children, zIndex };
      const index = this._queue.findIndex(
        o => o.type === 'mount' || (o.type === 'update' && o.key === key)
      );

      if (index > -1) {
        this._queue[index] = op;
      } else {
        this._queue.push(op);
      }
    }
  };

  _unmount = (key: number) => {
    if (this._manager) {
      this._manager.unmount(key);
    } else {
      this._queue.push({ type: 'unmount', key });
    }
  };

  render() {
    return (
      <PortalContext.Provider value={this._managerContext}>
        {/* Need collapsable=false here to clip the elevations, otherwise they appear above Portal components */}
        <View style={styles.container} collapsable={false}>
          {this.props.children}
        </View>
        <PortalManager ref={this._setManager} />
      </PortalContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
