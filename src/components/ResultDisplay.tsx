import React from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, BookOpen, HeartPulse, Sparkles } from 'lucide-react';
import type { PredictionResult } from '../services/GradioService';
import { TUMOR_GLOSSARY } from '../data/TumorGlossary';

interface ResultDisplayProps {
  result: PredictionResult;
  isScanning: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isScanning }) => {
  if (isScanning) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '1.5rem', textAlign: 'center' }}>
        <div className="animate-spin-slow" style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          border: '3px solid hsl(var(--primary) / 0.1)',
          borderTopColor: 'hsl(var(--primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <HeartPulse size={32} color="hsl(var(--primary))" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'hsl(var(--primary))' }} className="glow-text-primary">
            SCANNING MRI SEQUENCE
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', maxWidth: '300px', margin: '0 auto' }}>
            Awaiting inference from CNN tensor model. Feed-forward convolutions are in progress...
          </p>
        </div>
      </div>
    );
  }

  const { hasTumor, type, confidence, isSimulated } = result;

  // Search the glossary for details
  const matchingGlossary = TUMOR_GLOSSARY.find(item => {
    // Check if type matches or if the originalName is contained within the prediction type
    const searchString = type.toLowerCase();
    const itemOriginal = item.originalName.toLowerCase();
    return searchString.includes(itemOriginal) || itemOriginal.includes(searchString);
  }) || (hasTumor ? null : TUMOR_GLOSSARY.find(i => i.id === 'normal'));

  // Define color schemes based on result type
  const isHealthy = !hasTumor;
  const accentColor = isHealthy ? 'hsl(var(--success))' : 'hsl(var(--danger))';
  const glowShadow = isHealthy ? '0 0 20px -3px hsl(var(--success) / 0.3)' : '0 0 20px -3px hsl(var(--danger) / 0.3)';
  const badgeClass = isHealthy ? 'badge-success' : 'badge-danger';

  // Circular gauge config
  const strokeRadius = 45;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = strokeCircumference - (confidence / 100) * strokeCircumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-slide-up">
      
      {/* Primary Diagnosis Header */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '1.5rem', 
          borderLeft: `5px solid ${accentColor}`,
          boxShadow: glowShadow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: isHealthy ? 'hsl(var(--success) / 0.1)' : 'hsl(var(--danger) / 0.1)',
            padding: '0.75rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isHealthy ? (
              <CheckCircle2 size={32} color={accentColor} />
            ) : (
              <AlertCircle size={32} color={accentColor} />
            )}
          </div>
          <div>
            <span className={`badge ${badgeClass}`} style={{ marginBottom: '0.4rem' }}>
              {isHealthy ? 'Healthy Tissue' : 'Pathological Mass Detected'}
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
              {isHealthy ? 'No Brain Tumor Detected' : 'Brain Tumor Detected'}
            </h2>
            <p style={{ fontSize: '0.85rem', margin: 0, color: 'hsl(var(--text-muted))', marginTop: '0.2rem' }}>
              Diagnostic Type: <strong style={{ color: 'hsl(var(--text-primary))' }}>{type}</strong>
            </p>
          </div>
        </div>

        {/* Circular Confidence Dial */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="conf-gauge" style={{ position: 'relative', width: '100px', height: '100px' }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={strokeRadius}
                fill="transparent"
                stroke="hsl(var(--border-color))"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={strokeRadius}
                fill="transparent"
                stroke={accentColor}
                strokeWidth="8"
                strokeDasharray={strokeCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset var(--transition-slow)' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-primary))', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {confidence.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.6rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>
                % CONF
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Glossary Context Card */}
      {matchingGlossary ? (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.75rem' }}>
            <BookOpen size={18} color="hsl(var(--primary))" />
            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
              Pathology Profile: {matchingGlossary.name}
            </h3>
            <span 
              className="badge" 
              style={{ 
                marginLeft: 'auto',
                background: 
                  matchingGlossary.severity === 'Normal' ? 'hsl(var(--success) / 0.1)' : 
                  matchingGlossary.severity === 'Benign' ? 'hsl(var(--warning) / 0.1)' : 'hsl(var(--danger) / 0.1)',
                color: 
                  matchingGlossary.severity === 'Normal' ? 'hsl(var(--success))' : 
                  matchingGlossary.severity === 'Benign' ? 'hsl(var(--warning))' : 'hsl(var(--danger))',
                border: 
                  matchingGlossary.severity === 'Normal' ? '1px solid hsl(var(--success) / 0.3)' : 
                  matchingGlossary.severity === 'Benign' ? '1px solid hsl(var(--warning) / 0.3)' : '1px solid hsl(var(--danger) / 0.3)'
              }}
            >
              {matchingGlossary.severity}
            </span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', margin: 0 }}>
            {matchingGlossary.summary}
          </p>

          <div className="glossary-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.25rem' }}>
            <div>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Key MRI Markers
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {matchingGlossary.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Standard Care Pipeline
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', margin: 0 }}>
                {matchingGlossary.treatment}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>
            No matching medical profile found in local database for <strong style={{ color: 'hsl(var(--text-primary))' }}>{type}</strong>. 
            However, the CNN prediction indicates a classification probability of {confidence.toFixed(2)}%.
          </p>
        </div>
      )}

      {/* API Notice / Safety Disclaimer */}
      <div 
        style={{ 
          background: 'hsl(var(--bg-card))',
          border: '1px solid hsl(var(--border-color))',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}
      >
        <ShieldAlert size={20} color="hsl(var(--warning))" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <div style={{ fontSize: '0.75rem', lineHeight: '1.5', color: 'hsl(var(--text-muted))' }}>
          <strong style={{ color: 'hsl(var(--warning))', textTransform: 'uppercase' }}>Clinical Safety Disclaimer: </strong>
          NeuralScan AI and the underlying CNN model (`pragadeesh10/brain12`) are designed strictly as an educational and demonstration portal. 
          The prediction outputs should not be used as diagnostic decisions. For any medical issues or MRI scans analysis, always seek consulting from a licensed neurologist or radiologist.
          {isSimulated && (
            <span style={{ display: 'block', marginTop: '0.4rem', color: 'hsl(var(--primary))' }}>
              <Sparkles size={10} style={{ marginRight: '0.2rem', verticalAlign: 'middle' }} />
              <strong>Note:</strong> This prediction was generated in <strong>Simulation Sandbox mode</strong> due to network constraints or manual selection.
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
