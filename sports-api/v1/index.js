var sportsCompetitions =  require("./sports-competitions/sportsCompetitions.js");
var sportsCompetitionsSecure =  require("./sports-competitions/sportsCompetitionsSecure.js");
var educationsCenters =  require("./educations-centers/educationsCenters.js");
var educationsCentersSecure =  require("./educations-centers/educationsCentersSecure.js");
var sportsCenters =  require("./sports-centers/sportsCenters.js");
var sportsCentersSecure =  require("./sports-centers/sportsCentersSecure.js");

module.exports = {
    sportsCompetitions : function(app, BASE_PATH){
        sportsCompetitions(app,BASE_PATH);
    },
    sportsCompetitionsSecure : function(app, BASE_PATH){
        sportsCompetitionsSecure(app,BASE_PATH+"/secure");
    },
    educationsCenters : function(app, BASE_PATH){
        educationsCenters(app,BASE_PATH);
    },
    educationsCentersSecure : function(app, BASE_PATH){
        educationsCentersSecure(app,BASE_PATH+"/secure");
    },
    sportsCenters : function(app, BASE_PATH){
        sportsCenters(app,BASE_PATH);
    },
    sportsCentersSecure : function(app, BASE_PATH){
        sportsCentersSecure(app,BASE_PATH+"/secure");
    }
    
    
}