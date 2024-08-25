import { AxiosError, isAxiosError } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, Send, UploadCloud } from 'lucide-react';
import { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'sonner';

import Image from 'next/image';

import { Show } from '@/components/shared/show-conditionally';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';

import processError from '@/lib/error';
import { $http } from '@/lib/http';
import { url } from '@/lib/utils';

import { useUploadFiles } from '@/domains/files/hooks/use-upload-files';
import { RequestItemProps } from '@/domains/requests/type';
import { useWorkspaceContext } from '@/domains/workspace/contexts/workspace-context';

import { useCreateRequestContext } from '../../context/initiator/create-request-context';
import { useCreateComment } from '../../hooks/use-create-comment';

export interface FilePreview {
  file: File;
  name: string;
  size: number;
  type: string;
}

export default function CreateCommentForm() {
  const [inputValue, setInputValue] = useState<string>('');
  const [files, setFiles] = useState<FilePreview[]>([]);
  const { currentRequest } = useCreateRequestContext();
  const { mutate: createComment, isPending } = useCreateComment();
  const { mutate: uploadFiles, isPending: uploadFilesPending } = useUploadFiles();

  const handleSubmitComment = (content: string, currReq: RequestItemProps) => {
    if (content && currReq && content.trim().length > 0) {
      createComment(
        {
          content: content,
          record_id: currReq.id,
        },
        {
          onSuccess: data => {
            if (files.length > 0) {
              uploadFiles(
                {
                  entityId: data.id.toString(),
                  entityName: 'comment',

                  files: files,
                },
                {
                  onSuccess: () => {
                    setFiles([]);
                    setInputValue('');

                    toast.success(`Comment Added Successfully`);
                  },
                  onError: error => {
                    console.log({ error });
                    if (error instanceof AxiosError) processError(error);
                  },
                },
              );
            } else {
              setInputValue('');
              toast.success(`Comment Added Successfully`);
            }
          },
          onError: error => {
            console.log({ error });
            if (error instanceof AxiosError) processError(error);
          },
        },
      );
    } else {
      toast.error('Comment cannot be empty');
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (files.length >= 5) {
      toast.error('You can only upload up to 5 files at once');
      return;
    }

    const selectedFiles = Array.from(event.target.files || []);
    const validFiles: FilePreview[] = [];
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB

    selectedFiles.forEach(file => {
      if (file.size > maxSizeInBytes) {
        toast.error(`File "${file.name}" exceeds 1MB limit`);
      } else {
        validFiles.push({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    });

    // Filter out duplicate files
    const nonDuplicateFiles = validFiles.filter(
      newFile => !files.some(existingFile => existingFile.name === newFile.name),
    );

    setFiles(prevFiles => [...prevFiles, ...nonDuplicateFiles].slice(0, 10));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleSubmitComment(inputValue, currentRequest as RequestItemProps);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleFormSubmit} className="">
      <div className="relative flex w-full items-center px-4">
        <label htmlFor="file-upload" className="absolute left-[30px] cursor-pointer text-gray-500 hover:text-gray-700">
          <Paperclip className=" text-slate-400" size={16} />
        </label>
        <Input
          disabled={isPending || uploadFilesPending}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Have something to add?"
          className="w-full rounded-lg  border py-6 pe-12 ps-10 shadow-lg transition-all duration-150 ease-linear placeholder:text-xs focus:outline-none focus:ring-0 focus:ring-black/10 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {/* File Input (hidden) */}
        <Input
          id="file-upload"
          type="file"
          accept=".png,.jpg,.jpeg"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          disabled={isPending || uploadFilesPending || inputValue.trim().length === 0}
          type="submit"
          className="w-fix  absolute right-[30px] transform rounded-md bg-slate-200 p-2 font-light text-black transition duration-300 ease-in-out hover:scale-105 hover:bg-black hover:text-white active:scale-95"
        >
          {isPending || uploadFilesPending ? <Spinner /> : <Send size={16} />}
        </Button>
      </div>

      {/* File Preview Section */}
      <Show>
        <Show.When isTrue={files.length > 0}>
          <div className="space-y-2 px-4 py-3">
            {files.map((filePreview, index) => (
              <AnimatePresence key={index}>
                <motion.div
                  initial={{ x: 300, opacity: 0, transitionDuration: '0.1s' }}
                  animate={{ x: 0, opacity: 1, transitionDuration: '0.1s' }}
                  exit={{ x: -300, opacity: 0, transitionDuration: '0.1s' }}
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-white p-2 shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Image
                      src={
                        filePreview.type.startsWith('image/')
                          ? URL.createObjectURL(filePreview.file)
                          : `${url('/images/dashboard/file-icon.png')}`
                      }
                      width={48}
                      height={48}
                      alt={filePreview.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div>
                      <p className=" text-xs font-medium text-gray-700">{filePreview.name}</p>
                      <p className="text-xs text-gray-500">{(filePreview.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    disabled={isPending || uploadFilesPending}
                    type="button"
                    variant={'ghost'}
                    onClick={() => handleRemoveFile(index)}
                    className="text-xs text-red-500  hover:text-red-700"
                  >
                    {isPending || uploadFilesPending ? <Spinner /> : 'Remove'}
                  </Button>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </Show.When>
      </Show>
    </form>
  );
}
