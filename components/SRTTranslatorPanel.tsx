
import React, { useState, useMemo } from 'react';
import { translateSRT } from '../services/geminiService';

const SRTTranslatorPanel: React.FC = () => {
  const [srtText, setSrtText] = useState('');
  const [language, setLanguage] = useState('Burmese');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'srt' | 'plain'>('srt');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSrtText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleTranslate = async () => {
    if (!srtText) return;
    setLoading(true);
    setResult(null);
    try {
      const translated = await translateSRT(srtText, language);
      setResult(translated);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stripTimestamps = (text: string): string => {
    // Regex to remove SRT indices and timestamp lines
    // 1. Remove sequence numbers (digits alone on a line)
    // 2. Remove timestamp lines (00:00:00,000 --> 00:00:00,000)
    // 3. Clean up extra whitespace
    return text
      .replace(/^\d+$/gm, '') // Remove digits on a line by themselves
      .replace(/^\d{2}:\d{2}:\d{2},\d{3}.*-->.*$/gm, '') // Remove timestamp lines
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  };

  const plainTextResult = useMemo(() => {
    if (!result) return '';
    return stripTimestamps(result);
  }, [result]);

  const downloadResult = () => {
    if (!result) return;
    const content = viewMode === 'srt' ? result : plainTextResult;
    const extension = viewMode === 'srt' ? 'srt' : 'txt';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translated_${language}_${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const content = viewMode === 'srt' ? result : plainTextResult;
    if (content) {
      navigator.clipboard.writeText(content);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold mb-2 text-indigo-400">SRT Translator</h2>
        <p className="text-slate-400">Translate subtitle files while keeping original timestamps intact. Convert to plain text script with one click.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">Input SRT Content</label>
              <input type="file" accept=".srt" id="srt-upload" className="hidden" onChange={handleFileUpload} />
              <label htmlFor="srt-upload" className="text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-indigo-600/30 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload File
              </label>
            </div>
            <textarea
              value={srtText}
              onChange={(e) => setSrtText(e.target.value)}
              placeholder="Paste SRT content here or upload a file..."
              className="w-full h-80 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-indigo-500 transition-colors resize-none"
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              >
                <option>Burmese</option>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>Chinese</option>
                <option>Japanese</option>
                <option>Thai</option>
                <option>Vietnamese</option>
                <option>Korean</option>
                <option>German</option>
              </select>
              <button
                onClick={handleTranslate}
                disabled={!srtText || loading}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Translating...
                  </>
                ) : 'Translate SRT'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass h-full min-h-[400px] rounded-2xl flex flex-col p-6 space-y-4 shadow-2xl relative overflow-hidden">
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="block text-sm font-medium text-slate-300">Translated Result</label>
                {result && (
                  <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setViewMode('srt')}
                      className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${viewMode === 'srt' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      SRT
                    </button>
                    <button
                      onClick={() => setViewMode('plain')}
                      className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${viewMode === 'plain' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      TEXT
                    </button>
                  </div>
                )}
              </div>
              {result && (
                <button 
                  onClick={copyToClipboard}
                  className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy {viewMode === 'srt' ? 'SRT' : 'Plain Text'}
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800 p-4 font-mono text-[11px] overflow-y-auto whitespace-pre-wrap transition-all">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center animate-pulse text-slate-500 space-y-4">
                   <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                   <p>Translating to {language}...</p>
                </div>
              ) : result ? (
                viewMode === 'srt' ? result : plainTextResult
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-center px-4">
                  Input your SRT and click Translate to see the result here.
                </div>
              )}
            </div>

            {result && !loading && (
              <button 
                onClick={downloadResult} 
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-2xl flex items-center justify-center gap-3 group animate-in slide-in-from-bottom-2 ${
                  viewMode === 'srt' 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                }`}
              >
                <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download {viewMode === 'srt' ? 'SRT' : 'Text Script'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRTTranslatorPanel;
