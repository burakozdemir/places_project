package com.example.backend.controller;

import com.example.backend.model.SearchRecord;
import com.example.backend.service.PlaceService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/place/v1")
public class PlaceController {
    private final PlaceService service;

    @Autowired
    public PlaceController(PlaceService service) {
        this.service = service;
    }

    @GetMapping("")
    public ResponseEntity<SearchRecord> fetchPlaces(@RequestParam @Valid @DecimalMin("-90") @DecimalMax("90") Double lat,
                                                    @RequestParam @Valid @DecimalMin("-180") @DecimalMax("180") Double lon,
                                                    @RequestParam @Valid @Min(0) Double radius) {
        SearchRecord places = service.getNearbyPlaces(lat,lon,radius);
        return ResponseEntity.ok(places);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        return new ResponseEntity<>("Invalid request parameters", HttpStatus.BAD_REQUEST);
    }
}
