import type { NextConfig } from 'next';

const config: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'oaidalleapiprodscus.blob.core.windows.net',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default config;
