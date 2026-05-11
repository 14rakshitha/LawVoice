package com.lawvoice.repository;

import com.lawvoice.model.QueryHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueryHistoryRepository extends JpaRepository<QueryHistory, Long> {
    List<QueryHistory> findTop25ByUserIdOrderByCreatedAtDesc(String userId);
}
