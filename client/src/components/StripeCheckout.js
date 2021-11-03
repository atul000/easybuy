import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { CheckOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import { createOrder, emptyUserCart } from "../functions/user";

const StripeCheckout = ({ history }) => {
  const dispatch = useDispatch();
  const { user, coupon } = useSelector((state) => ({ ...state }));

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    createPaymentIntent(user.token, coupon).then((res) => {
      console.log(res);
      setClientSecret(res.data.clientSecret);
      // additional res
      setCartTotal(res.data.cartTotal);
      setTotalAfterDiscount(res.data.totalAfterDiscount);
      setPayable(res.data.payable);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      createOrder(payload, user.token).then((res) => {
        if (res.data.ok) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
          }
          dispatch({
            type: "ADD_TO_CART",
            payload: [],
          });

          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });

          emptyUserCart(user.token);
        }
      });

      console.log(payload, null, 4);
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const handleChange = async (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  const cartStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="">
      {!succeeded && (
        <div>
          {coupon && totalAfterDiscount !== undefined ? (
            <p className="alert alert-success">
              {`Total after discount: ₹ ${totalAfterDiscount}`}
            </p>
          ) : (
            <p className="alert alert-danger">No Coupon Applied</p>
          )}
        </div>
      )}
      <div className="text-center pb-5">
        <Card
          cover={
            <img
              style={{
                height: "200px",
                objectFit: "cover",
                marginBottom: "-50px",
              }}
              src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnpceOp_70yNTOH85Od4ByTlemp_fT2Z9jaw&usqp=CAU`}
            />
          }
          actions={[
            <>
              <MoneyCollectOutlined className="text-info" />
              Total: ₹ {cartTotal}
            </>,
            <>
              <CheckOutlined className="text-info" />
              Total Payable: ₹ {(payable / 100).toFixed(2)}
            </>,
          ]}
        />
      </div>

      <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
        <CardElement
          id="cart-element"
          options={cartStyle}
          onChange={handleChange}
        />
        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
        >
          <span id="button-text">
            {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
          </span>
        </button>
        <br />
        {error && (
          <div role="alert" className="card-error">
            {error}
          </div>
        )}
        <br />
        <p className={succeeded ? "result-message" : "result-message hidden"}>
          Payment Successfull
          <Link to="/user/history">See it in your purchase history</Link>
        </p>
      </form>
    </div>
  );
};

export default StripeCheckout;
