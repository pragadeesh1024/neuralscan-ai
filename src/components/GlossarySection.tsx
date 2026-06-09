import React, { useState } from 'react';
import { Search, Info, HelpCircle } from 'lucide-react';
import { TUMOR_GLOSSARY } from '../data/TumorGlossary';

export const GlossarySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Malignant' | 'Benign' | 'Inflammatory' | 'Normal'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = TUMOR_GLOSSARY.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originalName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || item.severity === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="glass-card animate-slide-up" style={{ padding: '1.5rem' }}>
      
      {/* Title & Search Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={20} color="hsl(var(--primary))" />
            Pathology Reference Dictionary
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', margin: 0 }}>
            Explore typical MRI findings and clinical profiles for CNN diagnostic labels.
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-bar" style={{ position: 'relative', width: '250px' }}>
          <Search size={14} color="hsl(var(--text-muted))" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search tumor type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 1rem 0.45rem 2.25rem',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'hsl(var(--bg-dark))',
              border: '1px solid hsl(var(--border-color))',
              color: 'hsl(var(--text-primary))',
              outline: 'none',
              transition: 'all var(--transition-normal)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
            onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border-color))'}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {(['All', 'Malignant', 'Benign', 'Inflammatory', 'Normal'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className="btn"
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: activeFilter === filter ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              border: activeFilter === filter ? '1px solid hsl(var(--primary) / 0.3)' : '1px solid hsl(var(--border-color))',
              color: activeFilter === filter ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
              fontWeight: 600
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>
          No records match the current filters.
        </div>
      ) : (
        <div className="glossary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            const severityColor = 
              item.severity === 'Normal' ? 'hsl(var(--success))' : 
              item.severity === 'Benign' ? 'hsl(var(--warning))' : 
              item.severity === 'Inflammatory' ? 'hsl(var(--primary))' : 'hsl(var(--danger))';
              
            const severityBg = 
              item.severity === 'Normal' ? 'hsl(var(--success) / 0.08)' : 
              item.severity === 'Benign' ? 'hsl(var(--warning) / 0.08)' : 
              item.severity === 'Inflammatory' ? 'hsl(var(--primary) / 0.08)' : 'hsl(var(--danger) / 0.08)';

            const severityBorder = 
              item.severity === 'Normal' ? 'hsl(var(--success) / 0.25)' : 
              item.severity === 'Benign' ? 'hsl(var(--warning) / 0.25)' : 
              item.severity === 'Inflammatory' ? 'hsl(var(--primary) / 0.25)' : 'hsl(var(--danger) / 0.25)';

            return (
              <div 
                key={item.id} 
                className="glass-card"
                style={{ 
                  padding: '1.25rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.75rem',
                  cursor: 'pointer',
                  borderTop: `3px solid ${severityColor}`,
                  background: isExpanded ? 'hsl(var(--bg-card) / 0.9)' : undefined,
                  transition: 'all var(--transition-normal)'
                }}
                onClick={() => toggleExpand(item.id)}
              >
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{item.name}</h3>
                    <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', fontFamily: 'var(--font-mono)' }}>
                      Label ID: {item.originalName}
                    </span>
                  </div>
                  <span 
                    className="badge" 
                    style={{ 
                      background: severityBg, 
                      color: severityColor, 
                      border: `1px solid ${severityBorder}` 
                    }}
                  >
                    {item.severity}
                  </span>
                </div>

                <p style={{ 
                  fontSize: '0.85rem', 
                  margin: 0, 
                  color: 'hsl(var(--text-secondary))',
                  display: '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: '1.5'
                }}>
                  {item.summary}
                </p>

                {/* Expanded Sections */}
                {isExpanded ? (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    marginTop: '0.5rem', 
                    borderTop: '1px solid hsl(var(--border-color))',
                    paddingTop: '0.75rem',
                    animation: 'fade-in 0.3s ease'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                        Typical MRI Presentation
                      </h4>
                      <ul style={{ paddingLeft: '1.15rem', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        {item.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                        Standard Intervention
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', margin: 0, lineHeight: '1.4' }}>
                        {item.treatment}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'hsl(var(--primary))', fontWeight: 600, marginTop: '0.25rem' }}>
                    <Info size={12} /> Click to expand details
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
