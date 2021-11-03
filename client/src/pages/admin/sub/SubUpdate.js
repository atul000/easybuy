import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { updateSub, getSub } from "../../../functions/sub";
import { getCategories } from "../../../functions/category";
import CategoryForm from "../../../components/forms/CategoryForm";
import Loading from "../../../asset/loading.gif";

const SubUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState("");

  useEffect(() => {
    loadCategories();
    loadSub();
  }, [loading]);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSub = () =>
    getSub(match.params.slug).then((s) => {
      setName(s.data.name);
      setParent(s.data.parent);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateSub(match.params.slug, { name, parent }, user.token)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setName("");
        toast.success(`"${name}" is updated`);
        history.push("/admin/sub");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setName("");
        if (err.response.status === 401)
          toast.error("Expired Token. Pls, login again");
        toast.error(err.response.data);
      });
  };

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
            <h4>Update Sub Category</h4>
          )}
          <br />
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setParent(e.target.value)}
            >
              <option>Please Select</option>
              {categories &&
                categories.map((c) => (
                  <option value={c._id} key={c._id} selected={c._id === parent}>
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
        </div>
      </div>
    </div>
  );
};

export default SubUpdate;
