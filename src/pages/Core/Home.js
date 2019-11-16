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
import Slide from "react-reveal/Slide";
import Zoom from "react-reveal/Zoom";

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
  const slideOpts = {
    initialSlide: 0,
    speed: 800,
    autoplay: {
      delay: 2000
    }
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
                <IonTitle>Home</IonTitle>
              </IonCol>
              <IonCol>
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

      <IonCard
        style={{
          textAlign: "center",
          borderRadius: "0",
          margin: "0"
        }}
      >
        <img
          style={{
            textAlign: "center",
            width: "60%",
            height: "auto",
            margin: "0 auto"
          }}
          src="https://www.shubhamaryan.com/wp-content/uploads/2019/11/1.png"
          alt="Floor Plan Bazaar"
        />
      </IonCard>

      {productsByArrival.length > 0 && (
        <IonSlides pager={true} options={slideOpts}>
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
      <Zoom duration={1000} delay={2500}>
        <IonCard
          color="dark"
          style={{
            textAlign: "center",
            margin: "0",
            borderRadius: "0",
            padding: "5px 0 0 0"
          }}
        >
          <iframe
            title="Intro"
            allowFullScreen="allowFullScreen"
            src="https://www.youtube.com/embed/EU0d67eNPTU?ecver=1&amp;iv_load_policy=1&amp;rel=0&amp;showinfo=0&amp;yt:stretch=16:9&amp;autoplay=1&amp;autohide=1&amp;color=red&amp;width=385&amp;width=385"
            width="385"
            height="250"
            allowtransparency="true"
            frameborder="0"
          ></iframe>
          <IonTitle color="light" style={{}}>
            WATCH OUR INTRODUCTION VIDEO
          </IonTitle>
        </IonCard>
      </Zoom>

      <Slide left duration={1000} delay={3500}>
        <IonCard style={{}}>
          <img
            src="https://www.shubhamaryan.com/wp-content/uploads/2019/11/Screenshot_14.jpg"
            alt="paymentoption"
          />
        </IonCard>
      </Slide>
    </IonContent>
  );
};

export default Home;
