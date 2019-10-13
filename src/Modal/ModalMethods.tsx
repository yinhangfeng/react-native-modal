import React from 'react';
import Portal from '../Portal';
import StatefulModal, { StatefulModalProps } from './StatefulModal';
import ModalController from './ModalController';

export interface ModalOpenOptions extends StatefulModalProps {
  component: React.ComponentType | React.ReactElement;
}

/**
 * 在非 render 上下文中打开 Modal
 * 一般建议使用 <Modal /> 组件
 */
export function open({
  component,
  controller,
  onDismiss,
  zIndex,
  ...modalProps
}: ModalOpenOptions) {
  if (!controller) {
    controller = new ModalController();
  }

  if (!React.isValidElement(component)) {
    if (__DEV__ && typeof component !== 'function') {
      throw new Error('component 必须是 ReactComponent 或 ReactElement');
    }
    component = React.createElement(component);
  }

  const modal = (
    <StatefulModal
      {...modalProps}
      controller={controller}
      onDismiss={() => {
        onDismiss && onDismiss();
        Portal.manager.unmount(controller._key);
      }}
      openOnMount
      disablePortal
    >
      {component}
    </StatefulModal>
  );

  const key = Portal.manager.mount(modal, zIndex);
  controller._key = key;

  return controller;
}

export function close(controller: ModalController) {
  return controller.close();
}
