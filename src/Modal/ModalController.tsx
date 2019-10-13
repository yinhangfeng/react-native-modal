/**
 * Modal 控制器
 * Modal.open 的返回值
 * 会以 modalController props 传递给 Modal 的 children
 *
 * 属性
 * _modal
 * _key portal key 是否 Modal.open 打开才有
 */
export default class ModalController {
  _modal: any;
  _key?: number;

  close = () => {
    if (this._modal) {
      if (this._modal.close) {
        this._modal.close();
      } else if (__DEV__) {
        console.warn('ModalController close 必须是 StatefulModal 才能调用');
      }
    } else if (this._modal === undefined) {
      // open 之后同步调用了 close
      // TODO 使用 PortalManager unmount
      this._modal = null;
      setImmediate(this.close);
    } else if (__DEV__) {
      console.warn('ModalController close Modal 已销毁!');
    }
  };

  requestClose = (type?: any, data?: any) => {
    if (this._modal) {
      this._modal.requestClose(type, data);
    } else if (this._modal === undefined) {
      // open 之后同步调用了 requestClose
      this._modal = null;
      setImmediate(this.requestClose);
    } else if (__DEV__) {
      console.warn('ModalController requestClose Modal 已销毁!');
    }
  };
}
