export type PopupButton = {
  text: string
  style?: 'default' | 'cancel' | 'destructive'
  onPress?: () => void | Promise<void>
}

export type PopupConfig = {
  title: string
  message?: string
  buttons?: PopupButton[]
}

type PopupHandler = (config: PopupConfig) => void

let popupHandler: PopupHandler | null = null

export const setPopupHandler = (handler: PopupHandler | null) => {
  popupHandler = handler
}

export const popup = {
  alert(title: string, message?: string, buttons?: PopupButton[]) {
    popupHandler?.({
      title,
      message,
      buttons,
    })
  },
}
