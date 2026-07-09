import path from 'node:path';

const repoRoot = path.resolve(process.cwd(), '../..');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    turbopack: {
        root: repoRoot,
    },
};

export default nextConfig;
