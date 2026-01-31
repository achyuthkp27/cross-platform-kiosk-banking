package com.kiosk.backend.controller;

import com.kiosk.backend.entity.Card;
import com.kiosk.backend.service.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/cards")
@CrossOrigin(origins = "*")
public class CardController {

    private final CardService service;

    public CardController(CardService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCards(
            org.springframework.security.core.Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        // Normalize userId (uppercase)
        String normalizedUserId = userId.toUpperCase();
        System.out.println("[DEBUG] Fetching cards for userId: " + normalizedUserId);
        List<Card> cards = service.getCardsByUserId(normalizedUserId);
        System.out.println("[DEBUG] Found " + cards.size() + " cards");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", cards);
        response.put("message", cards.isEmpty() ? "No cards found" : "Cards fetched successfully");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{cardId}/block")
    public ResponseEntity<Map<String, Object>> blockCard(@PathVariable Long cardId) {
        // Todo: Verify card belongs to authentication.getPrincipal()
        try {
            Card card = service.blockCard(cardId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Card blocked successfully",
                    "data", card));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/request")
    public ResponseEntity<Map<String, Object>> requestCard(
            org.springframework.security.core.Authentication authentication,
            @RequestBody Map<String, Object> request) {
        try {
            String userId = ((String) authentication.getPrincipal()).toUpperCase();
            Long accountId = Long.parseLong(request.get("accountId").toString());
            String type = (String) request.get("type"); // DEBIT or CREDIT

            Card card = service.requestNewCard(userId, accountId, type);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "New card requested successfully",
                    "data", card));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to request card: " + e.getMessage()));
        }
    }
}
