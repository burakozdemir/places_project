package com.example.backend.repository;

import com.example.backend.model.SearchRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SearchRecordRepository extends JpaRepository<SearchRecord, Long> {
    SearchRecord findSearchRecordByLatitudeAndLongitudeAndRadius(Double latitude,Double longitude,Double radius);


}
