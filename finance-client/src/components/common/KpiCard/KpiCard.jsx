import { motion } from 'framer-motion';
export function KpiCard({ title, value, caption, icon }) {
  return (
    <motion.div
      className="card kpi"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-main">
        <h4>{title}</h4>
        <div className="kpi-value">{value}</div>
        <div className="kpi-caption">{caption}</div>
      </div>
    </motion.div>
  );
}