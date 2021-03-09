import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

export default function Table() {
  //Set state for players and loading
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [chips, setChips] = useState(10000);
  const [sitting, setSitting] = useState(false);

  console.log(sitting);

  //this is coming from firebase auth not the database
  const { currentUser, logout } = useAuth();
  console.log(currentUser);

  //BRING IN FIREBASE/FIRESTORE COLLECTION
  const ref = firebase.firestore().collection("Players");
  console.log(ref);

  //REALTIME GET FUNCTION
  function getPlayers() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const players = [];
      querySnapshot.forEach((doc) => {
        players.push(doc.data());
      });
      setPlayers(players);
      setLoading(false);
    });
  }

  //ADD FUNCTION
  function addPlayer(newPlayer) {
    ref
      .doc(newPlayer.id)
      .set(newPlayer)
      .catch((err) => {
        console.log(err);
      });
  }

  //DELETE FUNCTION
  function deletePlayer(player) {
    ref
      .doc(player.id)
      .delete()
      .catch((err) => {
        console.log(err);
      });
  }

  //EDIT FUNCTION
  function editPlayer(updatedPlayer) {
    setLoading();
  }

  useEffect(() => {
    getPlayers();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h2>Table</h2>

      <button
        onClick={() => {
          addPlayer({ name: currentUser.email, chips, id: uuidv4() });
        }}
      >
        Sit Here
      </button>
      {players.map((player) => (
        <div key={player.id}>
          <h2>
            {player.name}_{player.chips}
          </h2>
          <div>
            <button onClick={() => deletePlayer(player)}>Stand Up</button>
          </div>
        </div>
      ))}
    </div>
  );
}
