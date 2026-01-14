import LoginForm from 'components/auth/LoginForm';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('auth.loginTitle')}</h1>
      <LoginForm />
    </div>
  );
}
