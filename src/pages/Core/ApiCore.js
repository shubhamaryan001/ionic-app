import { API } from "../../config";

export const getProducts = () => {
  return fetch(`${API}/products?limit=undefined`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const read = productId => {
  return fetch(`${API}/product/${productId}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const processPayment = (userId, token, paymentData) => {
  return fetch(`${API}/payment/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const createOrder = (userId, token, createOrderData) => {
  return fetch(`${API}/order/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ order: createOrderData })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const getUserBalance = ({ userId }) => {
  return fetch(`${API}/wallet/balance/${userId}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const deductUserWallet = payload => {
  return fetch(`${API}/wallet/deduct/${payload.userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${payload.token}`
    },
    body: JSON.stringify(payload.wallet)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const getCoupon = ({ code }) => {
  return fetch(`${API}/coupon/${code}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
