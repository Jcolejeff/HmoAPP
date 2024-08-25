import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

import { query } from '@/lib/gpt';

import { TabsNames } from '@/domains/dashboard/type/initiator';
// import { query } from '@/lib/gpt';
import { useCreateRequest } from '@/domains/requests/hooks/use-create-request';

import { useCreateRequestContext } from '../../../context/initiator/create-request-context';
import TextEditor from '../../text-editor';

interface Iprops {
  switchTab: (tab: TabsNames) => void;
  handleComplete: (tab: TabsNames) => void;
  data: TabsNames[];
}

const TravelDetailsTab = ({ switchTab, data: tabData, handleComplete }: Iprops) => {
  const { onOpenChange, setActiveTab, setCreateRequestData, createRequestData, isEditMode } = useCreateRequestContext();
  const [textValue, setTextValue] = React.useState<string>(isEditMode ? (createRequestData.purpose as string) : '');

  const { isPending: isCreateRequestPending } = useCreateRequest();
  const [isGptResponseLoading, setIsGptResponseLoading] = useState(false);

  const onCloseForm = (open: boolean) => {
    onOpenChange(open);
    setTextValue('');
    setActiveTab('travel-details');
  };

  // const getLocationFromDescription = async (text: string) => {
  //   setIsGptResponseLoading(true);
  //   const gptResponse = await query({
  //     prompt: `${text}.

  //   Get the 'state', 'city', and 'country', in the text above if any, and return them as an object with keys - state, city, and country.
  //   Infer the country if possible.
  //   `,
  //   });

  //   if (!gptResponse) return;

  //   const formattedResponse = JSON.parse(gptResponse);

  //   console.log({ gptResponse });

  //   setIsGptResponseLoading(false);

  //   return formattedResponse as { city: string; state: string; country: string };
  // };

  return (
    <TabsContent value="travel-details" className="h-full w-full    border-t ">
      <section>
        <Text weight={'medium'} size={'sm'} className="my-4 ">
          Describe your travel request
        </Text>
        <TextEditor value={textValue} setValue={setTextValue} />
      </section>
      <div className="my-6 flex w-full items-center justify-end gap-4">
        <button
          onClick={() => {
            onCloseForm(false);
          }}
          type="button"
          className=" group mt-9 flex w-max items-center justify-center gap-2 rounded-[6px]  border px-3 py-1 transition-all duration-300 ease-in-out hover:opacity-90 md:px-6 md:py-2"
        >
          <Text className="whitespace-nowrap text-xs font-[500] leading-[24px] tracking-[0.4px] text-primary-1">
            {`Cancel`}
          </Text>
        </button>

        <Button
          onClick={() => {
            // query llm to pull location data
            // getLocationFromDescription(textValue).then(data => {
            //   console.log({ data });
            //   setCreateRequestData({
            //     ...createRequestData,
            //     purpose: textValue,
            //     city: data?.city,
            //     state: data?.state,
            //     country: data?.country,
            //   });
            //   switchTab(tabData[1]);
            //   handleComplete(tabData[0]);
            // });
            setCreateRequestData({ ...createRequestData, purpose: textValue });
            switchTab(tabData[1]);
            handleComplete(tabData[0]);
          }}
          disabled={!textValue}
          type="submit"
          className="group mt-9 flex items-center justify-center gap-2 rounded-[6px] px-4  py-1 text-xs transition-all duration-300 ease-in-out hover:opacity-90 disabled:!cursor-not-allowed md:px-6 md:py-3 "
        >
          {isCreateRequestPending || isGptResponseLoading ? <Spinner /> : 'Continue'}
        </Button>
      </div>
    </TabsContent>
  );
};

export default TravelDetailsTab;
