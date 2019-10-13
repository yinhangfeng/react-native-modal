import Modal from './Modal';
import { open, close } from './ModalMethods';
import StatefulModal from './StatefulModal';
import getModalProps from './getModalProps';
import ModalController from './ModalController';

const ModalExport: typeof Modal & {
  open: typeof open;
  close: typeof close;
  Stateful: typeof StatefulModal;
  getModalProps: typeof getModalProps;
  ModalController: typeof ModalController;
} = Modal as any;

ModalExport.open = open;
ModalExport.close = close;
ModalExport.Stateful = StatefulModal;
ModalExport.getModalProps = getModalProps;
ModalExport.ModalController = ModalController;

export default ModalExport;
