import { formatRelative } from 'date-fns';
import { Download, Eye, Paperclip, Send } from 'lucide-react';
import { T } from 'ramda';
import { useState, useMemo, useEffect, useRef } from 'react';

import Image from 'next/image';

import ImagePreviewModal from '@/components/shared/images/image-preview';
import { Show } from '@/components/shared/show-conditionally';
import { AvatarFallback, AvatarImage, AvatarRoot } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

import { getFileExtensionFromUrl, getFileUrl, reverseArray } from '@/lib/utils';
import { capitalizeFirstLetter, getInitialsFromSentence } from '@/lib/utils/string';

import { useUserContext } from '@/domains/user/contexts/user-context';

import { useComments } from '../../hooks/use-comments';
import { CommentType } from '../../type/initiator';

interface ChatBoxProps {
  recordId: string;
  parentId: string;
}
export default function ChatBox({ recordId, parentId }: ChatBoxProps) {
  const { data, isLoading } = useComments(recordId);
  const { user } = useUserContext();

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  return (
    <>
      <div className="flex w-full flex-col bg-white/5">
        {data && data.length > 0 ? (
          <section ref={chatBoxRef} className="hideScroll mb-4 mt-8 h-[40vh] flex-grow overflow-y-auto pb-3">
            <div className="flex flex-col space-y-4 overscroll-auto">
              {reverseArray<CommentType>(data).map((comment, i) => {
                const { content, creator, date_created } = comment;
                return user?.id === creator.id ? (
                  <div className="flex flex-col items-end justify-end gap-2 ">
                    <Text className=" text-[0.68rem]  text-text-dim">
                      {capitalizeFirstLetter(formatRelative(date_created, new Date()))}
                    </Text>
                    <Text
                      as="p"
                      className="max-w-lg rounded-lg rounded-br-none bg-primary-6 p-2 py-3 text-xs text-black  shadow-md"
                    >
                      {content}
                    </Text>

                    <Show>
                      <Show.When isTrue={comment.files && comment.files.length >= 1}>
                        <div className="flex flex-col items-end space-y-2 py-2">
                          {comment.files.map((file, index) => {
                            const ext = getFileExtensionFromUrl(file.url).toLowerCase();

                            return (
                              <Show key={index}>
                                <Show.When isTrue={ext === 'png' || ext === 'jpg' || ext === 'jpeg'}>
                                  <div
                                    key={index}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg rounded-br-none bg-primary-6  p-2 shadow-md "
                                  >
                                    <div className="flex items-center gap-2 bg-white p-2">
                                      <Button
                                        onClick={() => window.open(getFileUrl(file.url), '_blank')}
                                        variant={'ghost'}
                                      >
                                        <Download size={14} />
                                      </Button>

                                      <Image
                                        src={getFileUrl(file.url)}
                                        width={48}
                                        height={58}
                                        alt={file.url}
                                        className="rounded-md  object-cover text-primary-1"
                                      ></Image>

                                      <ImagePreviewModal
                                        imageUrl={getFileUrl(file.url, '1200x1200')}
                                        trigger={
                                          <Button variant={'outline'}>
                                            <Text size={'xs'}>View Image</Text>
                                          </Button>
                                        }
                                      />
                                    </div>
                                  </div>
                                </Show.When>

                                <Show.Else>
                                  <div
                                    key={index}
                                    className="flex w-fit cursor-pointer items-center gap-2 rounded-lg rounded-br-none bg-primary-6  p-2 shadow-md "
                                    onClick={() => window.open(getFileUrl(file.url), '_blank')}
                                  >
                                    <div className="flex items-center gap-2 bg-white p-2">
                                      <Download size={14} />
                                      <Text size="xs" className="  text-primary-1">
                                        {getFileExtensionFromUrl(file.url)}
                                      </Text>
                                    </div>
                                  </div>
                                </Show.Else>
                              </Show>
                            );
                          })}
                        </div>
                      </Show.When>
                    </Show>
                  </div>
                ) : (
                  <div className="flex gap-2 py-2 ">
                    <div className="relative -top-[0.2rem] z-20 h-fit gap-2 rounded-full border bg-secondary-7 px-2 py-2 shadow-sm">
                      <Text className="text-xs">
                        {getInitialsFromSentence(`${creator.first_name} ${creator.last_name}`)}
                      </Text>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Text className=" text-[0.68rem]  text-text-dim">
                        {`${capitalizeFirstLetter(creator.first_name)} ${capitalizeFirstLetter(creator.last_name)} . ${capitalizeFirstLetter(formatRelative(date_created, new Date()))} `}
                      </Text>
                      <Text
                        as="p"
                        className="mr-20 w-full rounded-lg rounded-bl-none bg-primary-5 p-2 py-3 text-xs text-black shadow-md"
                      >
                        {content}
                      </Text>

                      <Show>
                        <Show.When isTrue={comment.files && comment.files.length >= 1}>
                          <div className="space-y-2 py-2">
                            {comment.files.map((file, index) => (
                              <div
                                key={index}
                                className="flex w-fit cursor-pointer items-center gap-2 rounded-lg rounded-br-none  bg-primary-5 p-2 shadow-md "
                                onClick={() => window.open(getFileUrl(file.url), '_blank')}
                              >
                                <div className="flex items-center gap-2 bg-white p-2">
                                  <Download size={14} />
                                  <Text size="xs" className="  text-primary-1">
                                    {getFileExtensionFromUrl(file.url)}
                                  </Text>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Show.When>
                      </Show>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
