import Image from "next/image";
import { forwardRef, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileWithPreview extends File {
  preview: string;
}

interface DropZoneInputProps extends React.ComponentPropsWithoutRef<"input"> {
  onFileDrop?: (file: File) => void;
  defaultFile?: File;
}

const DropZoneInput = forwardRef<HTMLInputElement, DropZoneInputProps>(
  ({ onFileDrop, defaultFile, ...props }, ref) => {
    const [file, setFile] = useState<FileWithPreview | undefined>(() => {
      if (defaultFile) {
        return Object.assign(defaultFile, {
          preview: URL.createObjectURL(defaultFile),
        });
      }
      return undefined;
    });
    const { getRootProps, getInputProps } = useDropzone({
      accept: {
        "image/*": [],
      },
      multiple: false,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        onFileDrop?.(files[0]);
        setFile(files[0]);
      },
    });

    const thumbs = file && (
      <div className="mt-2 relative aspect-[32/9]">
        <Image
          src={file.preview}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          fill
          objectFit="contain"
          alt={file.name}
        />
      </div>
    );

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => file && URL.revokeObjectURL(file.preview);
    }, [file]);

    return (
      <section>
        <div
          {...getRootProps({
            className:
              "dropzone border border-dashed border-2 rounded-md grid place-items-center py-10",
          })}
        >
          <input {...getInputProps(props)} ref={ref} />
          <p>
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        </div>
        {thumbs}
      </section>
    );
  }
);

DropZoneInput.displayName = "DropZoneInput";
export default DropZoneInput;
