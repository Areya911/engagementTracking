import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get(`/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!user) return <h2>Loading profile...</h2>;

  return (
    <div style={{ padding: 30 }}>
      <h1>User Profile</h1>

      <div style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        marginTop: 20
      }}>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Department: {user.department || "General"}</p>
      </div>
    </div>
  );
}
