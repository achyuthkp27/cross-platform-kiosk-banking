package com.kiosk.backend.repository;

import com.kiosk.backend.entity.AccountStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AccountStatementRepository extends JpaRepository<AccountStatement, Long> {
    List<AccountStatement> findByAccountIdOrderByTxnDateDesc(Long accountId);
}
