const lists = require('../constants/gameChoices');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./local-db', (err) => {
    if (err) {
        return console.error(err.message);
    }

  console.log('Connected to SQlite db');
});

db.run('CREATE TABLE IF NOT EXISTS playerGames (name TEXT PRIMARY KEY,games TEXT)');

const gameChooser = async (peopleActive) => {
    let pickedGame = await generatePlayerGamesLists(peopleActive).then(result => {
      console.log("generatePlayers result: ");
      console.log(result);
      console.log("generatePlayers length: " + result.length);
      commonGames = result[0];
      // Find the common games between each player
      if(result.length == peopleActive.length && result.length > 1) {
        for(let i = 1; i < result.length; i++){
          console.log("current commonGames:");
          console.log(commonGames);
          newCommon = [];
          result[i].forEach((val) => { 
            console.log("current game: " + val);
            if(commonGames.includes(val)){
              newCommon.push(val);
            }
          });
          console.log("newCommon: " + newCommon);
          commonGames = newCommon;
        }
      }
      console.log("Common Games: " + commonGames);
      if(commonGames.length > 0){
        return commonGames[Math.floor(Math.random() * commonGames.length)];
      }else {
        return "No common games found, check your games list!";
      }
    }, function(err) {
      return "Error picking game";
    })
    .catch((err) => {
      return console.error(err.message);
    });

    return pickedGame;
}

const updateUsersGames = (userName, gameStr) => {
    console.log(userName + " " + gameStr);
    if(gameStr) {
         // Remove spaces before and after comma before inserting into database
         gameStr = gameStr.replace(/,\s+/g, ',');
         gameStr = gameStr.replace(/\s+,/g, ',');
         db.run('REPLACE INTO playerGames (name, games) VALUES (?, ?)', [userName, gameStr]); 
    }
    return queryPlayerGames(userName);
}

const generatePlayerGamesLists = async(peopleActive) => {
    const promises = [];
    const queryList = [];

    peopleActive.map((userName) => {
      console.log("Querying: " + userName);
      promises.push(queryPlayerGames(userName));
    });

    console.log("Waiting for promises to resolve: " + promises.length);
    let res = await Promise.all(promises)
      .then((results) => {
        results.map((query) => {
          queryList.push(query.row.split(","));
        })
      return queryList;
      })
      .catch((err) => {
        return console.error(err.message);
      });
  return res;
}

const queryPlayerGames = (userName) => {
    return new Promise(function (resolve, reject) {
         var responseObj;
         db.get("SELECT * FROM playerGames WHERE name = ?", [userName], function(err,row) {
           if (err) {
             responseObj = {
               'error': err
             };
             reject(responseObj);
           } else {
             // If query failed, create row object and set a default value
             if(!row){
               row = {
                 games: "None"
               };
             }
             responseObj = {
               statement: this,
               row: row.games
             };
             resolve(responseObj);
           }
         });
    });
}

const deleteAllPlayerGames = (userName) => {
    return new Promise(function (resolve, reject) {
         var responseObj;
         db.get("DELETE FROM playerGames WHERE name = ?", [userName], function(err,row) {
           if (err) {
             responseObj = {
               'error': err
             };
             reject(responseObj);
           } else {
             responseObj = {
               statement: this,
             };
             resolve(responseObj);
           }
         });
    });
}

module.exports.gameChooser = gameChooser;
module.exports.updateUsersGames = updateUsersGames;
module.exports.deleteAllPlayerGames = deleteAllPlayerGames;
