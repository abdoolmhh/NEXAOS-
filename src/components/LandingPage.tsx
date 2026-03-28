import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  ArrowRight, 
  Check, 
  Zap, 
  Shield, 
  Smartphone, 
  BarChart3, 
  Users, 
  MessageSquare, 
  ShoppingBag, 
  Package,
  Clock,
  ChevronRight,
  Star,
  Menu,
  X,
  Play,
  ArrowUpRight,
  Printer,
  CheckCircle2,
  TrendingUp,
  LayoutGrid,
  User
} from 'lucide-react';
import { Tooltip, TooltipProvider } from './ui/Tooltip';
import MobileApp from './MobileApp';
import Background3D from './Background3D';
import ChatWidget from './ChatWidget';

// --- Scroll Progress Bar ---
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-primary-green z-[200] origin-left"
      style={{ scaleX }}
    />
  );
};

// --- Dual Screen POS Mockup ---
const DualScreenPOS = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    }, 2000);
  };

  return (
    <motion.div 
      className="relative w-full max-w-[550px] aspect-square flex items-center justify-center perspective-2000 scale-[0.65] xs:scale-[0.8] sm:scale-100"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* 3D Rotating Container */}
      <motion.div 
        className="relative w-full h-full preserve-3d"
        animate={{ 
          rotateY: [-15, 15, -15],
          rotateX: [5, -5, 5]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {/* Main POS Stand / Base */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* The Neck/Stand */}
          <div className="w-32 h-64 bg-zinc-800 rounded-b-[4rem] shadow-2xl relative border-x border-zinc-700/50">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-700/20 to-transparent" />
            
            {/* Base Plate */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-zinc-900 rounded-full shadow-2xl border-t border-zinc-700/30" />
            
            {/* Receipt Slot Detail */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-2 bg-black rounded-full border-t border-zinc-600/50 shadow-inner" />
            
            {/* Animated Receipt Printing */}
            <motion.div 
              className="absolute top-8 left-1/2 -translate-x-1/2 w-24 bg-white shadow-2xl p-3 origin-top z-0"
              initial={{ height: 0, opacity: 0 }}
              animate={isSuccess ? { 
                height: [0, 100, 100, 0], 
                opacity: [0, 1, 1, 0],
                y: [0, 5, 5, 0]
              } : { height: 0, opacity: 0 }}
              transition={{ 
                duration: 6, 
                ease: "easeInOut"
              }}
            >
              <div className="flex flex-col gap-1">
                <div className="w-full h-1 bg-gray-100 rounded-full" />
                <div className="w-4/5 h-1 bg-gray-100 rounded-full" />
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1" />
                <div className="flex justify-between items-center mt-2">
                  <div className="w-4 h-4 bg-primary-green/10 rounded-sm" />
                  <div className="w-8 h-2 bg-primary-green/30 rounded-full" />
                </div>
                <div className="w-full h-0.5 bg-gray-50 mt-2 border-t border-dashed border-gray-200" />
                <div className="text-[4px] font-bold text-gray-300 mt-1">THANK YOU FOR SHOPPING</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Store Facing Screen (Large - Front) */}
        <motion.div 
          className="absolute top-4 left-1/2 -translate-x-1/2 w-[420px] h-[280px] bg-zinc-900 rounded-[2rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[6px] border-zinc-800 z-20 overflow-hidden"
          initial={{ z: 60, rotateX: -10 }}
          animate={{ z: 60, rotateX: -10 }}
        >
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative flex flex-col shadow-inner">
            {/* POS Software UI */}
            <div className="bg-zinc-900 px-4 py-2.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-primary-green rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="text-[10px] font-black text-white tracking-tighter">NEXA StoreOS</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                  <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                </div>
                <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center">
                  <User size={10} className="text-zinc-500" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 grid grid-cols-12 gap-4 bg-gray-50">
              {/* Product Grid */}
              <div className="col-span-8 grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-2 shadow-sm hover:border-primary-green/20 transition-colors">
                    <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                      <img src={`https://picsum.photos/seed/pos${i}/100/100`} alt="Product" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    </div>
                    <div className="w-3/4 h-2 bg-gray-200 rounded-full mb-1.5" />
                    <div className="w-1/2 h-2 bg-primary-green/10 rounded-full" />
                  </div>
                ))}
              </div>
              
              {/* Checkout Sidebar */}
              <div className="col-span-4 bg-white border border-gray-100 rounded-xl p-3 flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #452</span>
                  <div className="w-4 h-4 bg-gray-100 rounded-full" />
                </div>
                <div className="flex-1 space-y-2.5">
                  {[1, 2].map(i => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="w-12 h-1.5 bg-gray-200 rounded" />
                        <div className="w-8 h-1 bg-gray-100 rounded" />
                      </div>
                      <div className="w-6 h-1.5 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[8px] font-bold text-gray-400">TOTAL</span>
                    <span className="text-sm font-black text-primary-green tracking-tighter">₦12,500.00</span>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheckout}
                    disabled={isCheckingOut || isSuccess}
                    className={`w-full h-10 rounded-xl flex items-center justify-center text-[10px] text-white font-black tracking-widest shadow-lg transition-all ${
                      isCheckingOut ? 'bg-zinc-400' : isSuccess ? 'bg-blue-500' : 'bg-primary-green shadow-primary-green/20'
                    }`}
                  >
                    {isCheckingOut ? 'PROCESSING...' : isSuccess ? 'COMPLETED' : 'COMPLETE SALE'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Customer Facing Screen (Small - Back) */}
        <motion.div 
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-zinc-900 rounded-[1.5rem] p-2.5 shadow-2xl border-[5px] border-zinc-800 z-10 overflow-hidden"
          initial={{ z: -80, rotateX: 15, rotateY: 180 }}
          animate={{ z: -80, rotateX: 15, rotateY: 180 }}
        >
          <div className="w-full h-full bg-zinc-950 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-green/20 to-transparent" />
            
            <AnimatePresence mode="wait">
              {!isCheckingOut && !isSuccess && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">Welcome to NEXA</p>
                  <h3 className="text-2xl font-black tracking-tighter mb-4">Ready for Checkout</h3>
                  <div className="w-12 h-12 bg-white/5 rounded-full mx-auto flex items-center justify-center">
                    <Smartphone size={20} className="text-zinc-700" />
                  </div>
                </motion.div>
              )}

              {isCheckingOut && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 border-2 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-green">Processing Payment</p>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <motion.div 
                    className="w-16 h-16 bg-primary-green/20 rounded-full mb-4 flex items-center justify-center border border-primary-green/30 mx-auto"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      boxShadow: ["0 0 0px rgba(0,109,68,0)", "0 0 20px rgba(0,109,68,0.4)", "0 0 0px rgba(0,109,68,0)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle2 size={32} className="text-primary-green" />
                  </motion.div>
                  
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-green mb-1">Payment Successful</p>
                  <h3 className="text-3xl font-black tracking-tighter mb-4">₦12,500</h3>
                  
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary-green"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Status Badge */}
      <motion.div 
        className="absolute -top-16 -right-8 glass p-5 rounded-[2rem] shadow-2xl z-40 border-white/40"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-green rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-green/20">
            {isSuccess ? <Check size={24} /> : <Printer size={24} className="animate-pulse" />}
          </div>
          <div>
            <p className="text-[10px] font-black text-primary-green uppercase tracking-widest mb-0.5">Status</p>
            <p className="text-sm font-bold text-text-primary">{isSuccess ? 'Receipt Issued' : isCheckingOut ? 'Processing...' : 'System Ready'}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Decorative Elements */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-green/10 blur-[100px] rounded-full -z-10" />
    </motion.div>
  );
};

