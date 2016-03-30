/**
 * Created by Alex on 28/03/2016.
 */

function populateMenuParameters(menuName) {
    if (menuLoadComplete) {
        if (menuName == "naturalMenu") {
            document.forms['parameter-form'].elements['colonySize'].value = controller.colonySize;
            document.forms['parameter-form'].elements['antReleaseSpeed'].value = scenario.antReleaseSpeed;
            document.forms['parameter-form'].elements['pathRandomness'].value = scenario.pathRandomness;
            document.forms['parameter-form'].elements['depositRate'].value = controller.pheromoneDepositRate;
            document.forms['parameter-form'].elements['initialPheromone'].value = controller.initialPheromoneLevel;
        }
        else if (menuName == "agentMenu") {
            document.forms['parameter-form'].elements['agentNumber'].value = controller.colonySize;
            document.forms['parameter-form'].elements['depositRate'].value = scenario.pheromoneFlatRate;
            document.forms['parameter-form'].elements['rho'].value = controller.pheromoneDecayRate;
        }
        else if (menuName == "advancedMenu") {
            document.forms['parameter-form'].elements['colonySize'].value = controller.colonySize;
            document.forms['parameter-form'].elements['alpha'].value = controller.pheromoneImportance;
            document.forms['parameter-form'].elements['beta'].value = controller.distanceImportance;
            document.forms['parameter-form'].elements['rho'].value = controller.pheromoneDecayRate;
            document.forms['parameter-form'].elements['depositRate'].value = controller.pheromoneDepositRate;
            document.forms['parameter-form'].elements['initialPheromone'].value = controller.initialPheromoneLevel;
        }
        refreshParameters = false;
        menuLoadComplete = false;
    }
}

function retrieveMenuParameters(menuName) {
    userSettings = {};
    if (menuName == "naturalMenu"){
        userSettings.viewType = menuName;
        userSettings.colonySize = validateParameter(Number(document.forms['parameter-form'].elements['colonySize'].value), 1, 300);
        userSettings.antReleaseSpeed = validateParameter(Number(document.forms['parameter-form'].elements['antReleaseSpeed'].value), 1, 10);
        userSettings.pathRandomness = validateParameter(Number(document.forms['parameter-form'].elements['pathRandomness'].value), 1, 4);
        userSettings.pheromoneDepositRate = validateParameter(Number(document.forms['parameter-form'].elements['depositRate'].value), 0, 10);
        userSettings.initialPheromoneLevel = validateParameter(Number(document.forms['parameter-form'].elements['initialPheromone'].value), 0, 10);
    }
    else if (menuName == "agentMenu"){
        userSettings.viewType = menuName;
        userSettings.numAgents = validateParameter(Number(document.forms['parameter-form'].elements['agentNumber'].value), 2, 10);
        userSettings.pheromoneFlatRate = validateParameter(Number(document.forms['parameter-form'].elements['depositRate'].value), 0, 10);
        userSettings.pheromoneDecayRate = validateParameter(Number(document.forms['parameter-form'].elements['rho'].value), 0, 100);
    }
    else if (menuName == "advancedMenu"){
        userSettings.viewType = menuName;
        userSettings.colonySize = validateParameter(Number(document.forms['parameter-form'].elements['colonySize'].value), 1, 300);
        userSettings.pheromoneImportance = validateParameter(Number(document.forms['parameter-form'].elements['alpha'].value), 0, 10);
        userSettings.distanceImportance = validateParameter(Number(document.forms['parameter-form'].elements['beta'].value), 0, 10);
        userSettings.pheromoneDecayRate = validateParameter(Number(document.forms['parameter-form'].elements['rho'].value), 0, 100);
        userSettings.pheromoneDepositRate = validateParameter(Number(document.forms['parameter-form'].elements['depositRate'].value), 0, 10);
        userSettings.initialPheromoneLevel = validateParameter(Number(document.forms['parameter-form'].elements['initialPheromone'].value), 0, 10);
    }
    return userSettings;
}

function loadSavedSettings(settings){
    if (settings == null){
        return;
    }
    if (settings.viewType == "naturalMenu"){
        if (scenario.viewType != "Nest-Food Scenario") { return; }
        controller.colonySize = settings.colonySize;
        scenario.antReleaseSpeed = settings.antReleaseSpeed;
        scenario.pathRandomness = settings.pathRandomness;
        controller.pheromoneDepositRate = settings.pheromoneDepositRate;
        controller.initialPheromoneLevel = settings.initialPheromoneLevel;
    }
    else if (settings.viewType == "agentMenu"){
        if (scenario.viewType != "TSP (Agents)") { return; }
        controller.colonySize = settings.numAgents;
        controller.pheromoneDecayRate = settings.pheromoneDecayRate;
        scenario.pheromoneFlatRate = settings.pheromoneFlatRate;
    }
    else if (settings.viewType == "advancedMenu"){
        if (scenario.viewType != "TSP (Advanced)") { return; }
        controller.colonySize = settings.colonySize;
        controller.pheromoneImportance = settings.pheromoneImportance;
        controller.distanceImportance = settings.distanceImportance;
        controller.pheromoneDecayRate = settings.pheromoneDecayRate;
        controller.pheromoneDepositRate = settings.pheromoneDepositRate;
        controller.initialPheromoneLevel = settings.initialPheromoneLevel;
    }
}

function validateParameter(value, min, max){
    if (value < min) { value = min; refreshParameters = true;}
    if (value > max) { value = max; refreshParameters = true;}
    return value;
}