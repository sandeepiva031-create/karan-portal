import React, { useState } from 'react';
import { 
  Search, ShieldAlert, CheckCircle2, Clock, FileText, 
  HelpCircle, AlertTriangle, ExternalLink, RefreshCw, Layers
} from 'lucide-react';

export default function App() {
  const [appId, setAppId] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  
  // AI State
  const [schemeName, setSchemeName] = useState('PM-Kisan Samman Nidhi');
  const [rejectionReason, setRejectionReason] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  // Sample Database
  const mockDb = {
    'PMK123456': { scheme: 'PM-Kisan Samman Nidhi', status: 'Approved', step: 4, msg: '16th Installment Credited via Aadhaar DBT.' },
    'KCC987654': { scheme: 'Kisan Credit Card', status: 'Rejected', step: 2, msg: 'Land Seeding Status is NO. Revenue verification failed.' },
    'PMF554433': { scheme: 'PM Fasal Bima Yojana', status: 'In Progress', step: 3, msg: 'Claim processing at District Agriculture Officer level.' }
  };

  const handleTrack = () => {
    if (!appId.trim()) return;
    const result = mockDb[appId.trim().toUpperCase()];
    if (result) {
      setStatusResult(result);
    } else {
      setStatusResult({ status: 'Not Found', msg: 'Application Reference ID record me nahi mila.' });
    }
  };

  const handleAIDiagnose = async () => {
    if (!rejectionReason.trim()) return;
    setAiLoading(true);
    setAiResponse('');

    try {
      const res = await fetch('http://localhost:5000/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemeName, rejectionReason })
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.analysis);
      } else {
        setAiResponse(`Error: ${data.error}`);
      }
    } catch (err) {
      setAiResponse('Backend Server (Port 5000) se connection check karein. Make sure node server.js running ho.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950 font-bold">🌾</div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-emerald-400">KARAN PORTAL</h1>
              <p className="text-xs text-slate-400">Government Application Action & Rejection Fix Network</p>
            </div>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-medium">
            Ollama Gemma Local AI Active
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* Section 1: Tracker */}
        <section className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-semibold">
            <Search className="w-5 h-5" />
            <h2>Live Application Status Tracker</h2>
          </div>
          
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Application Reference ID (Try: PMK123456, KCC987654, PMF554433)"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition"
            />
            <button 
              onClick={handleTrack}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold px-6 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              Check Status
            </button>
          </div>

          {/* Track Result output */}
          {statusResult && (
            <div className="mt-6 p-5 rounded-xl border bg-slate-900/60 border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-slate-300">{statusResult.scheme || 'System Query'}</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  statusResult.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                  statusResult.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {statusResult.status}
                </span>
              </div>
              <p className="text-sm text-slate-400">{statusResult.msg}</p>
            </div>
          )}
        </section>

        {/* Section 2: AI Rejection Assistant */}
        <section className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 text-indigo-400 font-semibold">
            <ShieldAlert className="w-5 h-5" />
            <h2>Smart AI Rejection & Fix Assistant (Gemma 4 Powered)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Government Scheme</label>
              <select 
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="PM-Kisan Samman Nidhi">PM-Kisan Samman Nidhi</option>
                <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC)</option>
                <option value="PM Fasal Bima Yojana">PM Fasal Bima Yojana</option>
                <option value="Scholarship Portal Status">UP/National Scholarship Portal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Rejection Reason / Error Message</label>
              <input 
                type="text" 
                placeholder="e.g. Land Seeding No, NPCI Inactive, Name Mismatch"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button 
            onClick={handleAIDiagnose}
            disabled={aiLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {aiLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Diagnose & Generate Action Plan'}
          </button>

          {aiResponse && (
            <div className="mt-6 p-5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl">
              <h3 className="text-sm font-semibold text-indigo-300 mb-2">💡 AI Action Resolution Guide:</h3>
              <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {aiResponse}
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}