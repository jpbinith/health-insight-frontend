type UploadAreaProps = {
  title: string;
  description: string;
};

export function UploadArea({ title, description }: UploadAreaProps) {
  return (
    <div className="c-dropzone" role="button" tabIndex={0}>
      <h3 className="c-dropzone__title">{title}</h3>
      <p className="c-dropzone__hint">{description}</p>
      <button type="button" className="c-dropzone__browse">
        Browse Files
      </button>
    </div>
  );
}
