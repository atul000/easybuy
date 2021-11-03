import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { getUserOrders } from "../../functions/user";
import { useSelector } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../../components/order/Invoice";

const History = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = () => {
    getUserOrders(user.token).then((res) => {
      setOrders(res.data);
    });
  };
  const showOrderInTable = (order) => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <b>{order.products[0].product.title}</b>
          </td>
          <td>
            {(order.paymentIntent.amount /= 100).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </td>
          <td>{order.products[0].product.brand}</td>
          <td>{order.products[0].product.color}</td>
          <td>{order.products[0].count}</td>
          <td>
            {order.products[0].product.shipping === "Yes" ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order} />}
      fileName="invoice.pdf"
      className="btn btn-sm btn-block btn-outline-primary"
    >
      Download PDF
    </PDFDownloadLink>
  );

  const showEachOrders = () =>
    orders &&
    orders.reverse().map((order, i) => (
      <div key={i} className="m-5 p-3 card">
        <p>
          <ShowPaymentInfo order={order} />
        </p>

        {showOrderInTable(order)}
        <div className="row">
          <div className="col">{showDownloadLink(order)}</div>
        </div>
      </div>
    ));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col text-center">
          <h4>
            {" "}
            {orders.length > 0 ? "User purchase orders" : "No purchase orders"}
          </h4>
          {showEachOrders()}
          {/* {JSON.stringify(orders)} */}
        </div>
      </div>
    </div>
  );
};

export default History;
