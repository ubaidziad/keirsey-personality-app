'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Save,
  Printer,
  RefreshCw,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Pilcrow,
  Undo2,
  Redo2,
  Eraser,
} from 'lucide-react';

const STORAGE_KEY = 'admin_report_html_draft';

export default function ReportEditorPage() {
  const [htmlSource, setHtmlSource] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const draft = sessionStorage.getItem(STORAGE_KEY);
    if (draft) {
      setHtmlSource(draft);
    }
    setIsReady(true);
  }, []);

  const getFrameDocument = () => iframeRef.current?.contentDocument || null;

  const getCurrentHtml = () => {
    const frameDocument = getFrameDocument();
    if (!frameDocument?.documentElement) {
      return htmlSource;
    }

    return `<!DOCTYPE html>\n${frameDocument.documentElement.outerHTML}`;
  };

  const enableVisualEditing = () => {
    const frameDocument = getFrameDocument();
    if (!frameDocument?.body) return;

    frameDocument.designMode = 'on';
    frameDocument.body.setAttribute('spellcheck', 'true');
    frameDocument.body.style.outline = 'none';
    frameDocument.body.oninput = () => setIsDirty(true);
  };

  const runCommand = (command: string, value?: string) => {
    const frameDocument = getFrameDocument();
    if (!frameDocument) return;

    frameDocument.execCommand(command, false, value);
    frameDocument.body?.focus();
    setIsDirty(true);
  };

  const saveDraft = () => {
    const nextHtml = getCurrentHtml();
    sessionStorage.setItem(STORAGE_KEY, nextHtml);
    setHtmlSource(nextHtml);
    setIsDirty(false);
    setSaveMessage('Draft saved');

    window.setTimeout(() => {
      setSaveMessage('');
    }, 1800);
  };

  const resetFromDraft = () => {
    const draft = sessionStorage.getItem(STORAGE_KEY) || '';
    setHtmlSource(draft);
    setIsDirty(false);
    setSaveMessage('');
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
          <p className="text-sm text-gray-500">Open the report editor from Admin Panel {'>'} Export PDF to load a report draft.</p>
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
          <Button variant="outline" onClick={resetFromDraft} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Reset from Draft
          </Button>

          <span className="text-xs text-gray-500 ml-auto">
            {saveMessage || (isDirty ? 'Unsaved changes' : 'All changes saved')}
          </span>
        </div>

        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={() => runCommand('bold')} title="Bold">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => runCommand('italic')} title="Italic">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => runCommand('underline')} title="Underline">
            <Underline className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => runCommand('formatBlock', '<h2>')} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => runCommand('formatBlock', '<h3>')} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => runCommand('formatBlock', '<p>')} title="Paragraph">
            <Pilcrow className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => runCommand('insertUnorderedList')} title="Bullet List">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => runCommand('insertOrderedList')} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => runCommand('undo')} title="Undo">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => runCommand('redo')} title="Redo">
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => runCommand('removeFormat')} title="Clear Formatting">
            <Eraser className="h-4 w-4" />
          </Button>

          <p className="text-xs text-gray-500 ml-auto">
            Click inside the report and edit text directly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white border rounded-lg p-3">
          <h2 className="text-sm font-semibold mb-2">Visual Report Editor</h2>
          <iframe
            ref={iframeRef}
            title="report-visual-editor"
            srcDoc={htmlSource}
            onLoad={enableVisualEditing}
            className="w-full min-h-[80vh] border rounded-md bg-white"
          />
        </div>
      </div>
    </div>
  );
}
