import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";

import "./Login.scss";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [chips, setChips] = useState(10000);

  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      console.log("Log");
      history.push("/login");
    } catch {
      setError("Error logging out");
    }
  }

  //BRING IN FIREBASE/FIRESTORE COLLECTION
  const ref = firebase.firestore().collection("Players");

  function addPlayer(newPlayer) {
    ref
      .doc(newPlayer.id)
      .set(newPlayer)
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="PageLayout">
      <div className="SetWidth">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <strong>Email:</strong> {currentUser.email}
            <Link to="/table" className="btn btn-primary w-100 mt-3">
              <button
                onClick={() => {
                  addPlayer({ name: currentUser.email, chips, id: uuidv4() });
                }}
              >
                Go to table
              </button>
            </Link>
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Button variant="link" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
