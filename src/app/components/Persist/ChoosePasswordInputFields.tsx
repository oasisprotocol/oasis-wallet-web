import { PasswordField } from 'app/components/PasswordField'
import { useTranslation } from 'react-i18next'

export interface FormValue {
  password1?: string
  /**
   * Undefined if:
   * - persistence is unsupported
   * - or is already persisting (unlocked) or skipped unlocking
   * - or didn't opt to start persisting
   */
  password2?: string
}

export function ChoosePasswordInputFields() {
  const { t } = useTranslation()

  return (
    <>
      <PasswordField<FormValue>
        placeholder={t('persist.loginToProfile.enterPasswordHere', 'Enter your password here')}
        inputElementId="password1"
        name="password1"
        validate={value =>
          value ? undefined : t('persist.loginToProfile.enterPasswordHere', 'Enter your password here')
        }
        required
        showTip={t('persist.loginToProfile.showPassword', 'Show password')}
        hideTip={t('persist.loginToProfile.hidePassword', 'Hide password')}
        width="medium"
      />

      <PasswordField<FormValue>
        placeholder={t('persist.createProfile.repeatPassword', 'Re-enter your password')}
        inputElementId="password2"
        name="password2"
        validate={(value, form) =>
          form.password1 !== form.password2
            ? t('persist.createProfile.passwordMismatch', 'Entered password does not match')
            : undefined
        }
        showTip={t('persist.loginToProfile.showPassword', 'Show password')}
        hideTip={t('persist.loginToProfile.hidePassword', 'Hide password')}
        width="medium"
      />
    </>
  )
}