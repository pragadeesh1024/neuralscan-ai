import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileImage, RefreshCw, Cpu, Layers } from 'lucide-react';
import { SAMPLE_SCANS, svgToBlob } from '../data/SampleScans';
import type { SampleScan } from '../data/SampleScans';

interface MRIUploaderProps {
  onImageSelected: (blob: Blob, previewUrl: string, name: string) => void;
  isScanning: boolean;
  selectedImageName: string | null;
  selectedImagePreview: string | null;
  resetScan: () => void;
}

export const MRIUploader: React.FC<MRIUploaderProps> = ({
  onImageSelected,
  isScanning,
  selectedImageName,
  selectedImagePreview,
  resetScan
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [scanStatus, setScanStatus] = useState("Idle");

  // Rotating medical status messages during scanning
  useEffect(() => {
    if (!isScanning) {
      setScanStatus("Idle");
      return;
    }

    const statuses = [
      "Acquiring MRI slice data...",
      "Normalizing pixel arrays (64x64 input)...",
      "Running convolutional layer filters...",
      "Extracting spatial feature maps...",
      "Executing dense layer calculations...",
      "Generating classification probability...",
      "Retrieving final diagnosis results..."
    ];

    let currentIndex = 0;
    setScanStatus(statuses[0]);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
      setScanStatus(statuses[currentIndex]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isScanning]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      onImageSelected(file, previewUrl, file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        onImageSelected(file, previewUrl, file.name);
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSelectSample = async (sample: SampleScan) => {
    try {
      setScanStatus(`Acquiring sample ${sample.type}...`);
      const blob = await svgToBlob(sample.svg);
      const url = URL.createObjectURL(blob);
      onImageSelected(blob, url, `${sample.type} (${sample.name})`);
    } catch (err) {
      console.error("Failed to load sample:", err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Upload Console */}
      <div 
        className={`glass-card ${isDragOver ? 'glow-border-primary' : ''}`}
        style={{
          padding: '2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all var(--transition-normal)',
          borderStyle: selectedImagePreview ? 'solid' : 'dashed',
          borderWidth: selectedImagePreview ? '1px' : '2px',
          borderColor: isDragOver ? 'hsl(var(--primary))' : 'hsl(var(--border-color))'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedImagePreview ? (
          /* Preview Mode / Scanning Mode */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div 
              className={`preview-container ${isScanning ? 'animate-scan glow-border-primary' : ''}`}
              style={{
                width: '240px',
                height: '240px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid hsl(var(--border-color))',
                background: '#05070c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isScanning ? 'var(--shadow-glow)' : 'none'
              }}
            >
              <img 
                src={selectedImagePreview} 
                alt="MRI Slice Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              
              {/* Scanning status banner */}
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.3)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Grid overlays */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }} />
                </div>
              )}
            </div>

            <div style={{ width: '100%' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                background: 'hsl(var(--bg-dark))',
                padding: '0.4rem 0.8rem',
                borderRadius: '9999px',
                border: '1px solid hsl(var(--border-color))',
                maxWidth: '90%'
              }}>
                <FileImage size={14} color="hsl(var(--primary))" />
                <span style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'hsl(var(--text-secondary))'
                }}>
                  {selectedImageName}
                </span>
              </div>
            </div>

            {/* Scanning details status */}
            {isScanning ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                background: 'hsl(var(--primary) / 0.05)',
                border: '1px solid hsl(var(--primary) / 0.2)',
                width: '100%',
                justifyContent: 'center',
                animation: 'pulse-glow 2s infinite ease-in-out'
              }}>
                <Cpu size={16} className="animate-spin-slow" color="hsl(var(--primary))" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'hsl(var(--primary))', fontFamily: 'var(--font-mono)' }}>
                  {scanStatus}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={triggerFileSelect}>
                  Change Scan
                </button>
                <button className="btn btn-secondary" onClick={resetScan}>
                  <RefreshCw size={14} /> Reset
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Normal Drag & Drop Upload Mode */
          <div 
            onClick={triggerFileSelect}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1.25rem',
              cursor: 'pointer',
              padding: '2.5rem 0'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'hsl(var(--primary) / 0.08)',
              border: '1px solid hsl(var(--primary) / 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'hsl(var(--primary))',
              boxShadow: '0 0 15px -5px hsl(var(--primary) / 0.3)'
            }}>
              <Upload size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                Drag & drop brain MRI slice
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
                Supports PNG, JPG, or DICOM-derived images. Max size 5MB.
              </p>
            </div>
            <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
              Browse Files
            </button>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }}
        />
      </div>

      {/* Sample Library */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em', color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={14} color="hsl(var(--primary))" />
          Test Library (Slices Database)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem' }}>
          Select a pre-loaded synthetic MRI slice configuration to inspect model diagnostic behavior.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem' }}>
          {SAMPLE_SCANS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              disabled={isScanning}
              className="glass-card interactive"
              style={{
                padding: '0.6rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                borderWidth: '1px',
                background: 'hsl(var(--bg-dark) / 0.5)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid hsl(var(--border-color))'
                }}
                dangerouslySetInnerHTML={{ __html: sample.svg.replace('<rect width="256" height="256" fill="#05070c" />', '') }}
              />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'hsl(var(--text-primary))', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                {sample.type.split(' ')[0]}
              </span>
              <span style={{ fontSize: '0.6rem', color: 'hsl(var(--text-muted))' }}>
                {sample.name.split('Ref: ')[1] || sample.name}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
