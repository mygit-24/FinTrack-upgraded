import Cookies from 'js-cookie';

export const saveToken = (token) => {
  Cookies.set('token', token, { expires: 1 }); // יום אחד
};

export const getToken = () => {
  return Cookies.get('token');
};

export const clearToken = () => {
  Cookies.remove('token');
};
