package com.example.backend.controller;

import com.example.backend.model.SearchRecord;
import com.example.backend.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<SearchRecord> fetchPlaces(@RequestParam Double lat, @RequestParam Double lon, @RequestParam Double radius) {
        SearchRecord places = service.getNearbyPlaces(lat,lon,radius);
        return ResponseEntity.ok(places);
    }
}
