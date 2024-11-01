import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState(import.meta.env.VITE_GUEST_EMAIL);
    const [password, setPassword] = useState(import.meta.env.VITE_GUEST_PASSWORD);
    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState({ visible: false, type: '' });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const validCredentials: Record<string, { password: string; role: string }> = {
            [import.meta.env.VITE_GUEST_EMAIL]: { password: import.meta.env.VITE_GUEST_PASSWORD, role: import.meta.env.VITE_GUEST_ROLE },
            [import.meta.env.VITE_DEV_EMAIL]: { password: import.meta.env.VITE_DEV_PASSWORD, role: import.meta.env.VITE_DEV_ROLE },
        };

        if (validCredentials[email] && validCredentials[email].password === password) {
            login(email, validCredentials[email].role);
            localStorage.setItem('userEmail', email);
            setShowToast({ visible: true, type: 'success' });

            setTimeout(() => {
                setShowToast({ visible: false, type: '' });
                navigate('/dashboard');
            }, 1500);
        } else {
            setShowToast({ visible: true, type: 'error' }); 
            setTimeout(() => setShowToast({ visible: false, type: '' }), 3000); 
        }
    };

    return (
        <dialog id="login" className="modal">
            <div className="modal-box border-2 border-neutral-content rounded">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <form onSubmit={handleLogin}>
                    <h3 className="font-bold text-lg text-center mb-5">LOGIN</h3>
                    <div className="flex justify-center items-center">
                        <div className="avatar">
                            <div className="w-32 rounded">
                                <img src="/favicon.png" alt="Avatar" />
                            </div>
                        </div>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-bordered w-full input-sm rounded border-2 border-neutral-content bg-base-300"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input input-bordered input-sm rounded border-2 border-neutral-content w-full bg-base-300"
                                placeholder="Enter your password" maxLength={8}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1"
                            >
                                <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-wide w-full btn-sm mt-4 mb-3 border-2 rounded border-neutral-content btn-base-300"
                    >
                        LOGIN
                    </button>
                </form>
            </div>
            {showToast.visible && (
                <div
                    className={`toast toast-center transition-opacity duration-1000 ${showToast.visible ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <div className={`alert ${showToast.type === 'success' ? 'alert-base-100' : 'alert-base-100'} border-2 border-neutral-content rounded text-center`}>
                        <span>
                            <i className={`fa-solid ${showToast.type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}`}></i>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {showToast.type === 'success' ? 'Login successful!' : 'Invalid email or password.'}
                        </span>
                    </div>
                </div>
            )}
        </dialog>
    );
};

export default Login;
