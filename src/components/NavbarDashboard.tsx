import React from 'react'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NavbarDashboard: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    // Get userEmail from localStorage
    const userEmail = localStorage.getItem('userEmail');

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to the root page
    };

    const renderUserIconAndName = () => {
        if (userEmail === 'reiidev@gmail.com') {
            return (
                <>
                    <i className="bi bi-person-fill-slash"></i> GUEST
                </>
            );
        } else if (userEmail === 'revanspstudy28@gmail.com') {
            return (
                <>
                    <i className="bi bi-patch-check-fill"></i> REIIV
                </>
            );
        }
        return (
            <>
                <i className="bi bi-person-fill"></i> UNKNOWN USER
            </>
        );
    };

    return (
        <div className="navbar bg-base-300 w-full border-b-2 border-neutral-content">
            <div className="flex-none">
                <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-6 w-6 stroke-current">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
            </div>
            <div className="mx-2 flex-1 px-2 font-bold">BOOKVERSE</div>
            <div className="dropdown dropdown-end mr-3">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-base-100 border-2 border-neutral-content rounded btn-sm"
                >
                    {renderUserIconAndName()}
                </div>
                <ul tabIndex={0} className="dropdown-content menu-xs bg-base-100 mt-2 border-2 border-neutral-content rounded-box z-[1] p-2 shadow">
                    <li>
                        <button className="btn btn-ghost btn-xs w-full" onClick={handleLogout}>
                            LOGOUT
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NavbarDashboard;
