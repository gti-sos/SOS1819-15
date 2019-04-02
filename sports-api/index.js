var apiV1 =  require("./v1");

module.exports = {
    sportsCompetitions : function(app, BASE_PATH){
        apiV1.sportsCompetitions(app,BASE_PATH+"/v1");
    },
    sportsCompetitionsSecure : function(app, BASE_PATH){
        apiV1.sportsCompetitionsSecure(app,BASE_PATH+"/v1");
    },
    educationsCenters : function(app, BASE_PATH){
        apiV1.educationsCenters(app,BASE_PATH+"/v1");
    },
    educationsCentersSecure : function(app, BASE_PATH){
        apiV1.educationsCentersSecure(app,BASE_PATH+"/v1");
    },
    sportsCenters : function(app, BASE_PATH){
        apiV1.sportsCenters(app,BASE_PATH+"/v1");
    },
    sportsCentersSecure : function(app, BASE_PATH){
        apiV1.sportsCentersSecure(app,BASE_PATH+"/v1");
    }
    
}