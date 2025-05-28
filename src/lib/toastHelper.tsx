import { toast } from 'sonner';
import { ActionResponse, ResponseType } from './types';

export function toastHelper(res: ActionResponse | undefined) {
  if (!res) return;
  if (res.type === ResponseType.ERROR) {
    toast.error(res.message);
  } else if (res.type === ResponseType.SUCCESS) {
    toast.success(res.message);
  } else if (res.type === ResponseType.INFO) {
    toast.info(res.message);
  } else if (res.message) {
    toast.info(res.message);
  }
}
