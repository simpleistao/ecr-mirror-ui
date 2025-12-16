export interface RegistryConfig {
    registryUrl: string;
    ecrRepoName: string;
}

export type MirrorType = 'image' | 'chart';

export interface MirrorRequest {
    sourceUrl: string;
    type: MirrorType;
}

export interface ECRRepository {
    repositoryName: string;
    repositoryUri: string;
    createdAt: string;
}

export interface ECRImageDetails {
    imageDigest: string;
    imageTags: string[];
    imageSizeInBytes: number;
    imagePushedAt: string;
}

export interface PullRequestResult {
    prUrl: string;
    status: 'created' | 'failed';
}
