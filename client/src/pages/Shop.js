import React, { useState, useEffect } from "react";
import { getProductByCount, fetchProductsByFilter } from "../functions/product";
import { getCategories } from "../functions/category";
import { getSubs } from "../functions/sub";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import { Menu, Slider, Checkbox, Radio } from "antd";
import {
  WalletOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Star from "../components/forms/Star";

const { SubMenu, ItemGroup } = Menu;

const Shop = ({ match }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState("");
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState("");
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "Asus",
    "HP",
    "Dell",
  ]);
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");

  const [shipping, setShipping] = useState("");

  const dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    loadAllProducts();
    getCategories().then((res) => setCategories(res.data));
    // sub cat
    getSubs().then((res) => setSubs(res.data));
  }, [match.url]);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  //   1. load products by default
  const loadAllProducts = () => {
    getProductByCount(12).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  //   2. load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
      if (!text) {
        loadAllProducts();
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  //   3. load products based on price range
  useEffect(() => {
    fetchProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoryIds([]);
    setPrice(value);
    setBrand("");
    setStar("");
    setSub("");
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  //   4. load product based on categories
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          name="category"
          value={c._id}
          className="pb-2 pl-4 pr-4"
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  // handle check for categories
  const handleCheck = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });

    setPrice([0, 0]);
    setBrand("");
    setSub("");
    setStar("");

    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); // index or -1

    // if don't found return -1 else reutrn index
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      // if found pull out one item from index
      inTheState.splice(foundInTheState, 1);
    }
    setCategoryIds(inTheState);
    // console.log(inTheState);
    fetchProducts({ category: inTheState });
  };

  // 5. show products by star rating

  const handleStarClick = (num) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });

    setPrice([0, 0]);
    setCategoryIds([]);
    setStar(num);
    setSub("");
    setBrand("");
    fetchProducts({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  // 6. show products by sub-cat
  const showSubs = () =>
    subs &&
    subs.map((s) => (
      <div
        key={s._id}
        onClick={() => handleSub(s)}
        style={{ cursor: "pointer" }}
        className="p-1 m-1 badge badge-secondary"
      >
        {s.name}
      </div>
    ));

  const handleSub = (sub) => {
    setSub(sub);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });

    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    fetchProducts({ sub });
  };

  // 7. show products brand
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        key={b}
        className="pl-4 pr-3 pb-2"
        onChange={handleBrand}
        name={b}
        checked={b === brand}
        value={b}
      >
        {b}
      </Radio>
    ));

  const handleBrand = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setSub("");
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand(e.target.value);
    fetchProducts({ brand: e.target.value });
  };

  // 8. show products based on color
  const showColors = () =>
    colors.map((c) => (
      <Radio
        key={c}
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-4 pr-4"
      >
        {c}
      </Radio>
    ));

  const handleColor = (e) => {
    setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor(e.target.value);
    setShipping("");
    fetchProducts({ color: e.target.value });
  };

  // 9. show products based on shipping yes/no
  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="Yes"
        checked={shipping === "Yes"}
      >
        Yes
      </Checkbox>

      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="No"
        checked={shipping === "No"}
      >
        No
      </Checkbox>
    </>
  );

  const handleShippingchange = (e) => {
    setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Filter</h4>
          <hr />
          {/* price */}
          <Menu
            defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}
            mode="inline"
          >
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <WalletOutlined /> Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `₹${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="200000"
                />
              </div>
            </SubMenu>

            {/* categories */}
            <SubMenu
              overflow="scroll"
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              <div style={{ marginTop: "-2px" }}>{showCategories()}</div>
            </SubMenu>

            {/* stars */}
            <SubMenu
              overflow="scroll"
              key="3"
              title={
                <span className="h6">
                  <StarOutlined /> Rating
                </span>
              }
            >
              <div style={{ marginTop: "-2px" }}>{showStars()}</div>
            </SubMenu>

            {/* sub-categories */}
            <SubMenu
              overflow="scroll"
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Sub Categories
                </span>
              }
            >
              <div className="pl-4 pr-4" style={{ marginTop: "-2px" }}>
                {showSubs()}
              </div>
            </SubMenu>

            {/* Brands */}
            <SubMenu
              overflow="scroll"
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Brands
                </span>
              }
            >
              <div className="pr-5" style={{ marginTop: "-10px" }}>
                {showBrands()}
              </div>
            </SubMenu>

            {/* colors */}
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Colors
                </span>
              }
            >
              <div style={{ maringTop: "-10px" }} className="pr-5">
                {showColors()}
              </div>
            </SubMenu>

            {/* shipping */}
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div style={{ maringTop: "-10px" }} className="pr-5">
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}

          {products.length < 1 && <p>No Products Found</p>}

          <div className="row pb-5">
            {products.length > 0 &&
              products.map((p) => (
                <div key={p._id} className="col-md-4 mt-3">
                  <ProductCard product={p} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
