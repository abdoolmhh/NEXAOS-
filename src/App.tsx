/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Check } from 'lucide-react';
import { db } from './firebase';
import { doc, getDocFromServer } from 'firebase/firestore';
import LandingPage from './components/LandingPage';
import OnboardingFlow from './components/OnboardingFlow';

export default function App() {
  const [view, setView] = useState<'landing' | 'onboarding' | 'dashboard'>('landing');

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    };
    testConnection();

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  if (view === 'onboarding') {
    return <OnboardingFlow onComplete={() => setView('dashboard')} />;
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full glass p-12 rounded-[4rem] text-center space-y-8 shadow-2xl border-white/60">
          <div className="w-24 h-24 bg-primary-green/10 rounded-[2.5rem] flex items-center justify-center text-primary-green mx-auto">
            <Check size={48} />
          </div>
          <h2 className="text-4xl font-black tracking-tighter">Dashboard Ready</h2>
          <p className="text-xl text-text-secondary font-medium">Your store is live! This is where you'll manage your sales and inventory.</p>
          <button 
            onClick={() => setView('landing')}
            className="w-full bg-primary-green text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary-green/20 hover:bg-dark-green transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <LandingPage onStart={() => setView('onboarding')} />;
}
