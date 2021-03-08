import React, { useState, useEffect } from "react";
import firebase from "firebase/app";

export default function Table() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = firebase.firestore().collection("Players");
  console.log(ref);

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

  useEffect(() => {
    getPlayers();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h2>Table</h2>
      {players.map((player) => (
        <div key={player.id}>
          <h2>{player.total}</h2>
        </div>
      ))}
    </div>
  );
}
