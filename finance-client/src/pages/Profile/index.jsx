import { useEffect, useState } from 'react';
import { useAuth } from 'context/AuthContext';
import { updateUser } from 'api/authApi';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, setUser } = useAuth(); // השתמש ב-setUser במקום refreshUser
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      }));
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert(t('profile.passwordMismatch'));
      return;
    }

    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    if (formData.oldPassword && formData.newPassword) {
      updateData.oldPassword = formData.oldPassword;
      updateData.password = formData.newPassword; // או newPassword לפי backend
    }

    try {
      const res = await updateUser(updateData);
      setUser(res.data); // ✅ עדכון המשתמש ב־context
      alert(t('profile.updateSuccess'));
      setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      console.error("שגיאה בעדכון המשתמש:", err);
      alert(err.response?.data?.message || "שגיאה בעדכון פרטי המשתמש");
    }
  };

  if (loading) return <p>{t('profile.loading')}</p>;

  return (
    <div>
      <h2>{t('profile.greeting', {
          firstName: formData.firstName,
          lastName: formData.lastName,
        })}
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t('profile.firstNameLabel')}</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div>
          <label>{t('profile.lastNameLabel')}</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div>
          <label>{t('profile.emailLabel')}</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <h3>{t('profile.changePasswordTitle')}</h3>
        <div>
          <label>{t('profile.oldPasswordLabel')}</label>
          <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
        </div>
        <div>
          <label>{t('profile.newPasswordLabel')}</label>
          <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
        </div>
        <div>
          <label>{t('profile.confirmPasswordLabel')}</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </div>

        <button type="submit">{t('profile.submitButton')}</button>
      </form>
    </div>
  );
};

export default Profile;
