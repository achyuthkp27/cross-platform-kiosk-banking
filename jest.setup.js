require('@testing-library/jest-dom');

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    usePathname: () => '/dashboard',
    useRootNavigationState: () => ({ key: 'test-key' }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
    const React = require('react');
    return {
        motion: {
            div: ({ children, ...props }) => React.createElement('div', props, children),
            span: ({ children, ...props }) => React.createElement('span', props, children),
        },
        AnimatePresence: ({ children }) => children,
    };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
