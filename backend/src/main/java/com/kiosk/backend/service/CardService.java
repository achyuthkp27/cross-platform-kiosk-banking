package com.kiosk.backend.service;

import com.kiosk.backend.entity.Card;
import com.kiosk.backend.repository.CardRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class CardService {

    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public List<Card> getCardsByUserId(String userId) {
        return cardRepository.findByUserId(userId);
    }

    @Transactional
    public Card blockCard(@NonNull Long cardId) {
        Optional<Card> cardOpt = cardRepository.findById(cardId);
        if (cardOpt.isPresent()) {
            Card card = cardOpt.get();
            card.setStatus("BLOCKED");
            return cardRepository.save(card);
        }
        throw new RuntimeException("Card not found");
    }

    @Transactional
    public Card unblockCard(@NonNull Long cardId) {
        Optional<Card> cardOpt = cardRepository.findById(cardId);
        if (cardOpt.isPresent()) {
            Card card = cardOpt.get();
            card.setStatus("ACTIVE");
            return cardRepository.save(card);
        }
        throw new RuntimeException("Card not found");
    }

    @Transactional
    public String replaceCard(@NonNull Long cardId, String reason, String address) {
        Optional<Card> cardOpt = cardRepository.findById(cardId);
        if (cardOpt.isPresent()) {
            Card card = cardOpt.get();
            if ("BLOCKED".equals(card.getStatus())) {
                // If already blocked, just proceed with replacement request
            } else {
                card.setStatus("BLOCKED"); // Block the old card
                cardRepository.save(card);
            }
            // In a real system, we would create a CardReplacementRequest entity
            // For MVP, return a random reference ID
            return "REP-" + new Random().nextInt(100000);
        }
        throw new RuntimeException("Card not found");
    }

    @Transactional
    public Card requestNewCard(String userId, Long accountId, String type) {
        Card card = new Card();
        card.setUserId(userId);
        card.setAccountId(accountId);
        card.setType(type);
        card.setStatus("ACTIVE");

        // Generate random card details for demo
        Random random = new Random();
        StringBuilder cardNumber = new StringBuilder("4"); // Visa starts with 4
        for (int i = 0; i < 15; i++) {
            cardNumber.append(random.nextInt(10));
        }
        card.setNumber(cardNumber.toString());

        card.setCvv(String.format("%03d", random.nextInt(1000)));
        card.setPin(String.format("%04d", random.nextInt(10000)));
        card.setExpiryDate(LocalDate.now().plusYears(5));

        return cardRepository.save(card);
    }
}
