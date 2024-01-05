package com.example.backend;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.backend.controller.PlaceController;
import com.example.backend.model.SearchRecord;
import com.example.backend.service.PlaceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
public class PlaceControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PlaceService placeService;

    @InjectMocks
    private PlaceController placeController;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(placeController).build();
    }

    @Test
    public void testFetchPlaces() throws Exception {
        SearchRecord mockSearchRecord = new SearchRecord();
        when(placeService.getNearbyPlaces(anyDouble(), anyDouble(), anyDouble())).thenReturn(mockSearchRecord);

        mockMvc.perform(get("/place/v1")
                        .param("lat", "40.7128")
                        .param("lon", "-74.0060")
                        .param("radius", "1000"))
                .andExpect(status().isOk());
    }

    @Test
    public void testFetchPlacesWithInvalidParameters() throws Exception {
        mockMvc.perform(get("/place/v1")
                        .param("lat", "91")
                        .param("lon", "-74.0060")
                        .param("radius", "1000"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/place/v1")
                        .param("lat", "40.7128")
                        .param("radius", "1000"))
                .andExpect(status().isBadRequest());
    }
}

