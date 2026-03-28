import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  User, 
  ShoppingCart, 
  Home, 
  Package, 
  BarChart3, 
  Search, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Check, 
  X,
  Smartphone,
  Zap,
  CreditCard,
  Banknote,
  History,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  Settings,
  LogOut,
  FileText,
  Shield,
  Printer
} from 'lucide-react';

// --- Types ---
type Role = 'Admin' | 'Manager' | 'Cashier';
type Screen = 'role-selection' | 'dashboard' | 'pos' | 'inventory' | 'success';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Pharmacy', price: 250, stock: 42, unit: 'Strip', image: 'https://picsum.photos/seed/med1/200/200' },
  { id: '2', name: 'Vitamin C 1000mg', category: 'Pharmacy', price: 1200, stock: 8, unit: 'Bottle', image: 'https://picsum.photos/seed/med2/200/200' },
  { id: '3', name: 'Rice 5kg', category: 'Supermarket', price: 8500, stock: 15, unit: 'Bag', image: 'https://picsum.photos/seed/food1/200/200' },
  { id: '4', name: 'Milo 400g', category: 'Supermarket', price: 2500, stock: 12, unit: 'Tin', image: 'https://picsum.photos/seed/food2/200/200' },
  { id: '5', name: 'Peak Milk 170g', category: 'Supermarket', price: 450, stock: 34, unit: 'Tin', image: 'https://picsum.photos/seed/food3/200/200' },
  { id: '6', name: 'ORS Sachet', category: 'Pharmacy', price: 150, stock: 0, unit: 'Sachet', image: 'https://picsum.photos/seed/med3/200/200' },
];

export default function MobileApp() {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('role-selection');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastSale, setLastSale] = useState<{ items: CartItem[], total: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    // Update stock levels
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(item => item.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    }));

    setLastSale({ items: [...cart], total });
    setCart([]);
    setCurrentScreen('success');
  };

  const handleRoleSelect = (role: Role) => {
    setUserRole(role);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="w-[280px] h-[580px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative border-[8px] border-gray-900 font-sans text-text-primary">
      {/* Status Bar */}
      <div className="h-6 bg-white px-6 flex items-center justify-between text-[10px] font-bold">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-3 h-2 bg-black rounded-sm" />
          <div className="w-3 h-2 bg-black rounded-sm" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentScreen === 'role-selection' && (
          <RoleSelectionScreen key="role-selection" onSelect={handleRoleSelect} />
        )}
        {currentScreen === 'dashboard' && (
          <DashboardScreen 
            key="dashboard" 
            role={userRole}
            products={products}
            onNewSale={() => setCurrentScreen('pos')} 
            onInventory={() => setCurrentScreen('inventory')} 
          />
        )}
        {currentScreen === 'pos' && (
          <POSScreen 
            key="pos" 
            products={products}
            cart={cart} 
            addToCart={addToCart} 
            updateQuantity={updateQuantity} 
            total={total} 
            onBack={() => setCurrentScreen('dashboard')} 
            onCheckout={handleCheckout}
          />
        )}
        {currentScreen === 'inventory' && (
          <InventoryScreen 
            key="inventory" 
            products={products} 
            onUpdateProduct={updateProduct}
            onBack={() => setCurrentScreen('dashboard')} 
          />
        )}
        {currentScreen === 'success' && (
          <SuccessScreen 
            key="success" 
            saleData={lastSale}
            onDone={() => setCurrentScreen('dashboard')} 
          />
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      {currentScreen !== 'role-selection' && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-4 pb-2">
          <NavIcon icon={<Home size={20} />} active={currentScreen === 'dashboard'} onClick={() => setCurrentScreen('dashboard')} />
          <NavIcon icon={<ShoppingCart size={20} />} active={currentScreen === 'pos'} onClick={() => setCurrentScreen('pos')} />
          {(userRole === 'Admin' || userRole === 'Manager') && (
            <NavIcon icon={<Package size={20} />} active={currentScreen === 'inventory'} onClick={() => setCurrentScreen('inventory')} />
          )}
          <NavIcon icon={<BarChart3 size={20} />} />
        </div>
      )}
    </div>
  );
}

