import React from "react";
import "./GoalProgressBar.scss"

export default function GoalProgressBar({ progress }) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      <span className="progress-bar-text">{progress}%</span>
    </div>
  );
}
