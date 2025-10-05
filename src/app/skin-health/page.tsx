'use client';

import { useState } from 'react';
import { ImageUploader } from '../../components/ImageUploader/ImageUploader';

export default function SkinHealthPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const hasSelection = selectedFiles.length > 0;

  return (
    <section className="skin-upload">
      <div className="skin-upload__inner">
        <div className="skin-upload__intro">
          <span className="skin-upload__badge">Skin Health Analysis</span>
          <h1 className="skin-upload__title">Upload Your Skin Image</h1>
          <p className="skin-upload__subtitle">
            Get AI-powered insights into your skin. For best results, use a clear, well-lit photo.
          </p>
        </div>

        <div className="skin-upload__card">
          <ImageUploader
            accept="image/*"
            title="Upload Image"
            prompt="Drag and drop or click to upload"
            helperText="Supports: JPG, JPEG, PNG"
            hideDropzoneOnSelection
            showPreviewImage
            onChange={setSelectedFiles}
            className="skin-upload__uploader"
          />

          <button
            type="button"
            className={`skin-upload__submit${hasSelection ? ' skin-upload__submit--enabled' : ''}`}
            disabled={!hasSelection}
          >
            Start Analysis
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </div>

        <p className="skin-upload__disclaimer">
          <strong>Disclaimer:</strong> HealthSight provides informational insights and is not a substitute for professional
          medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any questions you may
          have regarding a medical condition.
        </p>
      </div>
    </section>
  );
}
