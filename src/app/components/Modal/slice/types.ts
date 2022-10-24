export interface Modal {
  title: string
  description: string
  handleConfirm: () => void

  /**
   * Is this a dangerous operation?
   *
   * If marked as such, it will only be possible to execute it if the wallet is configured to run in dangerous mode.
   *
   * It also automatically implies a mandatory waiting time of 10 sec, unless specified otherwise.
   */
  isDangerous: boolean

  /**
   * How long does the user have to wait before he can actually confirm the action?
   */
  mustWaitSecs?: number
}

export interface ModalState {
  current: Modal | null
  stash: Modal[]
}