function RoleSelectionScreen({ onSelect }: { onSelect: (role: Role) => void }) {
  const roles: { type: Role, icon: React.ReactNode, desc: string }[] = [
    { type: 'Admin', icon: <Shield size={24} />, desc: 'Full system access & management' },
    { type: 'Manager', icon: <Settings size={24} />, desc: 'Inventory & sales oversight' },
    { type: 'Cashier', icon: <ShoppingCart size={24} />, desc: 'Point of Sale operations only' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-gray-50 p-6 flex flex-col justify-center"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black tracking-tighter">Select Role</h2>
        <p className="text-xs text-text-secondary">Choose your access level</p>
      </div>

      <div className="space-y-4">
        {roles.map((r) => (
          <button 
            key={r.type}
            onClick={() => onSelect(r.type)}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-left active:scale-95 transition-all"
          >
            <div className="w-12 h-12 bg-primary-green/10 rounded-xl flex items-center justify-center text-primary-green">
              {r.icon}
            </div>
            <div>
              <h4 className="text-sm font-black">{r.type}</h4>
              <p className="text-[10px] text-text-secondary">{r.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function NavIcon({ icon, active, onClick }: { icon: React.ReactNode, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 transition-colors ${active ? 'text-primary-green' : 'text-text-muted'}`}
    >
      {icon}
      {active && <div className="w-1 h-1 bg-primary-green rounded-full mx-auto mt-0.5" />}
    </button>
  );
}

function DashboardScreen({ role, products, onNewSale, onInventory }: { role: Role | null, products: Product[], onNewSale: () => void, onInventory: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-gray-50 p-5 pb-20 overflow-y-auto no-scrollbar"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-extrabold">Emeka's Shop</h2>
          <p className="text-[10px] text-text-secondary">{role} Access • Lagos</p>
        </div>
        <div className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center text-white">
          <User size={16} />
        </div>
      </div>

      {/* Revenue Card - Only for Admin/Manager */}
      {(role === 'Admin' || role === 'Manager') && (
        <div className="glass bg-primary-green p-4 rounded-2xl text-white shadow-lg shadow-primary-green/20 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <p className="text-[10px] font-medium opacity-80 uppercase tracking-wider relative z-10">Today's Revenue</p>
          <h3 className="text-2xl font-black mt-1 relative z-10">₦142,500</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] font-bold bg-white/20 w-fit px-2 py-0.5 rounded-full relative z-10">
            <Zap size={10} fill="currentColor" />
            +12% vs yesterday
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={onNewSale} className="glass bg-white/80 p-4 rounded-2xl shadow-sm border border-white/20 flex flex-col items-center gap-2 group active:scale-95 transition-all">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-primary-green group-hover:bg-primary-green group-hover:text-white transition-colors">
            <ShoppingCart size={20} />
          </div>
          <span className="text-xs font-bold">New Sale</span>
        </button>
        {(role === 'Admin' || role === 'Manager') && (
          <button onClick={onInventory} className="glass bg-white/80 p-4 rounded-2xl shadow-sm border border-white/20 flex flex-col items-center gap-2 group active:scale-95 transition-all">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Package size={20} />
            </div>
            <span className="text-xs font-bold">Inventory</span>
          </button>
        )}
      </div>

      {/* Low Stock - Only for Admin/Manager */}
      {(role === 'Admin' || role === 'Manager') && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Low Stock</h4>
            <button className="text-[10px] font-bold text-primary-green">View All</button>
          </div>
          <div className="space-y-2">
            {products.filter(p => p.stock < 15).map(p => (
              <div key={p.id} className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">{p.name[0]}</div>
                  <div>
                    <p className="text-[10px] font-bold">{p.name}</p>
                    <p className="text-[8px] text-text-secondary">{p.stock} {p.unit}s left</p>
                  </div>
                </div>
                {p.stock === 0 ? (
                  <span className="text-[8px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase">Out of Stock</span>
                ) : (
                  <AlertTriangle size={14} className="text-orange-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {role === 'Cashier' && (
        <div className="bg-white p-6 rounded-3xl border border-dashed border-gray-200 text-center">
          <ShoppingCart className="mx-auto text-text-muted mb-2" size={24} />
          <p className="text-[10px] font-bold text-text-muted">Ready to serve customers?</p>
          <button onClick={onNewSale} className="mt-3 text-[10px] font-black text-primary-green uppercase tracking-widest">Start Selling</button>
        </div>
      )}

      {/* Role Specific Tasks */}
      <div className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Your Tasks</h4>
        <div className="space-y-2">
          {role === 'Admin' && (
            <>
              <TaskItem icon={<Shield size={14} />} title="System Audit" status="Required" />
              <TaskItem icon={<User size={14} />} title="User Management" status="2 New" />
            </>
          )}
          {role === 'Manager' && (
            <>
              <TaskItem icon={<Package size={14} />} title="Restock Inventory" status="5 Low" />
              <TaskItem icon={<BarChart3 size={14} />} title="Daily Report" status="Pending" />
            </>
          )}
          {role === 'Cashier' && (
            <>
              <TaskItem icon={<ShoppingCart size={14} />} title="Process Sales" status="Active" />
              <TaskItem icon={<History size={14} />} title="Shift Close" status="5h left" />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TaskItem({ icon, title, status }: { icon: React.ReactNode, title: string, status: string }) {
  return (
    <div className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-primary-green">
          {icon}
        </div>
        <span className="text-[10px] font-bold">{title}</span>
      </div>
      <span className="text-[8px] font-black bg-gray-100 px-2 py-1 rounded-full text-text-muted">{status}</span>
    </div>
  );
}

function POSScreen({ products, cart, addToCart, updateQuantity, total, onBack, onCheckout }: any) {
  const [activeTab, setActiveTab] = useState('All');
  const categories = ['All', 'Pharmacy', 'Supermarket'];

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="h-full bg-white flex flex-col"
    >
      <div className="p-5 pt-8 border-b">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-1 -ml-1"><ArrowLeft size={20} /></button>
          <h2 className="text-sm font-bold">New Sale</h2>
          <div className="w-6" />
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-gray-100 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                activeTab === cat ? 'bg-primary-green text-white' : 'bg-gray-100 text-text-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products.filter(p => activeTab === 'All' || p.category === activeTab).map(p => (
            <button 
              key={p.id}
              onClick={() => addToCart(p)}
              className={`p-3 rounded-2xl border text-left transition-all active:scale-95 relative ${
                p.stock === 0 ? 'opacity-50 grayscale' : 'hover:border-primary-green/30'
              }`}
            >
              <div className="w-full aspect-square bg-gray-50 rounded-xl mb-2 overflow-hidden relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                {p.stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-[8px] font-black text-white uppercase tracking-widest bg-red-600 px-2 py-1 rounded-full">Sold Out</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] font-bold truncate">{p.name}</p>
              <p className="text-[10px] font-black text-primary-green mt-1">₦{p.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="p-5 bg-white border-t pb-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold">{cart.length} Items</span>
              <span className="text-sm font-black text-primary-green">₦{total.toLocaleString()}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-primary-green text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary-green/20 active:scale-95 transition-all"
            >
              Checkout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InventoryScreen({ products, onUpdateProduct, onBack }: { products: Product[], onUpdateProduct: (p: Product) => void, onBack: () => void }) {
  const [editingItem, setEditingItem] = useState<Product | null>(null);

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="h-full bg-white flex flex-col relative"
    >
      <div className="p-5 pt-8 border-b flex items-center justify-between">
        <button onClick={onBack} className="p-1 -ml-1"><ArrowLeft size={20} /></button>
        <h2 className="text-sm font-bold">Inventory</h2>
        <button className="p-1 bg-primary-green text-white rounded-lg"><Plus size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 no-scrollbar pb-20">
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${p.stock === 0 ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
              <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border relative">
                <img src={p.image} alt={p.name} className={`w-full h-full object-cover ${p.stock === 0 ? 'grayscale opacity-50' : ''}`} />
                {p.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[10px] font-bold">{p.name}</h4>
                  {p.stock === 0 && <span className="text-[6px] font-black text-red-500 bg-red-100 px-1 rounded uppercase">Out</span>}
                </div>
                <p className="text-[8px] text-text-secondary">{p.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${p.stock === 0 ? 'bg-red-500' : p.stock < 15 ? 'bg-orange-500' : 'bg-primary-green'}`}
                      style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                    />
                  </div>
                  <span className={`text-[8px] font-bold ${p.stock === 0 ? 'text-red-500' : ''}`}>{p.stock} left</span>
                </div>
              </div>
              <button 
                onClick={() => setEditingItem(p)}
                className="p-2 text-primary-green hover:bg-primary-green/10 rounded-lg transition-colors"
              >
                <Settings size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-[110] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              className="bg-white w-full rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg tracking-tight">Edit Item</h3>
                <button onClick={() => setEditingItem(null)} className="p-2 bg-gray-100 rounded-full">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Item Name</label>
                  <input 
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-sm focus:border-primary-green outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Price (₦)</label>
                    <input 
                      type="number"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-sm focus:border-primary-green outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Stock</label>
                    <input 
                      type="number"
                      value={editingItem.stock}
                      onChange={(e) => setEditingItem({ ...editingItem, stock: Number(e.target.value) })}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-sm focus:border-primary-green outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  onUpdateProduct(editingItem);
                  setEditingItem(null);
                }}
                className="w-full bg-primary-green text-white py-4 rounded-2xl font-black text-sm mt-8 shadow-xl shadow-primary-green/20"
              >
                Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SuccessScreen({ saleData, onDone }: { saleData: any, onDone: () => void }) {
  const [showReceipt, setShowReceipt] = useState(false);

  const generateReceiptText = () => {
    if (!saleData) return "No sale data found.";
    const date = new Date().toLocaleString();
    const items = saleData.items.map((item: any) => 
      `${item.name.padEnd(20)} x${item.quantity} ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    return `
NEXA STORE OS
----------------------------
Date: ${date}
Receipt: TXN-${Date.now().toString().slice(-8)}
----------------------------
ITEMS:
${items}
----------------------------
TOTAL: ₦${saleData.total.toLocaleString()}
----------------------------
Thank you for shopping!
    `.trim();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full bg-white flex flex-col items-center justify-center p-8 text-center relative"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-primary-green mb-6">
        <Check size={40} strokeWidth={3} />
      </div>
      <h2 className="text-xl font-black mb-2">Sale Complete!</h2>
      <p className="text-xs text-text-secondary mb-8">Receipt has been sent to the customer via WhatsApp.</p>
      
      <div className="w-full bg-gray-50 p-4 rounded-2xl mb-4 text-left">
        <div className="flex justify-between mb-2">
          <span className="text-[10px] text-text-muted">Receipt #</span>
          <span className="text-[10px] font-bold">TXN-{Date.now().toString().slice(-8)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-text-muted">Total Paid</span>
          <span className="text-[10px] font-bold text-primary-green">₦{saleData?.total.toLocaleString() || '0'}</span>
        </div>
      </div>

      <button 
        onClick={() => setShowReceipt(true)}
        className="w-full bg-white border-2 border-gray-100 text-text-primary py-3 rounded-xl font-bold text-sm mb-4 flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <Printer size={16} />
        Generate Receipt
      </button>

      <button 
        onClick={onDone}
        className="w-full bg-primary-green text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary-green/20 active:scale-95 transition-all"
      >
        Done
      </button>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceipt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              className="bg-white w-full rounded-3xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-sm">Sale Receipt</h3>
                <button onClick={() => setShowReceipt(false)} className="p-1 bg-gray-100 rounded-full">
                  <X size={16} />
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-xl text-[8px] font-mono text-left whitespace-pre-wrap leading-tight border border-gray-100">
                {generateReceiptText()}
              </pre>
              <button 
                onClick={() => setShowReceipt(false)}
                className="w-full bg-primary-green text-white py-3 rounded-xl font-bold text-sm mt-6"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
