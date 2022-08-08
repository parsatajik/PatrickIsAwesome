import "./App.scss";
import Pat from "./assets/Pat2.jpeg";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import React, { useState, useEffect, useRef } from "react";

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
} from "firebase/firestore";

import CLOUDS from "vanta/dist/vanta.clouds.min.js";
import * as THREE from "three";

const firebaseConfig = {
  apiKey: "AIzaSyBX4Yy1vhQ-NVuBI0D4cih9jQ0CQ4uVXoQ",
  authDomain: "patrickisawesome-6fa35.firebaseapp.com",
  projectId: "patrickisawesome-6fa35",
  storageBucket: "patrickisawesome-6fa35.appspot.com",
  messagingSenderId: "503436605342",
  appId: "1:503436605342:web:544b2d857496c16c45888f",
  measurementId: "G-NGTE4KSH40",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const App = () => {
  const [text, setText] = useState("");
  const [vantaEffect, setVantaEffect] = useState(0);
  const [messages, setMessages] = useState([]);
  const myRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      const snapshot = await getDocs(collection(db, "messages"));

      var ms = [];

      snapshot.forEach((doc) => {
        ms.push(doc.data());
      });

      ms.sort((a, b) => {
        return b.date.localeCompare(a.date);
      });

      setMessages(ms);
    };

    fetch();
  }, []);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        CLOUDS({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 600.0,
          minWidth: 800,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const sendMessage = async () => {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        date: new Date().toLocaleString(),
        text: text,
      });

      alert("Your message was successfully sent!");
      setText("");
    } catch (e) {
      console.error(e);
    }
  };

  console.log(messages);

  return (
    <div className="App">
      <div className="intro-blob" ref={myRef}>
        <img src={Pat} className="intro-blob__img" />
        <h1>Patrick Vuscan is awesome!! So let's appreciate him...</h1>
      </div>

      {/* Post a new appreciation */}
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": {
            m: 1,
          },
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#151515",
          margin: "30px",
          padding: "15px",
          borderRadius: "5px",
          height: "fit-content",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={4}
          placeholder="Something you wanna tell Pat..."
          variant="filled"
          sx={{ background: "#F2D1D1", margin: "0" }}
          onChange={(event) => setText(event.target.value)}
          value={text}
        />

        <Button
          variant="contained"
          sx={{
            background: "#F2D1D1",
            m: 1,
          }}
          onClick={() => sendMessage()}
        >
          Send
        </Button>
        <Button
          variant="contained"
          sx={{
            background: "#F2D1D1",
            m: 1,
          }}
          onClick={() => alert("FUNCTIONALITY IS NOT IMPLEMENTED YET LOL")}
        >
          Upload
        </Button>
      </Box>

      {/* Show previous appreciations  */}
      {messages.map((message, index) => (
        <div className="message" key={index}>
          <p>{message.date}</p>
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
