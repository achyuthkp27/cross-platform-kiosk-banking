/**
 * Kiosk Mode Utilities
 * 
 * Provides utilities for kiosk-specific behavior:
 * - Fullscreen management
 * - Focus trapping
 * - Right-click prevention
 * - Keyboard shortcut blocking
 */

// Browser-specific fullscreen API interfaces (vendor-prefixed)
interface VendorFullscreenElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
}

interface VendorFullscreenDocument {
    webkitFullscreenElement?: Element | null;
    mozFullScreenElement?: Element | null;
    msFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
}

/**
 * Request fullscreen mode for the document element
 */
export const enterFullscreen = async (): Promise<boolean> => {
    try {
        const docEl = document.documentElement as HTMLElement & VendorFullscreenElement;

        if (docEl.requestFullscreen) {
            await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
            await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
            await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
            await docEl.msRequestFullscreen();
        } else {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Failed to enter fullscreen:', error);
        return false;
    }
};

/**
 * Exit fullscreen mode
 */
export const exitFullscreen = async (): Promise<boolean> => {
    try {
        const doc = document as Document & VendorFullscreenDocument;

        if (doc.exitFullscreen) {
            await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
            await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
            await doc.msExitFullscreen();
        } else {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Failed to exit fullscreen:', error);
        return false;
    }
};

/**
 * Check if currently in fullscreen mode
 */
export const isFullscreen = (): boolean => {
    const doc = document as Document & VendorFullscreenDocument;
    return !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
    );
};

/**
 * Toggle fullscreen mode
 */
export const toggleFullscreen = async (): Promise<boolean> => {
    if (isFullscreen()) {
        return exitFullscreen();
    } else {
        return enterFullscreen();
    }
};

/**
 * Prevent right-click context menu
 */
export const preventContextMenu = (): (() => void) => {
    const handler = (e: MouseEvent) => {
        e.preventDefault();
        return false;
    };

    document.addEventListener('contextmenu', handler);

    return () => {
        document.removeEventListener('contextmenu', handler);
    };
};

/**
 * Block common keyboard shortcuts that could exit kiosk mode
 */
export const blockKioskEscapeShortcuts = (): (() => void) => {
    const handler = (e: KeyboardEvent) => {
        // Block F11 (fullscreen toggle)
        if (e.key === 'F11') {
            e.preventDefault();
            return false;
        }

        // Block Ctrl/Cmd + W (close tab)
        if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
            e.preventDefault();
            return false;
        }

        // Block Ctrl/Cmd + T (new tab)
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            return false;
        }

        // Block Ctrl/Cmd + N (new window)
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            return false;
        }

        // Block Alt + F4 (Windows close)
        if (e.altKey && e.key === 'F4') {
            e.preventDefault();
            return false;
        }

        return true;
    };

    document.addEventListener('keydown', handler);

    return () => {
        document.removeEventListener('keydown', handler);
    };
};

/**
 * Create a focus trap within a container element
 */
export const createFocusTrap = (container: HTMLElement): (() => void) => {
    const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const handler = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        const focusableElements = container.querySelectorAll(focusableSelectors);
        const focusableArray = Array.from(focusableElements) as HTMLElement[];

        if (focusableArray.length === 0) return;

        const firstElement = focusableArray[0];
        const lastElement = focusableArray[focusableArray.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    container.addEventListener('keydown', handler);

    return () => {
        container.removeEventListener('keydown', handler);
    };
};

/**
 * Initialize kiosk mode with all protections
 */
export const initKioskMode = (options: {
    fullscreen?: boolean;
    preventContext?: boolean;
    blockShortcuts?: boolean;
} = {}): (() => void) => {
    const cleanupFns: Array<() => void> = [];

    if (options.fullscreen !== false) {
        enterFullscreen();
    }

    if (options.preventContext !== false) {
        cleanupFns.push(preventContextMenu());
    }

    if (options.blockShortcuts !== false) {
        cleanupFns.push(blockKioskEscapeShortcuts());
    }

    return () => {
        cleanupFns.forEach(fn => fn());
        if (options.fullscreen !== false) {
            exitFullscreen();
        }
    };
};

export default {
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
    toggleFullscreen,
    preventContextMenu,
    blockKioskEscapeShortcuts,
    createFocusTrap,
    initKioskMode,
};
