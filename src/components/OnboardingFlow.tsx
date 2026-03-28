import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Store, 
  MapPin, 
  Package, 
  ArrowRight, 
  Check, 
  Loader2, 
  ChevronLeft,
  Sparkles,
  Plus,
  Trash2,
  X,
  Info,
  Lightbulb,
  Shield
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { auth, db } from '../firebase';
import { 
  signInAnonymously 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc,
  getDocFromServer
} from 'firebase/firestore';
import { Tooltip, TooltipProvider } from './ui/Tooltip';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.operationType) {
          errorMessage = `Firestore Error: Failed to ${parsed.operationType} at ${parsed.path}. Please check your permissions.`;
        }
      } catch (e) {
        errorMessage = this.state.error.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-red-50">
          <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-red-100 text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-[2rem] flex items-center justify-center text-red-600 mx-auto">
              <X size={40} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter">System Error</h2>
            <p className="text-text-secondary font-medium leading-relaxed">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-red-200"
            >
              Retry Setup
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface InventoryItem {
  id?: string;
  name: string;
  price: number;
  stock: number;
}

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  const steps = [
    { id: 1, label: 'Auth' },
    { id: 2, label: 'Profile' },
    { id: 3, label: 'Inventory' },
    { id: 4, label: 'Done' }
  ];

  return (
    <div className="w-full max-w-md mb-12">
      <div className="flex justify-between items-center relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-10" />
        <motion.div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary-green -translate-y-1/2 -z-10"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <motion.div 
              initial={false}
              animate={{ 
                backgroundColor: currentStep >= step.id ? '#006D44' : '#F3F4F6',
                scale: currentStep === step.id ? 1.2 : 1,
                color: currentStep >= step.id ? '#FFFFFF' : '#9CA3AF'
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm"
            >
              {currentStep > step.id ? <Check size={14} strokeWidth={4} /> : step.id}
            </motion.div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= step.id ? 'text-primary-green' : 'text-text-muted'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const HelpfulTip = ({ icon: Icon, title, content }: { icon: any, title: string, content: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-accent-green/30 border border-primary-green/10 p-4 rounded-2xl flex gap-3 items-start mt-8"
  >
    <div className="w-8 h-8 bg-primary-green/10 rounded-xl flex items-center justify-center text-primary-green shrink-0">
      <Icon size={16} />
    </div>
    <div>
      <h4 className="text-xs font-black uppercase tracking-widest text-primary-green mb-1">{title}</h4>
      <p className="text-xs font-medium text-text-secondary leading-relaxed">{content}</p>
    </div>
  </motion.div>
);

const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Pharmacy');
  const [location, setLocation] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Step 1: Phone Auth Simulation
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // We use anonymous sign-in as a placeholder for real phone auth
      // to satisfy Firestore security rules which require an authenticated user.
      await signInAnonymously(auth);
      setStep(2);
    } catch (error) {
      console.error("Auth Error:", error);
      // Fallback: If anonymous auth is disabled, we still proceed to step 2
      // but the user will likely hit permission errors later.
      // In a real app, you must enable Anonymous Auth in Firebase Console.
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Business Profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    generateSmartInventory();
  };

  // Step 3: Smart Inventory (Gemini)
  const generateSmartInventory = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a list of 10 common inventory items for a ${businessType} in Nigeria. 
        Return ONLY a JSON array of objects with "name", "price" (in Naira, as a number), and "stock" (as a number).
        Example: [{"name": "Panadol", "price": 500, "stock": 50}]`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text);
      setInventory(data);
    } catch (error) {
      console.error("Gemini Error:", error);
      // Fallback
      setInventory([
        { name: "Sample Item 1", price: 1000, stock: 10 },
        { name: "Sample Item 2", price: 2000, stock: 20 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    setLoading(true);
    const userId = auth.currentUser?.uid || "demo_user";
    const businessPath = `businesses/${userId}`;
    
    try {
      // Save to Firestore
      const businessRef = doc(db, 'businesses', userId);
      
      const businessData = {
        name: businessName,
        type: businessType,
        location: location,
        phone: phone,
        createdAt: new Date().toISOString()
      };

      await setDoc(businessRef, businessData).catch(e => handleFirestoreError(e, OperationType.WRITE, businessPath));

      // Save inventory
      const inventoryPath = `businesses/${userId}/inventory`;
      for (const item of inventory) {
        await addDoc(collection(db, 'businesses', userId, 'inventory'), item)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, inventoryPath));
      }

      setStep(4);
    } catch (error) {
      console.error("Firestore Error:", error);
      // If it's a Firestore error we already handled, it will be caught by ErrorBoundary
      if (error instanceof Error && error.message.startsWith('{')) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Progress Bar Header */}
      {step < 4 && <ProgressBar currentStep={step} totalSteps={4} />}

      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-green/10 rounded-[2rem] flex items-center justify-center text-primary-green mx-auto mb-6">
                  <Phone size={40} />
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-2">Welcome to NEXA</h2>
                <p className="text-text-secondary font-medium">Enter your phone number to get started.</p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="relative">
                  <Tooltip content="We'll send a verification code to this number" side="right">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-text-muted">+234</span>
                  </Tooltip>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="803 000 0000"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] py-6 pl-20 pr-6 font-bold text-lg focus:border-primary-green outline-none transition-all"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-primary-green text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary-green/20 hover:bg-dark-green transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
                </button>
              </form>

              <HelpfulTip 
                icon={Shield} 
                title="Secure Access" 
                content="We use your phone number to keep your store data safe and secure. No passwords to remember!" 
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-[2rem] flex items-center justify-center text-blue-600 mx-auto mb-6">
                  <Store size={40} />
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-2">Business Profile</h2>
                <p className="text-text-secondary font-medium">Tell us about your shop.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-4">Business Name</label>
                  <input 
                    type="text" 
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Mama T's Pharmacy"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] py-6 px-8 font-bold text-lg focus:border-primary-green outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-4">Business Type</label>
                  <Tooltip content="This helps us generate the right inventory for you" side="right">
                    <select 
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] py-6 px-8 font-bold text-lg focus:border-primary-green outline-none transition-all appearance-none"
                    >
                      <option>Pharmacy</option>
                      <option>Supermarket</option>
                      <option>Boutique</option>
                      <option>Wholesaler</option>
                    </select>
                  </Tooltip>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-4">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input 
                      type="text" 
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Lekki, Lagos"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] py-6 pl-14 pr-8 font-bold text-lg focus:border-primary-green outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  className="w-full bg-primary-green text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary-green/20 hover:bg-dark-green transition-all flex items-center justify-center gap-3"
                >
                  Next Step <ArrowRight size={20} />
                </button>
              </form>

              <HelpfulTip 
                icon={Lightbulb} 
                title="Pro Tip" 
                content="Choose the correct business type so our AI can generate the most relevant items for your initial stock." 
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-[2rem] flex items-center justify-center text-purple-600 mx-auto mb-6">
                  <Sparkles size={40} />
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-2">Smart Inventory</h2>
                <p className="text-text-secondary font-medium">We've generated a starter list for your {businessType}.</p>
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 no-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-primary-green" size={40} />
                    <p className="font-bold text-text-muted animate-pulse">AI is thinking...</p>
                  </div>
                ) : (
                  inventory.map((item, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={i} 
                      className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className="text-sm text-text-muted font-bold">₦{item.price.toLocaleString()} • {item.stock} in stock</p>
                      </div>
                      <button className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-xl">
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="flex gap-4">
                <Tooltip content="Get a different list of items">
                  <button 
                    onClick={() => generateSmartInventory()}
                    className="flex-1 bg-gray-100 text-text-primary py-6 rounded-[2rem] font-black text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                  >
                    Regenerate
                  </button>
                </Tooltip>
                <Tooltip content="Save your store profile and start selling">
                  <button 
                    onClick={handleFinalize}
                    disabled={loading}
                    className="flex-[2] bg-primary-green text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary-green/20 hover:bg-dark-green transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <>Finish Setup <Check size={20} /></>}
                  </button>
                </Tooltip>
              </div>

              <HelpfulTip 
                icon={Info} 
                title="Inventory Setup" 
                content="Don't worry if the list isn't perfect. You can add, edit, or remove items anytime from your dashboard." 
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-10"
            >
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-32 h-32 bg-primary-green rounded-[3rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-primary-green/40"
                >
                  <Check size={64} strokeWidth={4} />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary-green/20 rounded-full -z-10"
                />
              </div>

              <div>
                <h2 className="text-5xl font-black tracking-tighter mb-4">You're all set!</h2>
                <p className="text-xl text-text-secondary font-medium leading-relaxed">
                  Welcome to the future of retail, <span className="text-primary-green font-black">{businessName}</span>. Your store is ready for its first sale.
                </p>
              </div>

              <button 
                onClick={onComplete}
                className="w-full bg-primary-green text-white py-8 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-primary-green/30 hover:bg-dark-green transition-all hover:-translate-y-2 flex items-center justify-center gap-4 group"
              >
                Go to Dashboard
                <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const OnboardingFlowWrapper = (props: any) => (
  <TooltipProvider>
    <ErrorBoundary>
      <OnboardingFlow {...props} />
    </ErrorBoundary>
  </TooltipProvider>
);

export default OnboardingFlowWrapper;
