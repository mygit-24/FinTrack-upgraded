// autoSavingRegistry.js

const registeredModels = [];

function registerAutoSavingModel({ model, getQuery, applyAutoSaving }) {
    registeredModels.push({ model, getQuery, applyAutoSaving });
}

function getRegisteredModels() {
    return registeredModels;
}

module.exports = {
    registerAutoSavingModel,
    getRegisteredModels
};
