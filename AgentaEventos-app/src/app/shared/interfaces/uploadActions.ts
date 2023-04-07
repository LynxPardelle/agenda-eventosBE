import { UploadFile } from 'ngx-uploader';

export enum EUploadActions {
  'rejected',
  'allAddedToQueue',
  'addedToQueue',
  'uploading',
  'removed',
  'dragOver',
  'dragOut',
  'drop',
  'done',
  'upload',
  'cancel',
  'cancelAll',
  'remove',
  'removeAll',
  'fileOutsider',
  'filesOutsiders',
}
export type TUploadActions = keyof typeof EUploadActions;

export interface IUploadActions {
  actionType: TUploadActions;
  files?: UploadFile[];
  file?: UploadFile;
  nativeFile?: File;
  nativeFiles?: File[];
  special?: any;
  uploaderId?: string;
}
