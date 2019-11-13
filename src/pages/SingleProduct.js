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
  IonItem,
  IonIcon
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { read } from "./ApiCore";

import "./Home.css";
import { API } from "../config";

import { WhatsappShareButton, WhatsappIcon } from "react-share";

const SingleProduct = props => {
  let [product, setProduct] = useState({});
  const [error, setError] = useState(false);
  const [price, setPrice] = useState();

  const loadSingleProduct = productId => {
    read(productId).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        console.log(data);
        setProduct(data);
        setPrice(data.price);
      }
    });
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{product.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard className="single-card">
          <img src={`${API}/product/photo/${product._id}`} alt={product.name} />
          <IonItem>
            <IonCardTitle style={{ padding: "1rem 0rem 1rem 1rem" }}>
              {product.name}
            </IonCardTitle>

            <WhatsappShareButton
              className="share-btn"
              url={`https://ionic-app-floor.herokuapp.com/product/${product._id}`}
            >
              <IonIcon name="md-share-alt"></IonIcon>

              <WhatsappIcon size={32} round={true} />
            </WhatsappShareButton>
          </IonItem>
        </IonCard>
      </IonContent>
    </>
  );
};

export default SingleProduct;
