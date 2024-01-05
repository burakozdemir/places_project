package com.example.backend.service;

import com.example.backend.dto.response.google.GoogleApiResponseDto;
import com.example.backend.model.SearchRecord;
import com.example.backend.repository.SearchRecordRepository;
import com.example.backend.util.GoogleApiResponseToSearchRecordConvertor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class PlaceService {

    @Autowired
    private SearchRecordRepository searchRecordRepository;

    @Autowired
    private GooglePlaceService googlePlacesService;

    @Autowired
    private GoogleApiResponseToSearchRecordConvertor googleApiResponseToSearchRecordConvertor;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    @Cacheable(value = "searchRecords", key = "#latitude + '_' + #longitude + '_' + #radius")
    public SearchRecord getNearbyPlaces(double latitude, double longitude, double radius) {
        SearchRecord searchRecord = searchRecordRepository.findSearchRecordByLatitudeAndLongitudeAndRadius(latitude, longitude, radius);

        if (searchRecord != null) {
            return searchRecord;
        }

        GoogleApiResponseDto apiResponse = googlePlacesService.searchNearbyPlaces(latitude, longitude, radius);

        if(apiResponse.getPlaces() != null && apiResponse.getPlaces().size() > 0){
            searchRecord = googleApiResponseToSearchRecordConvertor.convert(apiResponse);
            searchRecord.setLatitude(latitude);
            searchRecord.setLongitude(longitude);
            searchRecord.setRadius(radius);

            saveSearchRecord(searchRecord);

        }else{
            searchRecord = new SearchRecord();
            searchRecord.setLatitude(latitude);
            searchRecord.setLongitude(longitude);
            searchRecord.setRadius(radius);
            searchRecord.setTimestamp(new Date());
        }

        return searchRecord;
    }

    @Async
    public void saveSearchRecord(SearchRecord searchRecord) {
        searchRecordRepository.save(searchRecord);
    }
}
