import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';

const mangaLinks = [
  { href: "#MANGA", label: "MANGA" },
  { href: "#MANHUA", label: "MANHUA" },
  { href: "#MANHWA", label: "MANHWA" },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
    setIsLoggedIn(!!email);
  }, []);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      const modal = document.getElementById('login') as HTMLDialogElement;
      if (modal) {
        modal.showModal();
      }
    }
  };

  const renderUserLabel = () => {
    if (userEmail === 'revanspstudy28@gmail.com') {
      return (
        <>
          <i className="bi bi-patch-check-fill"></i> REIIV
        </>
      );
    }
    if (userEmail === 'reiidev@gmail.com') {
      return (
        <>
          <i className="bi bi-person-fill-slash"></i> GUEST
        </>
      );
    }
    return null; // Return null if no matching email
  };

  return (
    <div className="navbar bg-base-300 border-b-2 border-neutral-content fixed top-0 left-0 right-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-xs border-2 border-neutral-content rounded mt-4 dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl"
          >
            <li>
              {mangaLinks.map((link, index) => (
                <a key={index} className="text-base font-bold" href={link.href}>
                  <i className="fa-solid fa-book"></i>&nbsp;{link.label}
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-lg">BOOKVERSE</a>
      </div>
      <div className="navbar-end">
        {isLoggedIn ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-sm border-2 border-neutral-content btn-base-100 mr-2">
              {renderUserLabel()}
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 border-2 border-neutral-content rounded-box z-[1] w-32 p-2 shadow mt-6">
              <li><Link to="/dashboard" className="text-xs font-bold">DASHBOARD</Link></li>
            </ul>
          </div>
        ) : (
          <button
            className="btn btn-ghost mr-2"
            onClick={handleAuthAction}
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            <span className="hidden md:inline">&nbsp;&nbsp;LOGIN</span>
          </button>
        )}
      </div>
      {!isLoggedIn && <Login />}
    </div>
  );
};

export default Navbar;
