import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSlides,
  IonSlide,
  IonButton
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { getProducts } from "./ApiCore";
import "./Home.css";
import { API } from "../config";

const Home = () => {
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);

  const loadProductsByArrival = () => {
    getProducts().then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  const getTotal = () => {
    return productsByArrival.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.price;
    }, 0);
  };

  useEffect(() => {
    loadProductsByArrival();
  }, []);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {productsByArrival.length > 0 && (
          <IonSlides id="slides">
            {productsByArrival.map((p, i) => (
              // <img src={`${API}/product/photo/${p._id}`} alt={p.name} />
              <IonSlide key={i}>
                <IonCard
                  className="main-card"
                  style={{
                    background: ` url("${API}/product/photo/${p._id}") no-repeat center `
                  }}
                >
                  <IonCardHeader>
                    <IonCardTitle
                      style={{
                        color: "#FBA211",
                        fontSize: "50px",
                        fontWeight: "800",
                        textAlign: "center",
                        textTransform: "uppercase"
                      }}
                    >
                      {p.name}
                    </IonCardTitle>
                    <IonCardSubtitle
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: "50px",
                        textAlign: "center"
                      }}
                    >
                      ₹{p.price}
                    </IonCardSubtitle>

                    <IonButton className="card-button">
                      <a href={`/product/${p._id}`}>Buy Now</a>
                    </IonButton>
                  </IonCardHeader>

                  <IonCardContent
                    style={{
                      color: "white",

                      fontWeight: "400",
                      textAlign: "center"
                    }}
                  >
                    {p.short_description.substring(0, 150)}
                  </IonCardContent>
                </IonCard>
              </IonSlide>
            ))}
          </IonSlides>
        )}
      </IonContent>
    </>
  );
};

export default Home;
