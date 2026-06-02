package com.lawvoice.repository;

import com.lawvoice.model.QueryHistory;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class QueryHistoryRepository {
    private final AtomicLong ids = new AtomicLong(1);
    private final CopyOnWriteArrayList<QueryHistory> rows = new CopyOnWriteArrayList<>();

    public QueryHistory save(QueryHistory history) {
        history.setId(ids.getAndIncrement());
        rows.add(history);
        return history;
    }

    public List<QueryHistory> findTop25ByUserIdOrderByCreatedAtDesc(String userId) {
        return rows.stream()
                .filter(row -> userId != null && userId.equals(row.getUserId()))
                .sorted(Comparator.comparing(QueryHistory::getCreatedAt).reversed())
                .limit(25)
                .toList();
    }
}
