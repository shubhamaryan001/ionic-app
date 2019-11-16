import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonItem,
  IonButton,
  IonLabel,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";
import { API } from "../../config";
import { isAuthenticated, signout } from "./UsersApi";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const UserProfile = ({ history }) => {
  let {
    user: { _id, name, email, mobile, role, wallet_balance },
    token
  } = isAuthenticated();

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonCard style={{ padding: "2rem 0 2rem 0" }}>
        <IonCardTitle color="success" style={{ textAlign: "center" }}>
          {name}'s Profile
        </IonCardTitle>
        <IonCardContent>
          <IonItem lines="none" style={{ textAlign: "center" }}>
            <img
              src={`${API}/user/photo/${_id}`}
              alt={name}
              style={{ borderRadius: "50px" }}
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel>
              <b>Email:</b>
              <span> {email}</span>
            </IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>
              <b>User Id:</b>
              <span> {_id}</span>
            </IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>
              <b>Register Mobile:</b>
              <span> {mobile}</span>
            </IonLabel>
          </IonItem>
        </IonCardContent>
      </IonCard>

      <IonCard style={{ padding: "2rem 0 2rem 0" }}>
        <IonTitle color="success" style={{ textAlign: "center" }}>
          Wallet Info
        </IonTitle>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonLabel>
                  <b>Current Balance: </b>
                  <span> ₹{wallet_balance}</span>
                </IonLabel>
              </IonItem>
            </IonCol>
            <IonCol style={{ textAlign: "center" }}>
              <form>
                <IonItem>
                  <IonInput
                    type="number"
                    placeholder="Add To wallet"
                  ></IonInput>
                </IonItem>
                <IonButton size="small">Add Money</IonButton>
              </form>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
      <IonItem lines="none" style={{ textAlign: "center" }}>
        <IonLabel>
          <IonButton
            onClick={() =>
              signout(() => {
                history.push("/home");
              })
            }
            color="danger"
          >
            Log-Out
          </IonButton>
        </IonLabel>
      </IonItem>
    </IonContent>
  );
};

export default UserProfile;
