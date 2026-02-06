import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/users").then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>User Management</h1>

      {users.map(u => (
        <div key={u._id} style={{
          background: "white",
          padding: 15,
          marginTop: 10,
          borderRadius: 8
        }}>
          <b>{u.name}</b><br />
          {u.email}<br />
          Role: {u.role}
        </div>
      ))}
    </div>
  );
}
