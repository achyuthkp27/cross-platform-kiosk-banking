package com.kiosk.backend.service;

import com.kiosk.backend.entity.Card;
import com.kiosk.backend.repository.CardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CardServiceTest {

    @Mock
    private CardRepository cardRepository;

    @InjectMocks
    private CardService cardService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void replaceCard_ShouldBlockOldCardAndReturnReference() {
        Long cardId = 1L;
        Card existingCard = new Card();
        existingCard.setId(cardId);
        existingCard.setStatus("ACTIVE");
        existingCard.setUserId("USER123");

        when(cardRepository.findById(cardId)).thenReturn(Optional.of(existingCard));
        when(cardRepository.save(any(Card.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String referenceId = cardService.replaceCard(cardId, "Lost Card", "123 Main St");

        assertNotNull(referenceId);
        assertTrue(referenceId.startsWith("REP-"));
        assertEquals("BLOCKED", existingCard.getStatus());
        verify(cardRepository).save(existingCard);
    }

    @Test
    void replaceCard_ShouldHandleAlreadyBlockedCard() {
        Long cardId = 2L;
        Card existingCard = new Card();
        existingCard.setId(cardId);
        existingCard.setStatus("BLOCKED");

        when(cardRepository.findById(cardId)).thenReturn(Optional.of(existingCard));

        String referenceId = cardService.replaceCard(cardId, "Damaged", "123 Main St");

        assertNotNull(referenceId);
        // Should not save/update status if already blocked, or just save same state
        // The service logic currently saves only if not blocked, or maybe it just skips
        // status update
        // "if ("BLOCKED".equals(card.getStatus())) { // If already blocked, just
        // proceed with replacement request } else { card.setStatus("BLOCKED");
        // cardRepository.save(card); }"

        verify(cardRepository, never()).save(existingCard);
    }

    @Test
    void replaceCard_ShouldThrowIfNotFound() {
        Long cardId = 99L;
        when(cardRepository.findById(cardId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> cardService.replaceCard(cardId, "Lost", "Addr"));
    }
}
