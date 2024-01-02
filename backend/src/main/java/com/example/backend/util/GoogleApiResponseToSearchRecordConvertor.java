package com.example.backend.util;

import com.example.backend.dto.response.google.GoogleApiResponsePlaceDto;
import com.example.backend.dto.response.google.GoogleApiResponseDto;
import com.example.backend.model.Place;
import com.example.backend.model.SearchRecord;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;


@Component
public class GoogleApiResponseToSearchRecordConvertor implements Converter<GoogleApiResponseDto, SearchRecord> {
    @Override
    public SearchRecord convert(GoogleApiResponseDto source) {
        SearchRecord searchRecord = new SearchRecord();

        source.getPlaces().forEach(placeDto -> {
            Place place = convertPlace(placeDto);
            searchRecord.addPlace(place);
        });

        return searchRecord;
    }

    private Place convertPlace(GoogleApiResponsePlaceDto placeDto) {
        Place place = new Place();
        place.setPlaceId(placeDto.getId());
        place.setLatitude(placeDto.getLocation().getLatitude());
        place.setLongitude(placeDto.getLocation().getLongitude());
        place.setPlaceName(placeDto.getDisplayName().getText());
        return place;
    }
}
