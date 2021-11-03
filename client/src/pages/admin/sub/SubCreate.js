import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { createSub, getSubs, removeSub } from "../../../functions/sub";
import { getCategories } from "../../../functions/category";
import CategoryForm from "../../../components/forms/CategoryForm";
import Loading from "../../../asset/loading.gif";
import LocalSearch from "../../../components/forms/LocalSearch";

const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subs, setSubs] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, [loading]);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSubs = () => getSubs().then((s) => setSubs(s.data));

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    createSub({ name, parent: category }, user.token)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setName("");
        toast.success(`"${name}" is created`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setName("");
        toast.error(err.response.data);
      });
  };

  const handleRemove = async (slug) => {
    if (window.confirm("Click OK to delete !!")) {
      setLoading(true);
      removeSub(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error(`${res.data.name} deleted successfully`);
        })
        .catch((err) => {
          if (err.response.status === 400) toast.error(err.response.data);
        });
    }
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <img src={Loading} alt="loading" height="70px" width="200px" />
          ) : (
            <h4>Create Sub Category</h4>
          )}
          <br />
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Please Select</option>
              {categories &&
                categories.map((c) => (
                  <option value={c._id} key={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <br />
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />

          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {subs &&
            subs.filter(searched(keyword)).map((c) => (
              <div className="alert alert-secondary" key={c._id}>
                {c.name}
                <span
                  onClick={() => handleRemove(c.slug)}
                  className="btn btn-sm float-right"
                >
                  <DeleteOutlined className="text-danger" />
                </span>
                <Link to={`/admin/sub/${c.slug}`}>
                  <span className="btn btn-sm float-right">
                    <EditOutlined className="text-warning" />
                  </span>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SubCreate;
