'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Save, Printer, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'admin_report_html_draft';

export default function ReportEditorPage() {
  const [htmlSource, setHtmlSource] = useState('');
  const [isReady, setIsReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const draft = sessionStorage.getItem(STORAGE_KEY);
    if (draft) {
      setHtmlSource(draft);
    }
    setIsReady(true);
  }, []);

  const saveDraft = () => {
    sessionStorage.setItem(STORAGE_KEY, htmlSource);
  };

  const printPreview = () => {
    const frame = iframeRef.current;
    if (!frame?.contentWindow) return;
    frame.contentWindow.focus();
    frame.contentWindow.print();
  };

  if (!isReady) {
    return <div className="p-8 text-sm text-gray-500">Loading editor...</div>;
  }

  if (!htmlSource) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <FileText className="h-10 w-10 mx-auto text-gray-400" />
          <h1 className="text-xl font-semibold">No report draft found</h1>
          <p className="text-sm text-gray-500">Open the report editor from Admin Panel {'>'} Export to load a report draft.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={saveDraft} className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button variant="outline" onClick={printPreview} className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print / Export PDF
          </Button>
          <Button variant="outline" onClick={() => setHtmlSource(sessionStorage.getItem(STORAGE_KEY) || '')} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Reset from Draft
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div className="bg-white border rounded-lg p-3">
          <h2 className="text-sm font-semibold mb-2">HTML Source (editable)</h2>
          <textarea
            value={htmlSource}
            onChange={(e) => setHtmlSource(e.target.value)}
            className="w-full min-h-[75vh] border rounded-md p-3 font-mono text-xs"
          />
        </div>

        <div className="bg-white border rounded-lg p-3">
          <h2 className="text-sm font-semibold mb-2">Live Preview</h2>
          <iframe
            ref={iframeRef}
            title="report-preview"
            srcDoc={htmlSource}
            className="w-full min-h-[75vh] border rounded-md bg-white"
          />
        </div>
      </div>
    </div>
  );
}
