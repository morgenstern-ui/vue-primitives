import type { DialogContentImplEmits } from '../dialog/DialogContentImpl.ts'
import { type MutableRefObject, createContext } from '../hooks/index.ts'

// eslint-disable-next-line ts/consistent-type-definitions
export type AlertDialogContentEmits = {
  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented.
   */
  openAutoFocus: DialogContentImplEmits['openAutoFocus']
}

export type AlertDialogContentElement = HTMLDivElement

export type AlertDialogCancelElement = HTMLButtonElement

export interface AlertDialogContentContextValue {
  cancelRef: MutableRefObject<AlertDialogCancelElement | undefined>
}

export const [provideAlertDialogContentContext, useAlertDialogContentContext] = createContext<AlertDialogContentContextValue>('AlertDialogContent')
