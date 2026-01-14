
const express = require("express");
const router = express.Router();
const SavingsGoal = require("../models/SavingGoal");
const auth = require("../middleware/authMiddleware");

// יצירת SavingGoal חדש
router.post("/", auth, async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, autoSaving } = req.body;
    const userId = req.user.id; // מגיע מהטוקן

    const newSavingGoal = new SavingsGoal({
      userId,
      title,
      targetAmount,
      currentAmount: (currentAmount || 0) + (autoSaving?.amount || 0),
      autoSaving: {
        amount: autoSaving?.amount || 0,
        frequency: autoSaving?.frequency || "none",
        isUnlimited: autoSaving?.isUnlimited ?? true,
        timesToRepeat: autoSaving?.isUnlimited === false ? autoSaving?.timesToRepeat : null
      }
    });

    const savedGoal = await newSavingGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// הוספת סכום חד-פעמי ליעד
router.post("/:id/add-amount", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "סכום לא חוקי" });
    }

    const goal = await SavingsGoal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ error: "Saving goal not found" });

    goal.currentAmount += amount;
    await goal.save();

    res.status(200).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// עדכון SavingGoal קיים
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, autoSaving } = req.body;

    const updatedGoal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // בדיקה לפי userId
      {
        title,
        targetAmount,
        currentAmount,
        autoSaving: {
          amount: autoSaving?.amount || 0,
          frequency: autoSaving?.frequency || "none",
          isUnlimited: autoSaving?.isUnlimited ?? true,
          timesToRepeat: autoSaving?.isUnlimited === false ? autoSaving?.timesToRepeat : null
        }
      },
      { new: true }
    );

    if (!updatedGoal) return res.status(404).json({ error: "Saving goal not found" });
    res.status(200).json(updatedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// מחיקת SavingGoal
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedGoal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deletedGoal) return res.status(404).json({ error: "Saving goal not found" });
    res.status(200).json({ message: "Saving goal deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// קבלת כל ה-SavingGoals של המשתמש
router.get("/", auth, async (req, res) => {
  try {
    const allGoals = await SavingsGoal.find({ userId: req.user.id });
    res.status(200).json(allGoals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;