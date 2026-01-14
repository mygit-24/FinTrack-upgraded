const cron = require("node-cron");
const { getRegisteredModels } = require("./autoSavingRegistry");

// פונקציה שבודקת האם יש לעדכן את הישות בהתאם לתדירות שהוגדרה
function shouldApplyAutoSaving(lastUpdatedAt, frequency) {
    const now = new Date();
    const last = new Date(lastUpdatedAt);

    switch (frequency) {
        case "weekly":
            return now - last >= 7 * 24 * 60 * 60 * 1000;
        case "monthly":
            return now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear();
        case "yearly":
            return now.getFullYear() !== last.getFullYear();
        default:
            return false;
    }
}

// משימת cron שמריצה את כל היישויות שנרשמו עם autoSaving
cron.schedule("0 0 * * *", async () => {
    console.log(" Running auto-saving cron job...");

    const registeredModels = getRegisteredModels();

    for (const { model, getQuery, applyAutoSaving } of registeredModels) {
        const items = await model.find(getQuery());

        for (let entity of items) {
            if (shouldApplyAutoSaving(entity.updatedAt, entity.autoSaving.frequency)) {
                const updated = applyAutoSaving(entity);
                await updated.save();
                console.log(`✔ Auto-saving applied to ${model.modelName}`);
            }
        }
    }

    console.log(" Auto-saving cron completed.");
});
