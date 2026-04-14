
import React, { useState } from "react";
import { Upload, FileText, X, File, Eye } from "lucide-react";
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800">Attachments & Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-200",
              isDragging
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-200 bg-white hover:border-slate-300"
            )}
          >
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Click to upload or drag and drop
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              PDF, DOCX, XLSX or Images (max. 10MB)
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="bg-white"
            >
              Select Files
            </Button>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Uploaded Files ({files.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-white border rounded-lg group hover:border-blue-200 transition-colors"
                  >
                    <div className="bg-slate-50 p-2 rounded mr-3">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFile(file)}
                        className="h-8 w-8 text-slate-400 hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
