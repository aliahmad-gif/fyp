import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "../contexts/AuthContext";
import { User } from "lucide-react";
import svgPaths from "../imports/svg-ehqfngk4m7";
// Logo placeholder (add 4e4c69b485dd9b664de85d746a262f9fc0b006fe.png to src/assets for real logo)
const imgLogo = "https://placehold.co/42x42/6b4f3f/fff?text=S";

function Company() {
    const navigate = useNavigate();
    return (
        <div
            className="content-stretch flex gap-[8.431px] h-[42.156px] items-center relative shrink-0 w-[176px] cursor-pointer"
            data-name="Company"
            onClick={() => navigate('/')}
        >
            <div className="relative shrink-0 size-[42.156px]" data-name="Logo">
                <img alt="Logomark" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogo} />
            </div>
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#6b4f3f] text-[25.293px] text-nowrap tracking-[-0.5059px]">
                <p className="leading-[1.45]">Smartfitao</p>
            </div>
        </div>
    );
}

function PrimaryButton({ text, onClick }: { text: string; onClick: () => void }) {
    return (
        <motion.button
            className="bg-transparent content-stretch cursor-pointer flex items-center justify-center px-[16px] py-[14px] relative rounded-[10px] shrink-0 border-b-2 border-transparent"
            onClick={onClick}
            whileHover={{
                borderBottomColor: "#111827",
                scale: 1.02
            }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-[#111827] text-nowrap tracking-[-0.09px]">
                <p className="leading-[1.45]">{text}</p>
            </div>
        </motion.button>
    );
}

function HeaderIcons({ onNavigateToCart, onNavigateToChat }: { onNavigateToCart: () => void; onNavigateToChat: () => void }) {
    const { getTotalItems } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);
    const cartCount = getTotalItems();

    return (
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
            <motion.button
                onClick={onNavigateToChat}
                className="relative cursor-pointer text-[#9CA3AF] hover:text-[#111827] transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg className="block size-[24px]" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p261dfb00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M7 11H17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M7 15H13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M7 7H15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
            </motion.button>

            <div className="relative">
                <motion.button
                    onClick={() => isAuthenticated ? setUserMenuOpen((o) => !o) : navigate('/login')}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-100 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <User className="w-6 h-6 shrink-0" />
                    {isAuthenticated && user?.name ? (
                        <span className="max-w-[120px] truncate text-[15px] font-medium text-[#111827]">{user.name}</span>
                    ) : (
                        <span className="text-[15px]">Sign in</span>
                    )}
                </motion.button>
                {userMenuOpen && isAuthenticated && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} aria-hidden />
                        <div className="absolute right-0 top-full mt-1 py-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button
                                className="w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-gray-50"
                                onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}
                            >
                                Profile & edit info
                            </button>
                            <button
                                className="w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-gray-50"
                                onClick={() => { setUserMenuOpen(false); navigate('/cart'); }}
                            >
                                Cart
                            </button>
                            <button
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                onClick={() => { setUserMenuOpen(false); logout(); navigate('/'); }}
                            >
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>

            <motion.button
                onClick={onNavigateToCart}
                className="relative cursor-pointer text-[#9CA3AF] hover:text-[#111827] transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg className="block size-[24px]" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p33c1b680} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d={svgPaths.pd438b00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d={svgPaths.p2fb16300} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                {cartCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                    >
                        {cartCount}
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
}

export interface HeaderProps {
    onNavigateToCart?: () => void;
    onNavigateToChat?: () => void;
    onNavigateToDiscovery?: () => void;
    onNavigateToLogin?: () => void;
    onNavigateToHome?: () => void;
}

export default function Header({
    onNavigateToCart,
    onNavigateToChat,
    onNavigateToDiscovery,
    onNavigateToLogin,
    onNavigateToHome
}: HeaderProps) {
    const navigate = useNavigate();

    const handleCart = onNavigateToCart || (() => navigate('/cart'));
    const handleChat = onNavigateToChat || (() => navigate('/messages'));
    const handleDiscovery = onNavigateToDiscovery || (() => navigate('/discovery'));
    const handleHome = onNavigateToHome || (() => navigate('/'));

    return (
        <header className="relative shrink-0 w-full border-b border-gray-100 bg-white shadow-sm">
            <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center justify-between pl-[24px] sm:pl-[64px] pr-[24px] sm:pr-[42px] py-[20px] sm:py-[32px] relative w-full flex-wrap gap-3">
                    <Company />

                    <nav className="content-center flex flex-wrap gap-2 sm:gap-[24px] items-center justify-center p-0 relative shrink-0">
                        <PrimaryButton text="Home" onClick={handleHome} />
                        <PrimaryButton text="Products" onClick={() => navigate('/product')} />
                        <PrimaryButton text="Tailor" onClick={handleDiscovery} />
                    </nav>

                    <HeaderIcons onNavigateToCart={handleCart} onNavigateToChat={handleChat} />
                </div>
            </div>
        </header>
    );
}
