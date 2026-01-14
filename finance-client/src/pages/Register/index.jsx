import RegisterForm from 'components/auth/RegisterForm';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('auth.registerTitle')}</h1>
      <RegisterForm />
    </div>
  );
}
