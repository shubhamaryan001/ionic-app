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
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { getProducts } from "./ApiCore";
import "./Home.css";
import { API } from "../../config";
import { itemTotal } from "./CartHelper";
import { FaCartPlus } from "react-icons/fa";

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
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol>
                {" "}
                <IonTitle>Home</IonTitle>
              </IonCol>
              <IonCol>
                {" "}
                <IonTitle style={{ float: "right" }}>
                  <a href="/cart">
                    <FaCartPlus
                      style={{
                        marginBottom: "2px",
                        fontSize: "20px",
                        color: "yellow"
                      }}
                    />
                    <IonBadge color="danger">{itemTotal()}</IonBadge>
                  </a>
                </IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>

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
                      fontSize: "40px",
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
                  {p.short_description.substring(0, 200)}
                  <span style={{ marginLeft: "5px" }}>
                    <a href={`/product/${p._id}`}>
                      <IonBadge color="danger"> Read More</IonBadge>
                    </a>
                  </span>
                </IonCardContent>
              </IonCard>
            </IonSlide>
          ))}
        </IonSlides>
      )}

      <IonCard
        style={{ textAlign: "center", padding: "0", margin: "5px 0 5px 0" }}
      >
        <iframe
          width="385"
          height="250"
          title="Intro"
          src="https://www.youtube.com/embed/EU0d67eNPTU"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </IonCard>
    </IonContent>
  );
};

export default Home;
