import { useNavigate, useLocation } from 'react-router-dom';
import svgPaths from "../imports/svg-ehqfngk4m7";
import imgLogo from "@/assets/4e4c69b485dd9b664de85d746a262f9fc0b006fe.png";

// Re-using simplified versions of footer components from LandingPage
export interface FooterProps {
    onNavigateToSignUp?: () => void;
    onNavigateToLanding?: () => void;
    isFirebaseConnected?: boolean;
}

export default function Footer({ onNavigateToSignUp, onNavigateToLanding, isFirebaseConnected }: FooterProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const handleSignUp = onNavigateToSignUp || (() => navigate('/signup'));
    const handleLanding = onNavigateToLanding || (() => navigate('/'));

    return (
        <div className="bg-[#e8dcc8] content-stretch flex flex-col items-center pb-[32px] pt-[64px] px-[24px] md:px-[64px] relative shrink-0 w-full border-t border-[#d4c8b7]" data-name="Footer">
            <style>{`
                .footer-grid-layout {
                    display: grid;
                    grid-template-columns: repeat(1, minmax(0, 1fr));
                }
                @media (min-width: 640px) {
                    .footer-grid-layout {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }
                @media (min-width: 1024px) {
                    .footer-grid-layout {
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                    }
                }
            `}</style>
            <div className="w-full max-w-[1312px] footer-grid-layout gap-[32px] md:gap-[48px] mb-[48px]">
                {/* Company Info */}
                <div className="flex flex-col gap-[20px] md:gap-[24px]">
                    <div className="flex items-center gap-[8px] cursor-pointer" onClick={handleLanding}>
                        <img src={imgLogo} alt="Logo" className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]" />
                        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[20px] md:text-[24px] text-[#6b4f3f]">Smartfitao</span>
                    </div>
                    <p className="text-[#5a6c57] text-[14px] md:text-[16px] leading-[1.6]">
                        Smartfitao — Digital Tailoring for Modern Traditions. Experience authentic craftsmanship meets cutting-edge technology.
                    </p>
                    <div className="flex gap-[12px]">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] bg-white rounded-[10px] flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                <svg className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" fill="none" viewBox="0 0 20 20">
                                    <path d={i === 1 ? svgPaths.p4b98700 : i === 2 ? svgPaths.p30c8d680 : svgPaths.pbd44000} stroke="#2D5F3F" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-[16px]">
                    <h4 className="text-[#2d5f3f] font-semibold text-[15px] md:text-[16px]">Quick Links</h4>
                    <ul className="flex flex-col gap-[10px] md:gap-[12px] text-[#5a6c57] text-[14px] md:text-[15px]">
                        <li className="cursor-pointer hover:text-[#2d5f3f]" onClick={handleLanding}>Home</li>
                        <li className="cursor-pointer hover:text-[#2d5f3f]" onClick={() => navigate('/product')}>Marketplace</li>
                        <li className="cursor-pointer hover:text-[#2d5f3f]" onClick={() => navigate('/discovery')}>Tailors</li>
                        <li className="cursor-pointer hover:text-[#2d5f3f]">About</li>
                        <li className="cursor-pointer hover:text-[#2d5f3f]">Contact</li>
                    </ul>
                </div>

                {/* Account */}
                <div className="flex flex-col gap-[16px]">
                    <h4 className="text-[#2d5f3f] font-semibold text-[15px] md:text-[16px]">Account</h4>
                    <ul className="flex flex-col gap-[10px] md:gap-[12px] text-[#5a6c57] text-[14px] md:text-[15px]">
                        <li className="cursor-pointer hover:text-[#2d5f3f]">Login</li>
                        <li className="cursor-pointer hover:text-[#2d5f3f]" onClick={handleSignUp}>Sign Up</li>
                        <li className="cursor-pointer hover:text-[#2d5f3f]">My Orders</li>
                        <li className="cursor-pointer hover:text-[#2d5f3f]">Profile</li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="flex flex-col gap-[16px]">
                    <h4 className="text-[#2d5f3f] font-semibold text-[15px] md:text-[16px]">Newsletter</h4>
                    <p className="text-[#5a6c57] text-[14px] md:text-[15px]">Subscribe for updates and exclusive offers.</p>
                    <div className="flex flex-col gap-[12px]">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full px-[16px] py-[10px] bg-white border border-[#1f2933] rounded-[10px] outline-none text-[14px]"
                        />
                        <button className="bg-[#2d5f3f] text-white py-[10px] rounded-[10px] hover:bg-[#1e402a] transition-colors text-[14px] font-medium">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="w-full max-w-[1312px] pt-[24px] border-t border-[#d4c8b7] flex flex-col md:flex-row justify-between items-center gap-[16px]">
                <div className="flex flex-col gap-1">
                    <p className="text-[#5a6c57] text-[14px] md:text-[16px] text-center md:text-left">© 2024 Smartfitao. All rights reserved.</p>
                    <p className="text-[12px] text-[#5a6c57]/80">Firebase connected: {isFirebaseConnected ? 'yes' : 'no'}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-[16px] md:gap-[24px] text-[#5a6c57] text-[14px] md:text-[15px]">
                    <span className="cursor-pointer hover:text-[#2d5f3f]">Privacy Policy</span>
                    <span className="cursor-pointer hover:text-[#2d5f3f]">Terms of Service</span>
                    <span className="cursor-pointer hover:text-[#2d5f3f]">Shipping Info</span>
                </div>
            </div>
        </div>
    );
}
