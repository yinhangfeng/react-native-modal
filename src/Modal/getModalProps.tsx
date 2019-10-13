import { ModalProps } from './Modal';

const propKeys = [
  'visible',
  'disableInitialVisibleAnimation',
  'backdropClosable',
  'backClosable',
  'disableBackHandler',
  'transitionType',
  'transitionProps',
  'backdropStyle',
  'onRequestClose',
  'onWillShow',
  'onShow',
  'onWillDismiss',
  'onDismiss',
  'disablePortal',
  'hideBackdrop',
  'insetTop',
  'insetBottom',
  'controller',
  'contentContainerStyle',
  // 'modalStyle',
  'position',
  'zIndex',
];

/**
 * 从 props 中提取 Modal 可用的
 * 保持与 Modal.propTypes 同步
 */
export default function getModalProps(props: any): ModalProps | undefined {
  if (!props) {
    return undefined;
  }
  const modalProps: any = {};
  for (const key of propKeys) {
    if (key in props) {
      modalProps[key] = props[key];
    } else if (key === 'modalStyle') {
      modalProps.style = props[key];
    }
  }
  return modalProps;
}
