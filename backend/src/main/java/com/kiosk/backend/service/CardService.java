package com.kiosk.backend.service;

import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@Service
public class CardService {

    public Map<String, Object> blockCard(String cardId, String reason) {
        // Logic to update card status in DB would go here
        Map<String, Object> result = new HashMap<>();
        result.put("status", "BLOCKED");
        result.put("referenceId", "BLK-" + UUID.randomUUID().toString().substring(0, 8));
        return result;
    }

    public Map<String, Object> unblockCard(String cardId) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "ACTIVE");
        return result;
    }

    public Map<String, Object> replaceCard(String cardId, String reason, String address) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "REPLACEMENT_REQUESTED");
        result.put("newCardId", "REQ-" + UUID.randomUUID().toString().substring(0, 8));
        result.put("deliveryEstimate", "5-7 Days");
        return result;
    }
}
