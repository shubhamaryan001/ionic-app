import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "../../config";
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonText,
  IonButton,
  IonItem,
  IonCardContent
} from "@ionic/react";
import { FaRegCheckCircle } from "react-icons/fa";
import Zoom from "react-reveal/Zoom";
import "./Home.css";

const Successfull = () => {
  return (
    <IonContent>
      <IonCard
        style={{
          marginTop: "50%",
          zIndex: "99"
        }}
      >
        <IonCardHeader
          style={{ textAlign: "center", fontSize: "18px", fontWeight: "600" }}
          color="success"
        >
          Thank you for Purchasing Our Services
        </IonCardHeader>
        <Zoom duration={1500} delay={1500} loop>
          <FaRegCheckCircle
            style={{
              padding: "5px",
              width: "100%",
              fontSize: "6rem",
              color: "#10dc60"
            }}
          />
        </Zoom>
        <IonItem lines="none">
          <IonText
            style={{ textAlign: "center", fontSize: "18px", fontWeight: "600" }}
          >
            Please Go to My Orders Page To Track Your Order Live
          </IonText>
        </IonItem>

        <div style={{ textAlign: "center", fontWeight: "500" }}>
          <IonButton color="secondary" href="/profile">
            Track Order
          </IonButton>
        </div>
      </IonCard>

      <img
        className="celb-img"
        src="https://cdn.dribbble.com/users/428063/screenshots/4191384/dribbble-animate-balloons.gif"
        alt=""
      ></img>
    </IonContent>
  );
};

export default Successfull;
