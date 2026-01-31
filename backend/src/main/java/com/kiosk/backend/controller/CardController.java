package com.kiosk.backend.controller;

import com.kiosk.backend.service.CardService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/v1/cards")
@CrossOrigin(origins = "*")
public class CardController {

    private final CardService service;

    public CardController(CardService service) {
        this.service = service;
    }

    @PostMapping("/{cardId}/block")
    public Map<String, Object> blockCard(@PathVariable String cardId, @RequestBody Map<String, String> body) {
        return service.blockCard(cardId, body.get("reason"));
    }

    @PostMapping("/{cardId}/unblock")
    public Map<String, Object> unblockCard(@PathVariable String cardId) {
        return service.unblockCard(cardId);
    }

    @PostMapping("/{cardId}/replace")
    public Map<String, Object> replaceCard(@PathVariable String cardId, @RequestBody Map<String, String> body) {
        return service.replaceCard(cardId, body.get("reason"), body.get("address"));
    }
}
