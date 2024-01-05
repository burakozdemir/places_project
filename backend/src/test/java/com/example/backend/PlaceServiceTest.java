package com.example.backend;


import com.example.backend.dto.response.google.GoogleApiResponseDto;
import com.example.backend.model.SearchRecord;
import com.example.backend.repository.SearchRecordRepository;
import com.example.backend.service.GooglePlaceService;
import com.example.backend.service.PlaceService;
import com.example.backend.util.GoogleApiResponseToSearchRecordConvertor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PlaceServiceTest {

    @Mock
    private SearchRecordRepository searchRecordRepository;

    @Mock
    private GooglePlaceService googlePlaceService;

    @InjectMocks
    private PlaceService placeService;

    @BeforeEach
    public void setup() {
        // Mockito annotations init
    }

    @Test
    public void testGetNearbyPlaces() {
        double lat = 40.7128;
        double lon = -74.0060;
        double radius = 1000;
        when(searchRecordRepository.findSearchRecordByLatitudeAndLongitudeAndRadius(lat, lon, radius)).thenReturn(null);
        when(googlePlaceService.searchNearbyPlaces(lat, lon, radius)).thenReturn(new GoogleApiResponseDto());

        SearchRecord result = placeService.getNearbyPlaces(lat, lon, radius);
        assertNotNull(result);
    }

    @Test
    public void testGetNearbyPlacesWithExistingRecord() {
        double lat = 40.7128;
        double lon = -74.0060;
        double radius = 1000;

        SearchRecord existingRecord = new SearchRecord();
        existingRecord.setLatitude(lat);
        existingRecord.setLongitude(lon);
        existingRecord.setRadius(radius);

        when(searchRecordRepository.findSearchRecordByLatitudeAndLongitudeAndRadius(lat, lon, radius)).thenReturn(existingRecord);

        SearchRecord result = placeService.getNearbyPlaces(lat, lon, radius);

        assertNotNull(result);
        assertEquals(lat, result.getLatitude());
        assertEquals(lon, result.getLongitude());
        assertEquals(radius, result.getRadius());

        verify(googlePlaceService, never()).searchNearbyPlaces(lat, lon, radius);
    }

    @Test
    public void testGetNearbyPlacesWithNewApiResponse() {
        double lat = 40.7128;
        double lon = -74.0060;
        double radius = 1000;

        when(searchRecordRepository.findSearchRecordByLatitudeAndLongitudeAndRadius(lat, lon, radius)).thenReturn(null);

        GoogleApiResponseDto apiResponse = new GoogleApiResponseDto();
        when(googlePlaceService.searchNearbyPlaces(lat, lon, radius)).thenReturn(apiResponse);

        SearchRecord result = placeService.getNearbyPlaces(lat, lon, radius);

        assertNotNull(result);
    }


}
