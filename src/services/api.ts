import type { RegistryConfig, MirrorRequest, ECRRepository, ECRImageDetails, PullRequestResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USE_MOCK = true; // Set to false to use real backend

// Mock Data
const MOCK_CONFIGS: RegistryConfig[] = [
    { registryUrl: 'docker.io/library/alpine', ecrRepoName: 'mirror/alpine' },
    { registryUrl: 'quay.io/coreos/etcd', ecrRepoName: 'mirror/etcd' },
    { registryUrl: 'gcr.io/google-containers/busybox', ecrRepoName: 'mirror/busybox' },
];

const MOCK_REPOS: ECRRepository[] = [
    { repositoryName: 'mirror/alpine', repositoryUri: '123456789012.dkr.ecr.us-east-1.amazonaws.com/mirror/alpine', createdAt: '2023-01-15T10:00:00Z' },
    { repositoryName: 'mirror/etcd', repositoryUri: '123456789012.dkr.ecr.us-east-1.amazonaws.com/mirror/etcd', createdAt: '2023-02-20T14:30:00Z' },
    { repositoryName: 'mirror/busybox', repositoryUri: '123456789012.dkr.ecr.us-east-1.amazonaws.com/mirror/busybox', createdAt: '2023-03-10T09:15:00Z' },
];

const MOCK_IMAGES: Record<string, ECRImageDetails[]> = {
    'mirror/alpine': [
        { imageDigest: 'sha256:a1b2c3d4...', imageTags: ['latest', '3.18'], imageSizeInBytes: 5000000, imagePushedAt: '2023-10-05T12:00:00Z' },
        { imageDigest: 'sha256:e5f6g7h8...', imageTags: ['3.17'], imageSizeInBytes: 4800000, imagePushedAt: '2023-09-01T10:00:00Z' },
    ],
    'mirror/etcd': [
        { imageDigest: 'sha256:i9j0k1l2...', imageTags: ['v3.5'], imageSizeInBytes: 15000000, imagePushedAt: '2023-10-01T08:00:00Z' },
    ]
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    getConfigs: async (): Promise<RegistryConfig[]> => {
        if (USE_MOCK) {
            await delay(800);
            return [...MOCK_CONFIGS];
        }
        const res = await fetch(`${API_BASE_URL}/configs`);
        if (!res.ok) throw new Error('Failed to fetch configs');
        return res.json();
    },

    submitConfigChange: async (config: RegistryConfig): Promise<PullRequestResult> => {
        if (USE_MOCK) {
            await delay(1500);
            return { prUrl: 'https://github.com/org/repo/pull/123', status: 'created' };
        }
        const res = await fetch(`${API_BASE_URL}/configs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        });
        if (!res.ok) throw new Error('Failed to submit config');
        return res.json();
    },

    requestMirror: async (req: MirrorRequest): Promise<{ success: boolean; message: string }> => {
        if (USE_MOCK) {
            await delay(3000); // Simulate sync wait
            return { success: true, message: `Successfully mirrored ${req.sourceUrl}` };
        }
        const res = await fetch(`${API_BASE_URL}/mirror`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });
        if (!res.ok) throw new Error('Mirror request failed');
        return res.json();
    },

    getECRRepos: async (): Promise<ECRRepository[]> => {
        if (USE_MOCK) {
            await delay(1000);
            return [...MOCK_REPOS];
        }
        const res = await fetch(`${API_BASE_URL}/ecr/repos`);
        if (!res.ok) throw new Error('Failed to fetch ECR repos');
        return res.json();
    },

    getECRImages: async (repoName: string): Promise<ECRImageDetails[]> => {
        if (USE_MOCK) {
            await delay(800);
            return MOCK_IMAGES[repoName] || [];
        }
        const res = await fetch(`${API_BASE_URL}/ecr/repos/${encodeURIComponent(repoName)}/images`);
        if (!res.ok) throw new Error('Failed to fetch images');
        return res.json();
    }
};
