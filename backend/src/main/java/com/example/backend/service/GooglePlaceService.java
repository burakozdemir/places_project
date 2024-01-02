package com.example.backend.service;

import com.example.backend.dto.request.google.GoogleApiRequestCenterDto;
import com.example.backend.dto.request.google.GoogleApiRequestCircleDto;
import com.example.backend.dto.request.google.GoogleApiRequestLocationRestriction;
import com.example.backend.dto.request.google.GoogleApiRequestSearchNearbyDto;
import com.example.backend.dto.response.google.GoogleApiResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GooglePlaceService {

    @Autowired
    private RestTemplate restTemplate;

    public GoogleApiResponseDto searchNearbyPlaces(Double latitude, Double longitude, Double radius) {
        String url = "https://places.googleapis.com/v1/places:searchNearby";
        String apiKey = "AIzaSyDDhl-OSSGdhY7dgCALcR2ZkgYNbhyd5T8";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Goog-Api-Key", apiKey);
        headers.set("X-Goog-FieldMask", "places.displayName,places.id,places.location");

        GoogleApiRequestSearchNearbyDto request = new GoogleApiRequestSearchNearbyDto(
                new GoogleApiRequestLocationRestriction(
                        new GoogleApiRequestCircleDto(
                                new GoogleApiRequestCenterDto(latitude, longitude),
                                radius
                        )
                ),
                List.of("restaurant"),
                10
        );

        HttpEntity<GoogleApiRequestSearchNearbyDto> entity = new HttpEntity<>(request, headers);

        ResponseEntity<GoogleApiResponseDto> response = restTemplate.postForEntity(url, entity, GoogleApiResponseDto.class);

        return response.getBody();
    }
}

