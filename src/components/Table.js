import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

export default function Table() {
  //Set state for players and loading
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [chips, setChips] = useState(0);

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

      <input
        type="text"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <textarea onChange={(e) => setChips(e.target.value)}></textarea>
      <button
        onClick={() =>
          addPlayer({ name: currentUser.email, chips, id: uuidv4() })
        }
      >
        Add Player
      </button>
      {players.map((player) => (
        <div key={player.id}>
          <div border="1px solid red">
            <h2>
              {player.name}_{player.chips}
            </h2>
            <button onClick={() => deletePlayer(player)}>X</button>
            <button onClick={() => editPlayer({ name })}>Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
}
