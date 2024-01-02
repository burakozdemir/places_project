package com.example.backend.dto.response.google;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class GoogleApiResponseDto {
    private List<GoogleApiResponsePlaceDto> places;
}
