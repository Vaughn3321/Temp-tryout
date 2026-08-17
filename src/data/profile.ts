export interface RecoveryProfile {
  sobrietyDate?: string // YYYY-MM-DD
  streaksEnabled: boolean
}

export const defaultRecoveryProfile: RecoveryProfile = {
  sobrietyDate: undefined,
  streaksEnabled: true,
}
