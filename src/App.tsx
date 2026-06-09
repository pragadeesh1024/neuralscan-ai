import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MRIUploader } from './components/MRIUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryTracker } from './components/HistoryTracker';
import type { HistoryItem } from './components/HistoryTracker';
import { StatsDashboard } from './components/StatsDashboard';
import { GlossarySection } from './components/GlossarySection';
import { GradioService } from './services/GradioService';
import type { PredictionResult } from './services/GradioService';
import { Sparkles, Activity, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('portal');
  const [apiMode, setApiMode] = useState<'live' | 'demo'>('live');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Scan states
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);


  // History states
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('neuralscan_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse saved history', e);
      }
    }
  }, []);

  // Try to connect to Gradio live space when mode is set to live
  useEffect(() => {
    if (apiMode === 'live') {
      setIsConnecting(true);
      GradioService.connect()
        .then(() => {
          setIsConnected(true);
          setIsConnecting(false);
        })
        .catch((err) => {
          console.warn("Failed to connect to Gradio space on start:", err);
          setIsConnected(false);
          setIsConnecting(false);
        });
    } else {
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, [apiMode]);

  // Handle selected image
  const handleImageSelected = (blob: Blob, previewUrl: string, name: string) => {
    setSelectedImagePreview(previewUrl);
    setSelectedImageName(name);
    setPredictionResult(null); // Clear previous results
    
    // Automatically trigger scanning when image is selected!
    triggerPrediction(blob, previewUrl, name);
  };

  // Helper to generate a small base64 thumbnail
  const generateThumbnail = (previewUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#05070c';
          ctx.fillRect(0, 0, 48, 48);
          ctx.drawImage(img, 0, 0, 48, 48);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
      img.src = previewUrl;
    });
  };

  // Trigger CNN inference
  const triggerPrediction = async (blob: Blob, previewUrl: string, name: string) => {
    setIsScanning(true);
    
    try {
      const result = await GradioService.predict(blob, apiMode === 'demo');
      setPredictionResult(result);

      // Generate thumbnail & save in history
      const thumbnailBase64 = await generateThumbnail(previewUrl);
      const newHistoryItem: HistoryItem = {
        id: `scan-${Date.now()}`,
        name: name,
        thumbnail: thumbnailBase64,
        result: result,
        timestamp: new Date().toLocaleString()
      };

      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('neuralscan_history', JSON.stringify(updatedHistory));
      
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  // Reset scan portal
  const resetScan = () => {
    setSelectedImagePreview(null);
    setSelectedImageName(null);
    setPredictionResult(null);
    setIsScanning(false);
  };

  // Delete history item
  const handleDeleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('neuralscan_history', JSON.stringify(updatedHistory));
  };

  // Clear all history
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all scans from the history database?")) {
      setHistory([]);
      localStorage.removeItem('neuralscan_history');
    }
  };

  // Select item from history to view
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setSelectedImagePreview(item.thumbnail || '');
    setSelectedImageName(item.name);
    setPredictionResult(item.result);
    setIsScanning(false);
    setActiveTab('portal'); // Return to scan portal
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header and Controller */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        apiMode={apiMode} 
        setApiMode={setApiMode} 
        isConnected={isConnected} 
        isConnecting={isConnecting}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        
        {/* Render Tab Contents */}
        {activeTab === 'portal' && (
          <div className="animate-fade-in">
            
            {/* Quick Informational Alert */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'hsl(var(--primary) / 0.05)',
                border: '1px solid hsl(var(--primary) / 0.15)',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}
            >
              <Info size={16} color="hsl(var(--primary))" style={{ flexShrink: 0 }} />
              <div style={{ color: 'hsl(var(--text-secondary))' }}>
                <strong>How to test:</strong> Upload your own brain MRI slice in the panel below, or select a pre-loaded synthetic case from the <strong>Test Library</strong> to run instant CNN analysis.
              </div>
            </div>

            <div className="dashboard-grid">
              
              {/* Left Column: MRI Uploader & Controller */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem', borderBottom: '2px solid hsl(var(--primary) / 0.3)' }}>
                  <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Activity size={18} color="hsl(var(--primary))" />
                    MRI Acquisition Panel
                  </h2>
                </div>
                
                <MRIUploader 
                  onImageSelected={handleImageSelected}
                  isScanning={isScanning}
                  selectedImageName={selectedImageName}
                  selectedImagePreview={selectedImagePreview}
                  resetScan={resetScan}
                />
              </div>

              {/* Right Column: Diagnostic Result / Scanner Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem', borderBottom: '2px solid hsl(var(--secondary) / 0.3)' }}>
                  <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Sparkles size={18} color="hsl(var(--secondary))" />
                    Neural Diagnostic Report
                  </h2>
                </div>

                {predictionResult || isScanning ? (
                  <ResultDisplay 
                    result={predictionResult || { hasTumor: false, type: '', confidence: 0, rawText: '', timestamp: '' }} 
                    isScanning={isScanning}
                  />
                ) : (
                  <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'hsl(var(--border-color) / 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--text-muted))' }}>
                      <Activity size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>Awaiting MRI Upload</h3>
                      <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', maxWidth: '300px', margin: '0 auto' }}>
                        Load a scan from the library or upload a file. The CNN model will automatically start segmentation inference.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {activeTab === 'dictionary' && <GlossarySection />}

        {activeTab === 'history' && (
          <HistoryTracker 
            history={history}
            onDeleteItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
            onSelectHistoryItem={handleSelectHistoryItem}
          />
        )}

        {activeTab === 'dashboard' && <StatsDashboard history={history} />}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid stroke', padding: '1.5rem 0', textAlign: 'center', background: 'hsl(var(--bg-surface) / 0.4)', marginTop: 'auto' }}>
        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
          NeuralScan AI Portal &copy; {new Date().getFullYear()}. Powered by Gradio Client & Hugging Face Spaces (`pragadeesh10/brain12`). All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}
