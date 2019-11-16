import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard
} from "@ionic/react";

const Shop = () => {
  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Shop</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonCard>
        <h1>
          <b>Coming Soon </b>
        </h1>
      </IonCard>
    </IonContent>
  );
};

export default Shop;
