
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Attachments & Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 px-6 pb-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center transition-all duration-300 relative group overflow-hidden",
              isDragging
                ? "border-blue-500 bg-blue-50/50 shadow-inner"
                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/30"
            )}
          >
            <div className="bg-blue-50 p-6 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100/50">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Click to upload or drag and drop
            </h3>
            <p className="text-sm text-slate-500 mb-8 max-w-xs text-center font-medium leading-relaxed">
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
              className="h-12 px-8 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
            >
              Select Files from Computer
            </Button>
          </div>

          {files.length > 0 && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Uploaded Files ({files.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-white border border-slate-100 rounded-2xl group hover:border-blue-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="bg-slate-50 p-3 rounded-xl mr-4 group-hover:bg-blue-50 transition-colors">
                      <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.name.split('.').pop()?.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pr-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFile(file)}
                        className="h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                      >
                        <X className="w-5 h-5" />
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
