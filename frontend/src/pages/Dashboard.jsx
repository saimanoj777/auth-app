import { useNavigate } from "react-router-dom";

export default function Dashboard({ setLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column bg-light" style={{ minHeight: "100vh", width: "100vw" }}>
      {/* ✅ Full Width Navbar */}
      <nav className="navbar navbar-dark bg-dark px-3 w-100">
        <span className="navbar-brand fw-bold">AuthApp</span>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* ✅ Fullscreen Content */}
      <div className="d-flex flex-grow-1 justify-content-center align-items-center text-center w-100">
        <div>
          <h1 className="mb-3">🎉 Welcome to the Dashboard</h1>
          <p className="lead">You are now successfully logged in.</p>
        </div>
      </div>
    </div>
  );
}
