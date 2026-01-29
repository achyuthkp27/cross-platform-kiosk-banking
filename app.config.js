module.exports = ({ config }) => {
    // Check if building for GitHub Pages
    const isGitHubPages = process.env.BUILD_TARGET === 'ghpages';

    return {
        ...config,
        experiments: {
            ...config.experiments,
            // Only set baseUrl for GitHub Pages builds
            ...(isGitHubPages && { baseUrl: '/cross-platform-kiosk-banking' }),
        },
    };
};
