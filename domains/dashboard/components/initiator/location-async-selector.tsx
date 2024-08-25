'use client';

import { useJsApiLoader } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react';

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type AutocompletePrediction = google.maps.places.AutocompletePrediction;
type AutocompleteService = google.maps.places.AutocompleteService;
type PlaceDetails = google.maps.places.PlaceResult;

export interface LocationAsyncProps {
  selectedLocation: string | null;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string | null>>;
  city: string | null;
  setCity: React.Dispatch<React.SetStateAction<string | null>>;
  state: string | null;
  setState: React.Dispatch<React.SetStateAction<string | null>>;
  country: string | null;
  setCountry: React.Dispatch<React.SetStateAction<string | null>>;
  children: React.ReactNode;
}
const LocationSelectorAsync: React.FC<LocationAsyncProps> = ({
  setCity,
  setCountry,
  setSelectedLocation,
  setState,
  children,
}) => {
  const [suggestions, setSuggestions] = useState<AutocompletePrediction[]>([]);

  const [textValue, setTextValue] = useState<string>('');
  const [open, setOpen] = useState(false);
  const autocompleteServiceRef = useRef<AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  useEffect(() => {
    if (isLoaded && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const fetchSuggestions = (input: string) => {
    if (autocompleteServiceRef.current) {
      const request = {
        input,
        types: ['geocode'],
      };
      autocompleteServiceRef.current.getPlacePredictions(request, predictions => {
        setSuggestions(predictions || []);
        //   setOpen(!!predictions && predictions.length > 0);
      });
    }
  };

  const getPlaceDetails = (placeId: string) => {
    if (placesServiceRef.current) {
      const request = {
        placeId,
        fields: ['address_component'],
      };
      placesServiceRef.current.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const addressComponents = place.address_components || [];

          const cityComponent = addressComponents.find(component => component.types.includes('locality'));
          const stateComponent = addressComponents.find(component =>
            component.types.includes('administrative_area_level_1'),
          );
          const countryComponent = addressComponents.find(component => component.types.includes('country'));

          setCity(cityComponent?.long_name || null);
          setState(stateComponent?.long_name || null);
          setCountry(countryComponent?.long_name || null);
        }
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextValue(value);
    if (value) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
      // setOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: AutocompletePrediction) => {
    setTextValue(suggestion.description);
    setSelectedLocation(suggestion.description);
    setSuggestions([]);
    setOpen(false);

    if (!placesServiceRef.current) {
      placesServiceRef.current = new google.maps.places.PlacesService(document.createElement('div'));
    }

    getPlaceDetails(suggestion.place_id);
  };

  return (
    <div className="">
      {isLoaded && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{children}</PopoverTrigger>

          <PopoverContent className="w-[26rem] p-0">
            <Command shouldFilter={false}>
              <div>
                <Input
                  name="title"
                  value={textValue}
                  onChange={handleInputChange}
                  placeholder="Search Location"
                  className=" my-2 flex w-full  border-b border-t-0 bg-primary-4 bg-transparent py-3 text-sm text-text outline-none placeholder:text-xs focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <CommandList>
                <CommandEmpty>No address found.</CommandEmpty>
                <CommandGroup>
                  {suggestions.map((suggestion, index) => (
                    <CommandItem key={index} onSelect={() => handleSuggestionClick(suggestion)}>
                      {suggestion.description}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default LocationSelectorAsync;
