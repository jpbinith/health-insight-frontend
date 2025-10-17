'use client';

import Image from 'next/image';
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';

type ImageUploaderProps = {
  accept?: string;
  multiple?: boolean;
  title?: string;
  prompt: string;
  helperText?: string;
  className?: string;
  dropzoneClassName?: string;
  hideDropzoneOnSelection?: boolean;
  showPreviewImage?: boolean;
  showFileList?: boolean;
  removeLabel?: string;
  onChange?: (files: File[]) => void;
  onPreviewChange?: (previewSrc: string | null) => void;
};

function mergeClasses(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ').trim();
}

export function ImageUploader({
  accept = 'image/*',
  multiple = false,
  title,
  prompt,
  helperText,
  className,
  dropzoneClassName,
  hideDropzoneOnSelection = false,
  showPreviewImage = false,
  showFileList = false,
  removeLabel = 'Remove',
  onChange,
  onPreviewChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const updatePreview = (next: string | null) => {
    setPreviewSrc(next);
    onPreviewChange?.(next);
  };

  const updateFiles = (next: File[]) => {
    setFiles(next);
    onChange?.(next);
  };

  const openFileDialog = () => inputRef.current?.click();

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) {
      return;
    }

    const incomingFiles = Array.from(incoming);
    const next = multiple ? [...files, ...incomingFiles] : [incomingFiles[0]];
    updateFiles(next);

    if ((showPreviewImage || onPreviewChange) && next[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          updatePreview(event.target.result);
        }
      };
      reader.readAsDataURL(next[0]);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleFiles(event.dataTransfer?.files ?? null);
  };

  const handleDrag = (event: DragEvent<HTMLDivElement>, entering: boolean) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(entering);
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, idx) => idx !== index);
    updateFiles(next);
    if (showPreviewImage || onPreviewChange) {
      if (next[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            updatePreview(event.target.result);
          }
        };
        reader.readAsDataURL(next[0]);
      } else {
        updatePreview(null);
      }
    }
    if (inputRef.current && next.length === 0) {
      inputRef.current.value = '';
    }
  };

  const clearAll = () => {
    updateFiles([]);
    updatePreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const dropzoneShouldHide = hideDropzoneOnSelection && files.length > 0;

  const dropzoneClasses = mergeClasses(
    'image-upload__dropzone',
    dropzoneClassName,
    dragActive && 'image-upload__dropzone--active',
    dropzoneShouldHide && 'image-upload__dropzone--hidden',
  );

  return (
    <div className={mergeClasses('image-upload', className)}>
      {!dropzoneShouldHide ? (
        <div
          className={dropzoneClasses}
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.preventDefault();
            openFileDialog();
          }}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openFileDialog();
            }
          }}
          onDragEnter={(event) => handleDrag(event, true)}
          onDragOver={(event) => handleDrag(event, true)}
          onDragLeave={(event) => handleDrag(event, false)}
          onDrop={handleDrop}
        >
          <span className="image-upload__icon" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 16V7" />
              <path d="m8 11 4-4 4 4" />
              <path d="M20 16.58A5 5 0 0 0 18 7H17.26A8 8 0 1 0 4 15.25" />
            </svg>
          </span>
          {title ? <p className="image-upload__title">{title}</p> : null}
          <p className="image-upload__prompt">{prompt}</p>
          {helperText ? <p className="image-upload__helper">{helperText}</p> : null}
        </div>
      ) : null}

      {showPreviewImage && previewSrc ? (
        <div className="image-upload__preview">
          <Image
            src={previewSrc}
            alt={files[0]?.name ?? 'Uploaded image preview'}
            width={360}
            height={360}
            className="image-upload__preview-image"
            unoptimized
          />
          <p className="image-upload__file-name">{files[0]?.name}</p>
          <button
            type="button"
            className="image-upload__remove"
            onClick={(event) => {
              event.preventDefault();
              clearAll();
            }}
          >
            {removeLabel}
          </button>
        </div>
      ) : null}

      {showFileList && files.length > 0 ? (
        <ul className="image-upload__file-list">
          {files.map((file, index) => (
            <li className="image-upload__file" key={`${file.name}-${index}`}>
              <span className="image-upload__file-name">{file.name}</span>
              <button
                type="button"
                className="image-upload__file-remove"
                onClick={(event) => {
                  event.preventDefault();
                  removeFile(index);
                }}
                aria-label={`${removeLabel} ${file.name}`}
              >
                {removeLabel}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="image-upload__input"
        onChange={handleChange}
        tabIndex={-1}
      />
    </div>
  );
}
