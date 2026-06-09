import React from 'react';
import { Trash2, Calendar, FileImage, ExternalLink } from 'lucide-react';
import type { PredictionResult } from '../services/GradioService';

export interface HistoryItem {
  id: string;
  name: string;
  thumbnail: string; // Base64 compressed image thumbnail
  result: PredictionResult;
  timestamp: string;
}

interface HistoryTrackerProps {
  history: HistoryItem[];
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const HistoryTracker: React.FC<HistoryTrackerProps> = ({
  history,
  onDeleteItem,
  onClearHistory,
  onSelectHistoryItem,
}) => {
  if (history.length === 0) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'hsl(var(--border-color) / 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          color: 'hsl(var(--text-muted))'
        }}>
          <Calendar size={24} />
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Diagnostic History</h3>
        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', maxWidth: '320px', margin: '0 auto' }}>
          Past predictions you run in this browser session will be stored here in your clinical records.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-slide-up" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Clinical Scan History</h2>
          <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', margin: 0 }}>
            Showing {history.length} logged MRI classifications.
          </p>
        </div>
        <button 
          className="btn" 
          onClick={onClearHistory}
          style={{ 
            padding: '0.4rem 0.8rem', 
            fontSize: '0.75rem', 
            color: 'hsl(var(--danger))', 
            borderColor: 'hsl(var(--danger) / 0.3)',
            background: 'transparent'
          }}
        >
          <Trash2 size={12} /> Clear Database
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {history.map((item) => {
          const isHealthy = !item.result.hasTumor;
          const statusColor = isHealthy ? 'hsl(var(--success))' : 'hsl(var(--danger))';
          
          return (
            <div 
              key={item.id}
              className="glass-card interactive history-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'hsl(var(--bg-dark) / 0.3)',
                gap: '1rem',
                borderLeft: `3px solid ${statusColor}`
              }}
            >
              {/* Info section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                {/* Thumbnail */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  background: '#000',
                  border: '1px solid hsl(var(--border-color))',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="mri thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <FileImage size={16} color="hsl(var(--text-muted))" />
                  )}
                </div>

                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={10} /> {item.timestamp}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        color: statusColor
                      }}
                    >
                      {item.result.type}
                    </span>
                    {item.result.isSimulated && (
                      <span style={{ fontSize: '0.6rem', color: 'hsl(var(--primary))', background: 'hsl(var(--primary) / 0.1)', padding: '0.05rem 0.25rem', borderRadius: '2px', fontWeight: 600 }}>
                        SIMULATED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions & Confidence */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'hsl(var(--text-primary))' }}>
                    {item.result.confidence.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>
                    CONFIDENCE
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => onSelectHistoryItem(item)}
                    title="Load result back to main screen"
                    style={{ padding: '0.4rem', borderRadius: '4px' }}
                  >
                    <ExternalLink size={12} />
                  </button>
                  <button 
                    className="btn"
                    onClick={() => onDeleteItem(item.id)}
                    title="Delete record"
                    style={{ 
                      padding: '0.4rem', 
                      borderRadius: '4px',
                      color: 'hsl(var(--danger))',
                      borderColor: 'transparent',
                      background: 'transparent'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
