'use client';

import { Mic, Sparkles } from 'lucide-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import 'react-quill/dist/quill.snow.css';

interface TextEditorProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TextEditor = ({ value, setValue }: TextEditorProps) => {
  const quill = useRef<ReactQuill | null>(null);
  function handler() {
    console.log(value);
  }

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ['bold', 'italic', 'underline', 'blockquote'],
          [{ color: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['clean'],
        ],
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [],
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
  ];

  return (
    <div className="">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        ref={quill}
        modules={modules}
        formats={formats}
        className="h-[200px]"
      />
    </div>
  );
};

export default TextEditor;
