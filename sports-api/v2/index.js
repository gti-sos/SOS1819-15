var sportsCompetitions =  require("./sports-competitions/sportsCompetitions.js");
var sportsCompetitionsSecure =  require("./sports-competitions/sportsCompetitionsSecure.js");

module.exports = {
    sportsCompetitions : function(app, BASE_PATH){
        sportsCompetitions(app,BASE_PATH);
    },
    sportsCompetitionsSecure : function(app, BASE_PATH){
        sportsCompetitionsSecure(app,BASE_PATH+"/secure");
    }    
    
}