import React from 'react';
import PortalManagerContextType from './PortalManagerContextType';

export default {
  __oldManager: null as (PortalManagerContextType | null),
  manager: null as (PortalManagerContextType | null),

  mount(element: React.ReactNode, zIndex?: number) {
    if (!this.manager) {
      if (__DEV__) {
        console.warn('Portal.manager.mount !manager');
      }
      return;
    }
    return this.manager.mount(element, zIndex);
  },

  update(key: number, element: React.ReactNode, zIndex?: number) {
    if (!this.manager) {
      if (__DEV__) {
        console.warn('Portal.manager.update !manager');
      }
      return;
    }
    return this.manager.update(key, element, zIndex);
  },

  unmount(key: number) {
    if (!this.manager) {
      if (__DEV__) {
        console.warn('Portal.manager.unmount !manager');
      }
      return;
    }
    return this.manager.unmount(key);
  },
};
