package com.example.backend;

import com.example.backend.dto.response.google.GoogleApiResponseDto;
import com.example.backend.service.GooglePlaceService;
import org.hibernate.service.spi.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class GooglePlaceServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private GooglePlaceService googlePlaceService;

    @BeforeEach
    public void setup() {
    }

    @Test
    public void testSearchNearbyPlaces() {
        double lat = 40.7128;
        double lon = -74.0060;
        double radius = 1000;
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(new ResponseEntity<>(new GoogleApiResponseDto(), HttpStatus.OK));

        GoogleApiResponseDto response = googlePlaceService.searchNearbyPlaces(lat, lon, radius);
        assertNotNull(response);
    }

    @Test
    public void testSearchNearbyPlacesWithEmptyResponse() {
        GoogleApiResponseDto emptyResponse = new GoogleApiResponseDto();
        emptyResponse.setPlaces(Collections.emptyList());
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(new ResponseEntity<>(emptyResponse, HttpStatus.OK));

        GoogleApiResponseDto response = googlePlaceService.searchNearbyPlaces(40.7128, -74.0060, 1000.0);
        assertNotNull(response);
        assertTrue(response.getPlaces() != null && response.getPlaces().isEmpty()); // Boş liste kontrolü
    }

    @Test
    public void testSearchNearbyPlacesWithErrorResponse() {
        when(restTemplate.postForEntity(anyString(), any(), any()))
                .thenThrow(ServiceException.class);

        Exception exception = assertThrows(ServiceException.class, () -> googlePlaceService.searchNearbyPlaces(40.7128, -74.0060, 1000.0));

        String expectedMessage = "Error calling Google Places API";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
    }


}