
import React, { useState } from 'react';
import { AppTab } from './types';
import TranscribePanel from './components/TranscribePanel';
import TranslatePanel from './components/TranslatePanel';
import SRTTranslatorPanel from './components/SRTTranslatorPanel';
import ViralHooksPanel from './components/ViralHooksPanel';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.TRANSCRIBE);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="sticky top-0 z-50 glass border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CreatorFlow <span className="text-indigo-400">AI</span></h1>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
            {[
              { id: AppTab.TRANSCRIBE, label: 'Transcribe', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4' },
              { id: AppTab.TRANSLATE, label: 'Translate', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 7.31 16.208 2 18' },
              { id: AppTab.SRT_TRANSLATOR, label: 'SRT', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
              { id: AppTab.HOOKS, label: 'Hooks', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="transition-opacity duration-300">
          {activeTab === AppTab.TRANSCRIBE && <TranscribePanel />}
          {activeTab === AppTab.TRANSLATE && <TranslatePanel />}
          {activeTab === AppTab.SRT_TRANSLATOR && <SRTTranslatorPanel />}
          {activeTab === AppTab.HOOKS && <ViralHooksPanel />}
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm">© 2024 CreatorFlow AI.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
