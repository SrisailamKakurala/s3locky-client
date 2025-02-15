import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { isAuthenticated, setIsAuthenticated, setUser, setShowLogin } = useContext(AuthContext); // ✅ Use global modal state

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <header className="body-font text-white h-[10%]">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <span className="ml-3 text-3xl text-white"><span className="text-orange-500">s3</span>Locky</span>
        </Link>

        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          {isAuthenticated && (
            <>
              <Link to="/" className="mr-5 cursor-pointer">Home</Link>
              <Link to="/myfiles" className="mr-5 cursor-pointer">My Files</Link>
            </>
          )}
        </nav>

        {isAuthenticated ? (
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        ) : (
          <button onClick={() => setShowLogin(true)} className="bg-orange-500 px-3 py-1 rounded">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
