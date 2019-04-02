var sportsCompetitions =  require("./sportCompetitions/sportsCompetitions.js");
var sportsCompetitionsSecure =  require("./sportCompetitions/sportsCompetitionsSecure.js");

module.exports = {
    sportsCompetitions : function(app, BASE_PATH){
        sportsCompetitions(app,BASE_PATH);
    },
    sportsCompetitionsSecure : function(app, BASE_PATH){
        sportsCompetitionsSecure(app,BASE_PATH+"/secure");
    }
}

var sportsCenters =  require("./sportsCenters/sportsCenters.js");
var sportsCentersSecure =  require("./sportsCenters/sportsCentersSecure.js");

module.exports = {
    sportsCenters : function(app, BASE_PATH){
        sportsCenters(app,BASE_PATH);
    },
    sportsCompetitionsSecure : function(app, BASE_PATH){
        sportsCentersSecure(app,BASE_PATH+"/secure");
    }
}

