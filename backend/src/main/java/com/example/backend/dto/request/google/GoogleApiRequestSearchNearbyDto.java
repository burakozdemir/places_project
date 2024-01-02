package com.example.backend.dto.request.google;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class GoogleApiRequestSearchNearbyDto {
    private GoogleApiRequestLocationRestriction locationRestriction;
    private List<String> includedTypes;
    private int maxResultCount;

}
