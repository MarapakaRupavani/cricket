const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
app.get("/players/", async (request, response) => {
  const Team = `
    SELECT
      *
    FROM
      cricket_team;`;
  const playerData = await db.all(Team);
  response.send(playerData);
});

app.post("/players/", async (request, response) => {
  const { player_name, jersey_number, role } = request.body;
  const insertQuery = `Insert into cricket_team {player_name,jersey_number,role} Values ( 
        '${player_name}',
         '${jersey_number}',
         '${role}');`;
  const add_player = await db.run(insertQuery);
  const player_id = add_player.lastID;
  response.send({ add_player });
  response.send("Player Added team");
});
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const selectQuery = `Select * from cricket_team where player_id is '${playerId}';`;
  const dbUser = await db.get(selectQuery);
  response.send(200);
});

app.put("/players/:playerId", async (request, response) => {
  const { player_name, jersey_number, role } = request.body;
  const { playerId } = request.params;
  const insertQuery = `update cricket_team 
        set   
        player_name='${player_name}',
         jersey_number='${jersey_number}',
         role='${role}')
         where player_id is ${playerId};`;
  const add_player = await db.run(insertQuery);
  response.send("Player Details Updated");
});
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `delete from cricket_team where player_id is ${playerId};`;
  const dbUser = await db.run(deleteQuery);
  response.send("Player Removed");
});
export default express;
