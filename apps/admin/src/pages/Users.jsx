import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import "../App.css";


export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => setUsers(res.data.users))
      .catch(console.error);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Users</h2>

        <table>
          <thead>
            <tr>
              <th>Phone</th>
              <th>Name</th>
              <th>Shop</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.phone}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.shopName}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}