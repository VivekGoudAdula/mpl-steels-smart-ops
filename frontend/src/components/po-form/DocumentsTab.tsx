
import React, { useState } from "react";
import { Upload, FileText, X, Eye } from "lucide-react";
import DocumentViewer from "../DocumentViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DocumentsTabProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function DocumentsTab({ files, setFiles }: DocumentsTabProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="enterprise-card">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900">Attachments & Documents</h3>
        </div>
        <div className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center transition-all duration-300 relative group overflow-hidden bg-gray-50",
              isDragging
                ? "border-blue-500 bg-blue-50/50 shadow-inner"
                : "border-gray-200 hover:border-[#002147] hover:bg-gray-100/50"
            )}
          >
            <div className="bg-white p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-gray-100">
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#002147]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Click to upload or drag and drop
            </h3>
            <p className="text-xs text-gray-500 mb-6 max-w-xs text-center font-medium leading-relaxed">
              PDF, DOCX, XLSX or Images are supported. (Maximum file size: 10MB)
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              className="enterprise-button bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Select Files
            </Button>
          </div>

          {files.length > 0 && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Uploaded Files ({files.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-white border border-gray-200 rounded-xl group hover:border-[#002147] hover:shadow-sm transition-all duration-300"
                  >
                    <div className="bg-[#002147] p-2 rounded mr-3">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.name.split('.').pop()?.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 pr-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFile(file)}
                        className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <DocumentViewer 
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        document={selectedFile ? {
          fileName: selectedFile.name,
          documentType: "Attachment",
          transactionId: "UPLOAD",
          poNumber: "NEW",
          date: new Date().toISOString().split('T')[0]
        } : null}
      />
    </div>
  );
}
