import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PortalManagerState {
  portals: {
    key: number;
    children: React.ReactNode;
    zIndex: number;
  }[];
}

/**
 * Portal host is the component which actually renders all Portals.
 */
export default class PortalManager extends React.PureComponent<any, PortalManagerState> {
  state: PortalManagerState = {
    portals: [],
  };

  mount(key: number, children: React.ReactNode, zIndex: number = 0) {
    const portals = this.state.portals;
    let insertIndex = portals.length - 1;
    for (; insertIndex >= 0; --insertIndex) {
      if (portals[insertIndex].zIndex <= zIndex) {
        break;
      }
    }
    portals.splice(insertIndex + 1, 0, { key, children, zIndex });
    this.forceUpdate();
  }

  update(key: number, children: React.ReactNode, zIndex: number = 0) {
    const portals = this.state.portals;
    for (let i = portals.length - 1; i >= 0; --i) {
      if (portals[i].key === key) {
        portals[i] = { key, children, zIndex };
        break;
      }
    }
    this.forceUpdate();
  }

  unmount(key: number) {
    const portals = this.state.portals;
    for (let i = portals.length - 1; i >= 0; --i) {
      if (portals[i].key === key) {
        portals.splice(i, 1);
        this.forceUpdate();
        break;
      }
    }
  }

  render() {
    return this.state.portals.map(({ key, children }) => (
      <View
        key={key}
        collapsable={
          false /* Need collapsable=false here to clip the elevations, otherwise they appear above sibling components */
        }
        pointerEvents="box-none"
        style={StyleSheet.absoluteFill}
      >
        {children}
      </View>
    ));
  }
}
