package com.kiosk.backend.service;

import com.kiosk.backend.entity.KioskConfig;
import com.kiosk.backend.repository.KioskConfigRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ConfigService {

    private final KioskConfigRepository configRepository;

    // Default values if not in database
    private static final Map<String, String> DEFAULTS = Map.of(
            "session_timeout_seconds", "300",
            "otp_expiry_seconds", "300",
            "otp_max_attempts", "3",
            "pin_max_attempts", "3",
            "idle_reset_seconds", "60");

    public ConfigService(KioskConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    /**
     * Get a config value by key
     */
    public String getValue(String key) {
        return configRepository.findByConfigKey(key)
                .map(KioskConfig::getConfigValue)
                .orElse(DEFAULTS.getOrDefault(key, ""));
    }

    /**
     * Get config as integer
     */
    public int getIntValue(String key) {
        String value = getValue(key);
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return Integer.parseInt(DEFAULTS.getOrDefault(key, "0"));
        }
    }

    /**
     * Get config as boolean
     */
    public boolean getBooleanValue(String key) {
        return "true".equalsIgnoreCase(getValue(key));
    }

    /**
     * Get all configurations as a map
     */
    public Map<String, String> getAllConfig() {
        Map<String, String> config = new HashMap<>(DEFAULTS);
        List<KioskConfig> dbConfigs = configRepository.findAll();
        for (KioskConfig c : dbConfigs) {
            config.put(c.getConfigKey(), c.getConfigValue());
        }
        return config;
    }

    /**
     * Update a config value
     */
    public void setValue(String key, String value, Long updatedBy) {
        Optional<KioskConfig> existing = configRepository.findByConfigKey(key);

        KioskConfig config;
        if (existing.isPresent()) {
            config = existing.get();
            config.setConfigValue(value);
        } else {
            config = new KioskConfig();
            config.setConfigKey(key);
            config.setConfigValue(value);
        }

        config.setUpdatedBy(updatedBy);
        configRepository.save(config);
    }

    // Convenience methods for common configs
    public int getSessionTimeoutSeconds() {
        return getIntValue("session_timeout_seconds");
    }

    public int getOtpExpirySeconds() {
        return getIntValue("otp_expiry_seconds");
    }

    public int getOtpMaxAttempts() {
        return getIntValue("otp_max_attempts");
    }

    public int getPinMaxAttempts() {
        return getIntValue("pin_max_attempts");
    }

    public boolean isFeatureEnabled(String feature) {
        return getBooleanValue("enable_" + feature);
    }
}
