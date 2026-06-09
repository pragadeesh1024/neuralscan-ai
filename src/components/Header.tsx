import React from 'react';
import { Activity, Brain, Server, Shield, Layers, HelpCircle, History } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiMode: 'live' | 'demo';
  setApiMode: (mode: 'live' | 'demo') => void;
  isConnected: boolean;
  isConnecting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  apiMode,
  setApiMode,
  isConnected,
  isConnecting,
}) => {
  return (
    <header className="glass-card" style={{ padding: '1.25rem 2rem', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', marginBottom: '1.5rem', borderTop: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px -3px hsl(var(--primary) / 0.5)'
          }}>
            <Brain size={28} color="#05070c" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '0.05em', background: 'linear-gradient(to right, #ffffff, hsl(var(--primary)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="glow-text-primary">
              NEURALSCAN AI
            </h1>
            <p style={{ fontSize: '0.75rem', margin: 0, color: 'hsl(var(--text-muted))', letterSpacing: '0.1em', fontWeight: 600 }}>
              CNN-POWERED MRI DIAGNOSTIC PORTAL
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'portal', label: 'Scan Portal', icon: <Layers size={16} /> },
            { id: 'dictionary', label: 'Clinical Dictionary', icon: <HelpCircle size={16} /> },
            { id: 'history', label: 'Diagnostics History', icon: <History size={16} /> },
            { id: 'dashboard', label: 'Analytics Dashboard', icon: <Activity size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                boxShadow: activeTab === tab.id ? '0 4px 10px hsl(var(--primary) / 0.2)' : 'none',
                background: activeTab === tab.id ? undefined : 'transparent',
                border: activeTab === tab.id ? undefined : '1px solid transparent'
              }}
            >
              {tab.icon}
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* API Connection & Mode Status Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: 'hsl(var(--bg-dark))', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border-color))' }}>
            <button
              onClick={() => setApiMode('live')}
              className="btn"
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                borderRadius: 'calc(var(--radius-sm) - 2px)',
                background: apiMode === 'live' ? 'hsl(var(--bg-card))' : 'transparent',
                border: 'none',
                color: apiMode === 'live' ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                fontWeight: 600
              }}
            >
              Live HF API
            </button>
            <button
              onClick={() => setApiMode('demo')}
              className="btn"
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                borderRadius: 'calc(var(--radius-sm) - 2px)',
                background: apiMode === 'demo' ? 'hsl(var(--bg-card))' : 'transparent',
                border: 'none',
                color: apiMode === 'demo' ? 'hsl(var(--warning))' : 'hsl(var(--text-muted))',
                fontWeight: 600
              }}
            >
              Demo Simulation
            </button>
          </div>

          {/* Connection Status Badge */}
          {apiMode === 'live' ? (
            <div className={`badge ${isConnected ? 'badge-success' : 'badge-danger'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.85rem' }}>
              <Server size={12} />
              <span>
                {isConnecting ? 'CONNECTING...' : isConnected ? 'API ONLINE' : 'API OFFLINE'}
              </span>
            </div>
          ) : (
            <div className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.85rem', background: 'hsl(var(--warning) / 0.1)', color: 'hsl(var(--warning))', border: '1px solid hsl(var(--warning) / 0.3)' }}>
              <Shield size={12} />
              <span>SIMULATOR</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
