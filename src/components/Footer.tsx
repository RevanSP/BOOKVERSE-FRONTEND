import React from 'react';

const socialMediaLinks = [
    {
        href: "https://github.com/RevanSP",
        label: "Github",
        iconClass: "fa-brands fa-github"
    },
    {
        href: "https://www.instagram.com/m9nokuro",
        label: "Instagram",
        iconClass: "fa-brands fa-instagram"
    },
    {
        href: "https://web.facebook.com/profile.php?id=100082958149027&_rdc=1&_rdr",
        label: "Facebook",
        iconClass: "fa-brands fa-facebook"
    },
];

const navLinks = [
    { href: "#MANGA", label: "MANGA" },
    { href: "#MANHUA", label: "MANHUA" },
    { href: "#MANHWA", label: "MANHWA" },
];

const Footer: React.FC = () => {
    // Get current pathname
    const currentPath = location.pathname;

    // Check if current path is one of the specified dashboard routes
    const isDashboardPath = 
        currentPath === '/dashboard' || 
        currentPath === '/manga-tab' || 
        currentPath === '/manhua-tab' || 
        currentPath === '/manhwa-tab';

    return (
        <footer className="footer footer-center bg-base-300 border-t-2 border-neutral-content text-base-content p-10">
            {!isDashboardPath && (
                <nav className="grid grid-flow-col gap-4">
                    {navLinks.map((link, index) => (
                        <a key={index} className="link link-hover" href={link.href}>
                            {link.label}
                        </a>
                    ))}
                </nav>
            )}
            <nav>
                <div className="grid grid-flow-col gap-8">
                    {socialMediaLinks.map((link, index) => (
                        <a key={index} href={link.href} aria-label={link.label}>
                            <i className={`text-4xl ${link.iconClass}`}></i>
                        </a>
                    ))}
                </div>
            </nav>
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All rights reserved by ReiivanTheOnlyOne.</p>
            </aside>
        </footer>
    );
};

export default Footer;
