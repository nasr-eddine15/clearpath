import axios from "axios";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    axios
      .get("/")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err.message));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("myFile", file, fileName);
    formData.append("string", e.target.string.value);
    formData.append("integer", e.target.integer.value);
    axios.get("/");
    try {
      const { data } = await axios
        .post("/api/uploadForm", formData, {
          withCredentials: true,
        })
        .then((res) => console.log(res.data));
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  return (
    <div>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <label className="form-label">String</label>
        <input
          type="text"
          className="text-box col-75"
          name="string"
          placeholder="enter string"
        ></input>
        <label className="form-label">Integer</label>
        <input
          type="number"
          className="text-box col-75"
          name="integer"
          placeholder="enter integer"
        ></input>
        <label className="form-label">File</label>
        <input
          className="col-75 file-input"
          type="file"
          name="myFile"
          onChange={saveFile}
        />
        <button className="add-button" type="submit">
          Upload file
        </button>
      </form>
    </div>
  );
};

export default HomePage;
