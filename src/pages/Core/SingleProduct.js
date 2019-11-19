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
  IonItemDivider,
  IonText
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
import { API } from "../../config";
import { addItem } from "./CartHelper";
import { FaShare, FaCartPlus } from "react-icons/fa";

import { WhatsappShareButton, WhatsappIcon } from "react-share";

const SingleProduct = props => {
  let [product, setProduct] = useState({});
  const [name, setName] = useState();

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
        setName(data.name);
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
    let price = e.target.dataset.price;
    let area = e.target.dataset.area;
    setPrice(e.target.dataset.price);
    let newProduct = product;
    if (product.name.includes("variant")) {
      product.name = product.name.split("variant")[0].trim();
    }
    product.name = `${product.name} variant - ${area} sq. ft.`;
    setName(product.name);
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
      <IonButton onClick={addToCart} href="/cart" color="success" shape="round">
        <FaCartPlus
          style={{
            marginRight: "5px"
          }}
        />
        Buy Now
      </IonButton>
    );
  };

  const slideOpts = {
    initialSlide: 0,
    speed: 2000,
    autoplay: {
      delay: 2000
    },
    loop: true
  };

  const Videopremium = () => {
    return (
      <>
        {product._id === "5dcc1f0504510f454493aa72" ? (
          <>
            <IonSlides pager={true} options={slideOpts}>
              <IonSlide>
                <IonCard
                  color="dark"
                  style={{
                    margin: "5px",
                    padding: "0"
                  }}
                >
                  <iframe
                    title="Premium House Desgin"
                    allowFullScreen="allowFullScreen"
                    src="https://www.youtube.com/embed/c6pkHIrIgTI?ecver=1&amp;iv_load_policy=1&amp;rel=0&amp;showinfo=0&amp;yt:stretch=16:9&amp;autoplay=1&amp;autohide=1&amp;color=red&amp;width=385&amp;width=385"
                    width="385"
                    height="220"
                    allowtransparency="true"
                    frameborder="0"
                  ></iframe>
                </IonCard>
              </IonSlide>

              <IonSlide>
                <IonCard
                  style={{
                    margin: "5px",
                    padding: "0"
                  }}
                >
                  <img
                    src={`${API}/product/photo/${product._id}`}
                    alt={product.name}
                  />
                </IonCard>
              </IonSlide>
            </IonSlides>
          </>
        ) : (
          <>
            <IonCard>
              <img
                src={`${API}/product/photo/${product._id}`}
                alt={product.name}
              />
            </IonCard>
          </>
        )}
      </>
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
        <IonCard>
          {Videopremium()}
          <IonGrid>
            <IonRow>
              <IonCol style={{ margin: "0", padding: "0" }}>
                <IonText color="dark">
                  <h4
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      padding: "0",
                      margin: "0"
                    }}
                  >
                    {name}
                  </h4>
                </IonText>
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
                  <h5>₹{price}</h5>
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
                  // id={item.price}
                  data-area={item.area}
                  data-price={item.price}
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
