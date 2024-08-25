import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import EmptyContentWrapper from '@/components/shared/empty-content-wrapper';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import HotelCard from '../../hotel-card';

type HotelListProps = {
  city: string | null;
  state: string | null;
  country: string | null;
  setSelectedHotelFromSidebar: (hotel: { name: string; id: string | number }) => void;
};

type PlaceResult = google.maps.places.PlaceResult;

interface DetailedHotel extends PlaceResult {
  detailedAmenities?: {
    bar: boolean;
    gym: boolean;
    spa: boolean;
    pool: boolean;
    night_club: boolean;
    restaurant: boolean;
  };
}

const HotelList: React.FC<HotelListProps> = ({ city, state, country, setSelectedHotelFromSidebar }) => {
  const [hotels, setHotels] = useState<DetailedHotel[]>([]);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (city && state && country) {
      const location = `${city}, ${state}, ${country}`;
      if (!placesServiceRef.current) {
        placesServiceRef.current = new google.maps.places.PlacesService(document.createElement('div'));
      }
      const request = {
        query: `hotels in ${location}`,
        fields: [
          'name',
          'formatted_address',
          'rating',
          'user_ratings_total',
          'price_level',
          'photos',
          'place_id',
          'website',
          'formatted_phone_number',
          'vicinity',
        ],
      };
      placesServiceRef.current.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const detailedResults = results.map(result => ({ ...result, detailedAmenities: undefined }));
          setHotels(detailedResults);
          detailedResults.forEach(hotel => fetchDetailedInfo(hotel));
        }
      });
    }
  }, [city, state, country]);

  const fetchDetailedInfo = (hotel: DetailedHotel) => {
    if (placesServiceRef.current && hotel.place_id) {
      const request = {
        placeId: hotel.place_id,
        fields: ['price_level', 'types'],
      };
      placesServiceRef.current.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          console.log(place.types);
          setHotels(prevHotels =>
            prevHotels.map(h =>
              h.place_id === hotel.place_id
                ? {
                    ...h,
                    price_level: place.price_level,
                    detailedAmenities: {
                      bar: place.types?.includes('bar') ?? false,
                      gym: place.types?.includes('gym') ?? false,
                      spa: place.types?.includes('spa') ?? false,
                      pool: place.types?.includes('swimming_pool') ?? false,
                      night_club: place.types?.includes('night_club') ?? false,
                      restaurant: place.types?.includes('restaurant') ?? false,
                    },
                  }
                : h,
            ),
          );
        }
      });
    }
  };

  const formatPriceLevel = (priceLevel: number | undefined): string => {
    if (priceLevel === undefined) return 'Price information not available';
    return '$'.repeat(priceLevel);
  };

  return (
    <div className="mt-4">
      <EmptyContentWrapper
        customMessage="No hotels found in this location."
        className="mt-6 h-full rounded-md py-16 text-text-dim"
        isEmpty={hotels?.length === 0}
      >
        <article className="">
          <div className="flex items-center justify-between">
            <Text className="text-sm ">
              Hotels in {city}, {state}, {country}:
            </Text>
          </div>

          {hotels.map((hotel, index) => {
            return (
              <HotelCard
                setSelectedHotelFromSidebar={setSelectedHotelFromSidebar}
                key={index}
                id={hotel.place_id ?? ''}
                direction={hotel.vicinity}
                title={hotel.name ?? ''}
                location={hotel.formatted_address ?? ''}
                price={155555}
                discount={258988}
                img={
                  hotel.photos && hotel.photos.length > 0
                    ? hotel.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
                    : '/images/dashboard/hotel.png'
                }
                rating={hotel.rating}
                ratingCount={hotel.user_ratings_total}
              ></HotelCard>
            );
          })}
        </article>
      </EmptyContentWrapper>
    </div>
  );
};

export default HotelList;
