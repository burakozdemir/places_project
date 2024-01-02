package com.example.backend.dto.request.google;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class GoogleApiRequestLocationRestriction {
    private GoogleApiRequestCircleDto circle;
}
