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
  IonIcon,
  IonGrid,
  IonCol,
  IonRow,
  IonAvatar,
  IonLabel,
  IonItemDivider
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { read } from "./ApiCore";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import "./Home.css";
import { API } from "../config";
import { addItem } from "./CartHelper";
import { FaShare, FaCartPlus } from "react-icons/fa";

import { WhatsappShareButton, WhatsappIcon } from "react-share";

const SingleProduct = props => {
  let [product, setProduct] = useState({});
  const [error, setError] = useState(false);
  const [price, setPrice] = useState();
  const [redirect, setRedirect] = useState(false);

  const loadSingleProduct = productId => {
    read(productId).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
        setPrice(data.price);
      }
    });
  };

  const addToCart = () => {
    addItem(product, () => {
      setRedirect(true);
    });
  };
  const shouldRedirect = redirect => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const RenderVariant = e => {
    e.preventDefault();
    let price = e.target.id;
    let area = e.target.name;

    setPrice(e.target.id);
    let newProduct = product;

    if (product.name.includes("variant"))
      product.name = product.name.split("variant")[0];

    product.name = `${product.name} variant - ${area} sq. ft.`;
    newProduct.variantSelected = area + "sq. ft.";
    newProduct.price = parseInt(price);
    setProduct(newProduct);
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  const showAddToCartButton = () => {
    return (
      <IonButton onClick={addToCart} color="success" shape="round">
        {" "}
        <FaCartPlus
          style={{
            marginRight: "5px"
          }}
        />
        Buy Now
      </IonButton>
    );
  };

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
          <IonGrid>
            <IonRow>
              <IonCol style={{ margin: "0", padding: "0" }}>
                <IonCardTitle style={{ padding: "1rem 0rem 1rem 1rem" }}>
                  {product.name}
                </IonCardTitle>
              </IonCol>

              <IonCol
                style={{
                  margin: "0",
                  padding: "0"
                }}
              >
                <div className="Subdes" style={{ float: "right" }}>
                  <ul>
                    <li>
                      <FaShare
                        style={{
                          color: "#FFC107",
                          marginBottom: "5px",
                          marginRight: "5px"
                        }}
                      />
                    </li>
                    <li>
                      <WhatsappShareButton
                        url={`http://localhost:8100/product/${product._id}`}
                      >
                        <WhatsappIcon size={25} round={true} />
                      </WhatsappShareButton>
                    </li>
                  </ul>
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  color: "black"
                }}
              >
                <div>
                  <h5>₹{product.price}</h5>
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol style={{ textAlign: "center" }}>
                {showAddToCartButton()}
                {shouldRedirect(redirect)}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>

        <IonCard className="desc-card">
          <IonCardTitle style={{ textAlign: "center" }}>
            BUY PACKAGE AS PER YOU PLOT SIZE
          </IonCardTitle>

          <IonCardContent style={{ textAlign: "center" }}>
            {product.variants &&
              product.variants.length > 0 &&
              product.variants.map((item, index) => (
                <IonButton
                  key={index}
                  id={item.price}
                  name={item.area}
                  style={{ textTransform: "uppercase" }}
                  onClick={RenderVariant}
                  size="small"
                  shape="round"
                >
                  AREA UPTO {item.area} Sq.Ft. - Rs.{item.price}
                </IonButton>
              ))}
          </IonCardContent>
        </IonCard>
        <IonCard className="desc-card">
          <IonCardContent style={{ textAlign: "left" }}>
            {ReactHtmlParser(product.description)}
          </IonCardContent>
        </IonCard>

        <IonCard className="desc-card" style={{ minHeight: "5vh" }}></IonCard>
      </IonContent>
    </>
  );
};

export default SingleProduct;
