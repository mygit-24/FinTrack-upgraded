import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation(); 

  if (loading) return <p>{t("common.loading")}</p>;
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />; // 🔑 צריך Outlet כדי להציג את ה־children
};

export default PrivateRoute;
