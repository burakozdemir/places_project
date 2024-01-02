package com.example.backend.dto.response.google;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class GoogleApiResponsePlaceDto {
    private String id;
    private GoogleApiResponseLocationDto location;
    private GoogleApiResponseDisplayNameDto displayName;
}
