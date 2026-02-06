import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Activities() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/activities").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h1>Activities</h1>

      {data.map(a => (
        <div key={a._id} style={{
          background: "white",
          padding: 20,
          marginTop: 10,
          borderRadius: 10
        }}>
          <b>{a.name}</b>
          <p>{a.category}</p>
        </div>
      ))}
    </div>
  );
}
