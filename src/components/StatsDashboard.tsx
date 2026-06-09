import React from 'react';
import { Activity, ShieldAlert, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';
import type { HistoryItem } from './HistoryTracker';

interface StatsDashboardProps {
  history: HistoryItem[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ history }) => {
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
          <BarChart3 size={24} />
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Data Available</h3>
        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', maxWidth: '320px', margin: '0 auto' }}>
          Perform diagnostic scans in the Scan Portal to populate live metrics in this analytics panel.
        </p>
      </div>
    );
  }

  // Calculate Statistics
  const totalScans = history.length;
  const tumorScans = history.filter(item => item.result.hasTumor).length;
  const normalScans = totalScans - tumorScans;
  const averageConfidence = history.reduce((sum, item) => sum + item.result.confidence, 0) / totalScans;

  const tumorRate = (tumorScans / totalScans) * 100;
  const normalRate = (normalScans / totalScans) * 100;

  // Breakdown of specific tumor types
  const tumorTypeCounts: Record<string, number> = {};
  history.forEach(item => {
    if (item.result.hasTumor) {
      // Clean up the name a bit to group (e.g. Astrocitoma T1 vs T2)
      let typeKey = item.result.type.split(' ')[0] || item.result.type;
      // Map Portuguese names to English or keep clean
      if (typeKey === "Astrocitoma") typeKey = "Astrocytoma";
      if (typeKey === "Ependimoma") typeKey = "Ependymoma";
      if (typeKey === "Meduloblastoma") typeKey = "Medulloblastoma";
      if (typeKey === "Neurocitoma") typeKey = "Neurocytoma";
      if (typeKey === "Papiloma") typeKey = "Papilloma";
      
      tumorTypeCounts[typeKey] = (tumorTypeCounts[typeKey] || 0) + 1;
    }
  });

  const sortedTumorTypes = Object.entries(tumorTypeCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-slide-up">
      
      {/* KPI Counters */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        {/* Total scans */}
        <div className="glass-card kpi-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="kpi-value" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{totalScans}</div>
            <div className="kpi-label" style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>Total Scans Run</div>
          </div>
        </div>

        {/* Tumor Scans */}
        <div className="glass-card kpi-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'hsl(var(--danger) / 0.1)', color: 'hsl(var(--danger))' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="kpi-value" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{tumorScans}</div>
            <div className="kpi-label" style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>Pathologies Detected</div>
          </div>
        </div>

        {/* Normal scans */}
        <div className="glass-card kpi-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'hsl(var(--success) / 0.1)', color: 'hsl(var(--success))' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="kpi-value" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{normalScans}</div>
            <div className="kpi-label" style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>Healthy Tissues</div>
          </div>
        </div>

        {/* Average confidence */}
        <div className="glass-card kpi-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'hsl(var(--secondary) / 0.1)', color: 'hsl(var(--secondary))' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="kpi-value" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{averageConfidence.toFixed(1)}%</div>
            <div className="kpi-label" style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>Avg Model Confidence</div>
          </div>
        </div>

      </div>

      {/* Ratios & Distributions */}
      <div className="ratios-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Tissue Ratio chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem' }}>
            Pathological Ratio Index
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Visual double bar chart */}
            <div style={{ height: '20px', width: '100%', background: 'hsl(var(--border-color))', borderRadius: '9999px', display: 'flex', overflow: 'hidden' }}>
              <div 
                style={{ width: `${tumorRate}%`, background: 'hsl(var(--danger))', transition: 'width 0.5s ease' }} 
                title={`Pathological: ${tumorRate.toFixed(1)}%`}
              />
              <div 
                style={{ width: `${normalRate}%`, background: 'hsl(var(--success))', transition: 'width 0.5s ease' }} 
                title={`Healthy: ${normalRate.toFixed(1)}%`}
              />
            </div>

            {/* Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(var(--danger))' }} />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Pathological: </span>
                  <strong style={{ fontSize: '0.9rem', color: 'hsl(var(--text-primary))' }}>{tumorRate.toFixed(1)}%</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(var(--success))' }} />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Healthy: </span>
                  <strong style={{ fontSize: '0.9rem', color: 'hsl(var(--text-primary))' }}>{normalRate.toFixed(1)}%</strong>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'hsl(var(--bg-dark) / 0.5)', lineHeight: 1.5 }}>
              This index represents the ratio of pathological tissue masses detected to normal tissue instances in the current session.
            </div>
          </div>
        </div>

        {/* Tumor Type Distribution */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem' }}>
            Pathological Sub-Class Breakdown
          </h3>

          {sortedTumorTypes.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>
              No tumor cases logged in history.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {sortedTumorTypes.map(([type, count]) => {
                const percentage = (count / tumorScans) * 100;
                return (
                  <div key={type} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 600 }}>{type}</span>
                      <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 600 }}>
                        {count} {count === 1 ? 'case' : 'cases'} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', width: '100%', background: 'hsl(var(--bg-dark))', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div 
                        style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))', borderRadius: '9999px' }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
