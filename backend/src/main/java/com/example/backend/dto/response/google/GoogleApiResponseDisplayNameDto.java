package com.example.backend.dto.response.google;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class GoogleApiResponseDisplayNameDto {
    private String text;
    private String languageCode;
}