// --- Navbar ---
const Navbar = ({ onStart }: { onStart: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md py-3 shadow-sm border-b' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-green/20 group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight">
            NEXA <span className="text-primary-green">StoreOS</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-primary-green transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Tooltip content="Start your 14-day free trial now">
            <button 
              onClick={onStart}
              className="bg-primary-green text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary-green/20 hover:bg-dark-green transition-all hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </Tooltip>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-[90] md:hidden bg-white/95 backdrop-blur-xl pt-24 px-6"
            >
              <div className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <motion.a 
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-black text-text-primary tracking-tighter hover:text-primary-green transition-colors"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onStart();
                  }}
                  className="bg-primary-green text-white w-full py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary-green/20"
                >
                  Get Started Free
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
  );
};

// --- Hero Section ---
const Hero = ({ onStart }: { onStart: () => void }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-48 overflow-hidden">
      <Background3D />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-green/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="rv">
            <div className="inline-flex items-center gap-3 bg-accent-green text-primary-green px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-sm border border-primary-green/10">
              <span className="w-2 h-2 bg-primary-green rounded-full animate-ping" />
              Built for Nigerian Retailers
            </div>
            
            <h1 className="text-6xl lg:text-[9rem] font-black leading-[0.9] mb-10 tracking-tighter">
              The OS for <br />
              <span className="green-grad">Modern Retail.</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-text-secondary leading-relaxed mb-12 max-w-xl font-medium opacity-80">
              Transform your shop with NEXA. Manage inventory, track sales, and delight customers with our dual-screen POS and mobile app.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-16">
              <Tooltip content="No credit card required to start">
                <button 
                  onClick={onStart}
                  className="bg-primary-green text-white px-8 sm:px-12 py-4 sm:py-6 rounded-[2rem] font-black text-base sm:text-lg shadow-[0_25px_50px_-12px_rgba(0,109,68,0.4)] hover:bg-dark-green transition-all hover:-translate-y-1.5 flex items-center justify-center gap-3 group"
                >
                  Get Started Free
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Tooltip>
              <Tooltip content="Watch a 2-minute product walkthrough">
                <button className="bg-white/40 backdrop-blur-md px-8 sm:px-12 py-4 sm:py-6 rounded-[2rem] font-black text-base sm:text-lg hover:bg-white/60 transition-all flex items-center justify-center gap-3 border border-white/60 shadow-xl">
                  <div className="w-8 h-8 sm:w-10 h-10 bg-primary-green/20 rounded-full flex items-center justify-center text-primary-green">
                    <Play size={18} fill="currentColor" />
                  </div>
                  Watch Demo
                </button>
              </Tooltip>
            </div>
            
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -8, zIndex: 10, scale: 1.1 }}
                    className="w-12 h-12 sm:w-14 h-14 rounded-2xl border-4 border-white bg-gray-200 overflow-hidden shadow-2xl transform transition-all cursor-pointer"
                  >
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </motion.div>
                ))}
              </div>
              <div>
                <div className="flex gap-1 mb-1.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={18} fill="#F59E0B" stroke="none" />)}
                </div>
                <p className="text-sm text-text-secondary font-black tracking-tight">Trusted by 5,000+ shop owners</p>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col lg:block items-center justify-center lg:h-[600px] mt-10 lg:mt-0">
            {/* Main Dual Screen POS Mockup */}
            <div className="relative z-10 w-full flex justify-center transform lg:translate-x-16 lg:scale-110">
              <DualScreenPOS />
            </div>
            
            {/* Secondary Mobile Mockup - Reduced Size */}
            <motion.div 
              className="relative lg:absolute -mt-20 lg:mt-0 lg:-bottom-20 lg:-left-32 z-20 scale-[0.8] sm:scale-90 lg:scale-110 perspective-2000"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div 
                className="preserve-3d"
                animate={{ 
                  rotateY: [-10, 10, -10],
                  rotateX: [5, -5, 5],
                  y: [0, -15, 0]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <div className="relative">
                  <MobileApp />
                  {/* Floating Notification on Mobile */}
                  <motion.div 
                    animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-6 -right-6 glass p-3 rounded-2xl shadow-2xl border-white/50 z-30"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                        <Package size={14} />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest">Low Stock Alert</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Stats Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-10 glass p-6 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] z-30 hidden xl:block border-white/60"
            >
              <div className="flex items-center gap-5 mb-4">
                <div className="w-14 h-14 bg-primary-green/10 rounded-2xl flex items-center justify-center text-primary-green shadow-inner border border-primary-green/10">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">Growth</p>
                  <p className="text-2xl font-black tracking-tighter">+45.8%</p>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-primary-green" 
                />
              </div>
            </motion.div>
            
            {/* Decorative Orbitals */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-[500px] h-[500px] border border-primary-green/10 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="w-[700px] h-[700px] border border-primary-green/5 rounded-full animate-[spin_30s_linear_infinite_reverse] absolute" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Features Section ---
const Features = () => {
  const features = [
    {
      title: "Fast Point of Sale",
      description: "Complete sales in seconds with minimum taps. Works offline and syncs when you're back online.",
      icon: <Zap />,
      color: "bg-green-100 text-primary-green",
      delay: "d1"
    },
    {
      title: "Real-time Inventory",
      description: "Track stock levels across all products. Get notified before you run out of your best-sellers.",
      icon: <Package />,
      color: "bg-blue-100 text-blue-600",
      delay: "d2"
    },
    {
      title: "Digital Receipts",
      description: "Generate professional receipts instantly. Share via WhatsApp or SMS without extra effort.",
      icon: <Smartphone />,
      color: "bg-purple-100 text-purple-600",
      delay: "d3"
    },
    {
      title: "Customer Insights",
      description: "Capture customer data automatically. Identify your most loyal shoppers and grow retention.",
      icon: <Users />,
      color: "bg-orange-100 text-orange-600",
      delay: "d4"
    },
    {
      title: "Smart Reordering",
      description: "Proactive reorder alerts based on your sales trends. Never miss a sale due to stock-outs.",
      icon: <Clock />,
      color: "bg-red-100 text-red-600",
      delay: "d5"
    },
    {
      title: "Business Reports",
      description: "See daily revenue, profit margins, and stock health on a single, easy-to-read dashboard.",
      icon: <BarChart3 />,
      color: "bg-indigo-100 text-indigo-600",
      delay: "d6"
    }
  ];

  return (
    <section id="features" className="py-24 lg:py-40 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-green/5 blur-[150px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24 rv">
          <div className="inline-block px-4 py-1.5 bg-accent-green text-primary-green rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Powerful Modules
          </div>
          <h2 className="text-5xl lg:text-8xl font-black mb-8 tracking-tighter leading-none">
            Built to <span className="green-grad">Scale.</span>
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed font-medium">
            NEXA is built specifically for the Nigerian market, addressing the unique challenges of local retail businesses with world-class technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature) => (
            <motion.div 
              key={feature.title}
              whileHover={{ y: -15, scale: 1.02 }}
              className={`p-10 sm:p-12 rounded-[3rem] sm:rounded-[4rem] isometric-card glass border-white/60 transition-all hover:shadow-[0_40px_80px_-15px_rgba(0,109,68,0.15)] group rv ${feature.delay}`}
            >
              <div className={`w-20 h-20 sm:w-24 h-24 ${feature.color} rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center mb-10 sm:mb-12 group-hover:scale-110 transition-transform shadow-xl shadow-current/10 relative`}>
                <div className="absolute inset-0 bg-current opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity" />
                {React.cloneElement(feature.icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 32, strokeWidth: 2.5 })}
              </div>
              <h3 className="text-3xl sm:text-4xl font-black mb-6 tracking-tighter leading-tight">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed text-lg sm:text-xl font-medium opacity-70">
                {feature.description}
              </p>
              
              <div className="mt-12 pt-10 border-t border-black/5 flex items-center justify-between lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:translate-y-4 lg:group-hover:translate-y-0">
                <span className="text-sm font-black text-primary-green uppercase tracking-[0.2em]">Explore Module</span>
                <div className="w-12 h-12 bg-primary-green text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-green/20">
                  <ArrowUpRight size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- How It Works ---
const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Quick Sign-up",
      description: "Register with your phone number and verify with OTP. No complex forms."
    },
    {
      number: "02",
      title: "Tailored Setup",
      description: "Select your business type (Pharmacy, Supermarket, etc.) for a tailored setup."
    },
    {
      number: "03",
      title: "Smart Inventory",
      description: "Use our AI starter list or import from Excel to get your inventory ready in minutes."
    },
    {
      number: "04",
      title: "Start Selling",
      description: "Open the POS, record your first sale, and watch your business grow smarter."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-40 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,109,68,0.03)_0%,transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <div className="rv-l">
            <div className="inline-block px-4 py-1.5 bg-primary-green/10 text-primary-green rounded-full text-xs font-black uppercase tracking-widest mb-8">
              Seamless Onboarding
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-[1.1]">
              From sign-up to first sale in <span className="text-primary-green">10 minutes.</span>
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed mb-16 font-medium opacity-80">
              We've removed the technical hurdles so you can focus on what matters most — serving your customers and increasing your profit.
            </p>
            
            <div className="space-y-12">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-8 group">
                  <div className="text-5xl font-black text-primary-green/10 font-display group-hover:text-primary-green/30 transition-colors">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-3 tracking-tight group-hover:text-primary-green transition-colors">{step.title}</h3>
                    <p className="text-lg text-text-secondary leading-relaxed font-medium opacity-70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative rv-r">
            <div className="glass p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-white/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div>
                  <h4 className="font-black text-2xl tracking-tighter">Onboarding</h4>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Smart Progress</p>
                </div>
                <div className="w-16 h-16 bg-primary-green/10 rounded-2xl flex items-center justify-center text-primary-green font-black text-xl relative overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: "75%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 bg-primary-green/20"
                  />
                  <span className="relative z-10">75%</span>
                </div>
              </div>
              
              <div className="space-y-8 relative z-10">
                {[
                  { label: "Account Verification", done: true },
                  { label: "Business Profile", done: true },
                  { label: "Inventory Setup", done: true },
                  { label: "Staff Management", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group cursor-default">
                    <motion.div 
                      initial={item.done ? { scale: 1 } : { scale: 0.8 }}
                      animate={item.done ? { scale: 1 } : { scale: 1 }}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        item.done ? 'bg-primary-green text-white shadow-lg shadow-primary-green/20' : 'bg-gray-100 text-text-muted border border-gray-200'
                      }`}
                    >
                      {item.done ? <Check size={20} strokeWidth={4} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                    </motion.div>
                    <span className={`text-lg font-bold tracking-tight ${item.done ? 'text-text-primary' : 'text-text-muted'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 p-6 bg-primary-green/5 rounded-3xl border border-primary-green/10 relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-primary-green uppercase tracking-widest">Next Step</span>
                  <span className="text-[10px] font-bold text-text-secondary">2 mins left</span>
                </div>
                <p className="text-sm font-bold text-text-primary mb-6">Invite your store manager to start tracking sales together.</p>
                <button className="w-full bg-primary-green text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-primary-green/30 hover:bg-dark-green transition-all hover:-translate-y-1">
                  Complete Setup
                </button>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Pricing ---
const Pricing = ({ onStart }: { onStart: () => void }) => {
  const plans = [
    {
      name: "Starter",
      price: "0",
      description: "Perfect for small kiosks and new shops.",
      features: [
        "1 Staff User",
        "50 Products",
        "100 Sales per month",
        "Basic Digital Receipts",
        "Reorder Alerts"
      ],
      cta: "Get Started Free",
      popular: false,
      delay: "d1"
    },
    {
      name: "Growth",
      price: "4,900",
      description: "Ideal for growing pharmacies and supermarkets.",
      features: [
        "3 Staff Users",
        "Unlimited Products",
        "Unlimited Sales",
        "WhatsApp Receipts",
        "Auto Thank-you SMS",
        "Excel Data Import"
      ],
      cta: "Start 30-Day Trial",
      popular: true,
      delay: "d2"
    },
    {
      name: "Pro",
      price: "9,900",
      description: "For busy stores with multiple staff members.",
      features: [
        "10 Staff Users",
        "All Growth Features",
        "Priority Support",
        "Advanced Reports",
        "Bulk SMS Campaigns",
        "Dedicated Manager"
      ],
      cta: "Contact Sales",
      popular: false,
      delay: "d3"
    }
  ];

  return (
    <section id="pricing" className="py-24 lg:py-40 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,rgba(0,109,68,0.02)_0%,transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24 rv">
          <div className="inline-block px-4 py-1.5 bg-primary-green/10 text-primary-green rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Flexible Plans
          </div>
          <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter leading-none">
            Simple pricing for <span className="text-primary-green">every stage.</span>
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed font-medium opacity-80">
            No hidden fees. No long-term contracts. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {plans.map((plan) => (
            <motion.div 
              key={plan.name}
              whileHover={{ y: -10 }}
              className={`p-10 sm:p-12 rounded-[3rem] sm:rounded-[4rem] glass border transition-all relative rv ${plan.delay} ${
                plan.popular ? 'border-primary-green shadow-[0_40px_100px_-15px_rgba(0,109,68,0.2)] scale-105 z-10 bg-white' : 'border-white/60 hover:border-primary-green/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-green text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-primary-green/40 flex items-center gap-2 whitespace-nowrap">
                  <Star size={12} fill="currentColor" />
                  Most Popular
                  <Star size={12} fill="currentColor" />
                </div>
              )}
              <div className="mb-10">
                <h3 className="text-2xl font-black mb-4 tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter">₦{plan.price}</span>
                  <span className="text-text-secondary font-bold text-lg">/mo</span>
                </div>
                <p className="text-base text-text-secondary mt-6 font-medium opacity-70 leading-relaxed">{plan.description}</p>
              </div>
              
              <div className="space-y-5 mb-12">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-primary-green/10 rounded-lg flex items-center justify-center text-primary-green">
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span className="text-base font-bold text-text-primary tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Tooltip content={plan.popular ? "Our most popular choice for growing shops" : `Get started with the ${plan.name} plan`}>
                <button 
                  onClick={onStart}
                  className={`w-full py-6 rounded-3xl font-black text-sm tracking-widest transition-all ${
                    plan.popular ? 'bg-primary-green text-white shadow-2xl shadow-primary-green/30 hover:bg-dark-green' : 'bg-white border-2 border-gray-100 text-text-primary hover:border-primary-green hover:text-primary-green'
                  }`}
                >
                  {plan.cta.toUpperCase()}
                </button>
              </Tooltip>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Showcase Section ---
const Showcase = () => {
  const stories = [
    {
      name: "Mama T's Pharmacy",
      location: "Lekki, Lagos",
      stat: "₦1.2M Monthly Revenue",
      image: "https://picsum.photos/seed/shop1/400/300",
      quote: "NEXA changed how we track drugs. No more expired stock."
    },
    {
      name: "Green Grocers",
      location: "Wuse, Abuja",
      stat: "45% Profit Growth",
      image: "https://picsum.photos/seed/shop2/400/300",
      quote: "The inventory alerts are a lifesaver. We never run out of milk."
    },
    {
      name: "Trendy Boutique",
      location: "Port Harcourt",
      stat: "200+ Loyal Customers",
      image: "https://picsum.photos/seed/shop3/400/300",
      quote: "Digital receipts via WhatsApp? My customers love it!"
    },
    {
      name: "Super Save Mart",
      location: "Ibadan",
      stat: "3 Staff Managed",
      image: "https://picsum.photos/seed/shop4/400/300",
      quote: "I can monitor my shop from home. Peace of mind at last."
    }
  ];

  return (
    <section className="py-24 lg:py-40 bg-gray-50 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(0,109,68,0.05)_0%,transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 mb-16 rv flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="inline-block px-4 py-1.5 bg-primary-green/10 text-primary-green rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Success Stories
          </div>
          <h2 className="text-5xl lg:text-8xl font-black mb-8 tracking-tighter leading-none">
            Real stories from <br /><span className="text-primary-green">real owners.</span>
          </h2>
          <p className="text-xl text-text-secondary font-medium opacity-80">
            See how NEXA StoreOS is transforming retail across Nigeria.
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-text-muted">
          <span className="text-[10px] font-black uppercase tracking-widest">Scroll to explore</span>
          <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              animate={{ x: [-48, 48] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-primary-green"
            />
          </div>
        </div>
      </div>

      <div className="side-scroll px-6 lg:px-[calc((100vw-1280px)/2+24px)]">
        {stories.map((story) => (
          <motion.div 
            key={story.name}
            className="w-[340px] md:w-[450px] glass rounded-[4rem] overflow-hidden isometric-card border-white/60 shadow-2xl relative group"
          >
            <div className="h-64 overflow-hidden relative">
              <img 
                src={story.image} 
                alt={story.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">{story.location}</p>
                <h4 className="text-2xl font-black tracking-tight">{story.name}</h4>
              </div>
            </div>
            <div className="p-10">
              <div className="inline-flex items-center gap-3 bg-primary-green/10 text-primary-green px-4 py-2 rounded-2xl text-xs font-black mb-8">
                <BarChart3 size={16} />
                {story.stat}
              </div>
              <p className="text-text-secondary italic leading-relaxed mb-10 text-lg font-medium opacity-80">
                "{story.quote}"
              </p>
              <div className="flex items-center gap-3 text-primary-green font-black text-sm group-hover:gap-5 transition-all cursor-pointer uppercase tracking-widest">
                Read full case study <ArrowRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- CTA Section ---
const CTA = ({ onStart }: { onStart: () => void }) => {
  return (
    <section className="py-24 lg:py-48 relative overflow-hidden">
      <div className="absolute inset-0 liquid-bg -z-10 opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 -z-10" />
      
      <div className="max-w-5xl mx-auto px-6 text-center text-white rv">
        <h2 className="text-5xl lg:text-[10rem] font-black mb-12 tracking-tighter leading-[0.85]">
          Ready to <br />modernize?
        </h2>
        <p className="text-xl lg:text-3xl mb-16 font-medium opacity-90 max-w-2xl mx-auto leading-relaxed tracking-tight">
          Join thousands of Nigerian retailers who are growing their business with NEXA StoreOS.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Tooltip content="Join the retail revolution today">
            <button 
              aria-label="Get Started Now"
              onClick={onStart}
              className="bg-white text-primary-green px-12 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-gray-100 transition-all hover:-translate-y-1.5 flex items-center justify-center gap-3 group"
            >
              Get Started Now
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </Tooltip>
          <Tooltip content="Talk to our team about custom enterprise solutions">
            <button 
              aria-label="Contact Sales"
              className="bg-transparent border-2 border-white/40 backdrop-blur-md px-12 py-6 rounded-[2.5rem] font-black text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              Contact Sales
            </button>
          </Tooltip>
        </div>
        
        <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-60">
          {['No Credit Card Required', 'Cancel Anytime', '24/7 Local Support'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Footer ---
const Footer = () => {
  return (
    <footer className="bg-text-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center text-white font-bold text-xl">
                N
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight">
                NEXA <span className="text-primary-green">StoreOS</span>
              </span>
            </div>
            <p className="text-text-muted leading-relaxed max-w-sm mb-8">
              The retail management system built specifically for Nigerian shop owners. Empowering local businesses with modern tools.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  aria-label={`Follow us on ${social}`}
                  className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-primary-green hover:scale-110 transition-all cursor-pointer group"
                >
                  <div className="w-5 h-5 bg-white/20 rounded-sm group-hover:bg-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-text-muted text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Businesses</h4>
            <ul className="space-y-4 text-text-muted text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Pharmacies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Supermarkets</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Boutiques</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Wholesalers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-text-muted text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-text-muted text-sm">
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Email</span>
                <a href="mailto:NexaOfficial.Ng@Gmall.com" className="hover:text-white transition-colors font-medium">NexaOfficial.Ng@Gmall.com</a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Phone</span>
                <a href="tel:09038026109" className="hover:text-white transition-colors font-medium">09038026109</a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Hours</span>
                <span className="font-medium">Mon - Sat, 8am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-text-muted">
          <p>© 2026 NEXA StoreOS by Doplals Technologies. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Built for Nigeria 🇳🇬
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.rv, .rv-l, .rv-r');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <TooltipProvider>
      <div className="bg-white">
        <ScrollProgress />
        <Navbar onStart={onStart} />
        <Hero onStart={onStart} />
        <Features />
        <HowItWorks />
        <Pricing onStart={onStart} />
        <Showcase />
        <CTA onStart={onStart} />
        <Footer />
        <ChatWidget />
      </div>
    </TooltipProvider>
  );
}
