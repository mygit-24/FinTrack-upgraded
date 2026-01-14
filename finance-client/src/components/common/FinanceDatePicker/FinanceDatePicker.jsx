import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./FinanceDatePicker.scss";

const FinanceDatePicker = ({ value, onChange, placeholder }) => {
    const today = new Date();
    const { t,i18n } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(value || "");
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const days = getDaysInMonth(currentMonth, currentYear);

    const handleSelectDate = (date) => {
        const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        setSelectedDate(iso);
        onChange(iso);
        setIsOpen(false);
    };


    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const monthNames = [
        t("datePicker.months.0"),
        t("datePicker.months.1"),
        t("datePicker.months.2"),
        t("datePicker.months.3"),
        t("datePicker.months.4"),
        t("datePicker.months.5"),
        t("datePicker.months.6"),
        t("datePicker.months.7"),
        t("datePicker.months.8"),
        t("datePicker.months.9"),
        t("datePicker.months.10"),
        t("datePicker.months.11"),
    ];


    const weekdayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    // ⭐ פורמט תצוגת תאריך לפי שפה
    const formatDisplayDate = (isoString) => {
        if (!isoString) return "";
        const [year, month, day] = isoString.split("-");
        if (i18n.language === "he") {
            return `${day}/${month}/${year}`; // dd/mm/yyyy
        }
        return `${month}/${day}/${year}`; // mm/dd/yyyy למשל באנגלית
    };

    const effectivePlaceholder =
        placeholder || t("datePicker.placeholder"); // ⭐ אם לא הועבר placeholder מבחוץ


    return (
        <div className="finance-date-picker">
            <div className="finance-selected" onClick={toggleOpen}>
                {selectedDate
                    ? `${selectedDate.slice(8, 10)}/${selectedDate.slice(5, 7)}/${selectedDate.slice(0, 4)}`
                    : placeholder}
                <span className={`arrow ${isOpen ? "open" : ""}`}>▾</span>
            </div>
            {isOpen && (
                <div className="calendar-popup">
                    <div className="calendar-header">
                        <button onClick={prevMonth}>&lt;</button>
                        <span>{monthNames[currentMonth]} {currentYear}</span>
                        <button onClick={nextMonth}>&gt;</button>
                    </div>
                    <div className="calendar-grid">
                        {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((d) => (
                            <div key={d} className="calendar-day-header">{d}</div>
                        ))}
                        {days.map((day) => (
                            <div
                                key={day.toISOString()}
                                className={`calendar-day ${selectedDate === day.toISOString().slice(0, 10) ? "selected" : ""}`}
                                onClick={() => handleSelectDate(day)}
                            >
                                {day.getDate()}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceDatePicker;
