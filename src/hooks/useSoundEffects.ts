import { useCallback, useRef, useEffect } from 'react';

type SoundType = 'click' | 'success' | 'error' | 'swoosh' | 'keypress';

const SOUND_URLS: Record<SoundType, string> = {
    // Using data URLs for instant loading - these are short, synthesized sounds
    click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFgoKGhYaGgoGCh4WHhYKCiIiGhYKChoqIhoOBhIiKiIaEg4WIioiGhIOEiIqIhoSDhoiKh4WEhIaIioeGhYWGiIqHhoWFhoiJh4aFhYaIiYeGhYWGiImHhoWFhomJh4aFhYaJiYeGhYWGiYmHhoWFhomJh4aFhYaJiYeGhQ==',
    success: 'data:audio/wav;base64,UklGRl9vAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhUW8AAHt7e3t7e3t7fHx8fHx8fHx9fX19fX19fX5+fn5+fn5+f39/f39/f39',
    error: 'data:audio/wav;base64,UklGRl9vAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhUW8AAHt7e3t7e3t7fHx8fHx8fHx9fX19fX19fX5+fn5+fn5+f39/f39/f39',
    swoosh: 'data:audio/wav;base64,UklGRl9vAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhUW8AAHt7e3t7e3t7fHx8fHx8fHx9fX19fX19fX5+fn5+fn5+f39/f39/f39',
    keypress: 'data:audio/wav;base64,UklGRl9vAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhUW8AAHt7e3t7e3t7fHx8fHx8fHx9fX19fX19fX5+fn5+fn5+f39/f39/f39',
};

interface UseSoundEffectsOptions {
    volume?: number;
    enabled?: boolean;
}

/**
 * Premium sound effects hook for tactile audio feedback.
 * Uses Web Audio API for low-latency playback.
 */
export function useSoundEffects(options: UseSoundEffectsOptions = {}) {
    const { volume = 0.3, enabled = true } = options;
    const audioContextRef = useRef<AudioContext | null>(null);
    const bufferCache = useRef<Map<SoundType, AudioBuffer>>(new Map());

    // Initialize AudioContext on first interaction
    useEffect(() => {
        const initAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            }
        };
        
        // Lazy init on user interaction (required by browsers)
        const handleInteraction = () => {
            initAudio();
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };
        
        document.addEventListener('click', handleInteraction);
        document.addEventListener('keydown', handleInteraction);
        
        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    // Preload sounds
    useEffect(() => {
        const preloadSounds = async () => {
            if (!audioContextRef.current) return;
            
            for (const [type, url] of Object.entries(SOUND_URLS)) {
                try {
                    const response = await fetch(url);
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
                    bufferCache.current.set(type as SoundType, audioBuffer);
                } catch {
                    // Silently fail - sounds are optional enhancement
                }
            }
        };
        
        preloadSounds();
    }, []);

    const play = useCallback((type: SoundType) => {
        if (!enabled || !audioContextRef.current) return;
        
        const buffer = bufferCache.current.get(type);
        if (!buffer) {
            // Fallback to HTML5 Audio if buffer not ready
            const audio = new Audio(SOUND_URLS[type]);
            audio.volume = volume;
            audio.play().catch(() => {});
            return;
        }
        
        const source = audioContextRef.current.createBufferSource();
        const gainNode = audioContextRef.current.createGain();
        
        source.buffer = buffer;
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        source.start(0);
    }, [enabled, volume]);

    return {
        playClick: useCallback(() => play('click'), [play]),
        playSuccess: useCallback(() => play('success'), [play]),
        playError: useCallback(() => play('error'), [play]),
        playSwoosh: useCallback(() => play('swoosh'), [play]),
        playKeypress: useCallback(() => play('keypress'), [play]),
    };
}

export default useSoundEffects;
