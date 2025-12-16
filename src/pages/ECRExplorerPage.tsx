import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { ECRRepository, ECRImageDetails } from '../types';
import { Database, Search, ChevronRight, Package, Calendar, HardDrive } from 'lucide-react';

const ECRExplorerPage: React.FC = () => {
    const [repos, setRepos] = useState<ECRRepository[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<ECRRepository | null>(null);
    const [images, setImages] = useState<ECRImageDetails[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(true);
    const [loadingImages, setLoadingImages] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadRepos();
    }, []);

    useEffect(() => {
        if (selectedRepo) {
            loadImages(selectedRepo.repositoryName);
        }
    }, [selectedRepo]);

    const loadRepos = async () => {
        try {
            const data = await api.getECRRepos();
            setRepos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingRepos(false);
        }
    };

    const loadImages = async (repoName: string) => {
        setLoadingImages(true);
        setImages([]);
        try {
            const data = await api.getECRImages(repoName);
            setImages(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingImages(false);
        }
    };

    const filteredRepos = repos.filter(r => r.repositoryName.includes(searchTerm));

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="animate-fade-in h-[calc(100vh-140px)] flex flex-col">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="heading-lg mb-2">ECR Explorer</h2>
                    <p className="text-slate-400">Browse repositories and inspection images.</p>
                </div>
            </header>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Repo List */}
                <div className="w-1/3 flex flex-col glass-panel overflow-hidden">
                    <div className="p-4 border-b border-[var(--border-color)]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                className="input-field pl-10 py-2 text-sm"
                                placeholder="Search repositories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                        {loadingRepos ? (
                            <div className="text-center p-8 text-slate-500">Loading...</div>
                        ) : filteredRepos.length > 0 ? (
                            filteredRepos.map(repo => (
                                <button
                                    key={repo.repositoryName}
                                    onClick={() => setSelectedRepo(repo)}
                                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between group transition-all ${selectedRepo?.repositoryName === repo.repositoryName
                                        ? 'bg-blue-500/20 border border-blue-500/50 text-white'
                                        : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Database size={18} className={selectedRepo?.repositoryName === repo.repositoryName ? 'text-blue-400' : 'text-slate-500'} />
                                        <span className="truncate font-medium">{repo.repositoryName}</span>
                                    </div>
                                    <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${selectedRepo?.repositoryName === repo.repositoryName ? 'opacity-100 text-blue-400' : 'text-slate-500'
                                        }`} />
                                </button>
                            ))
                        ) : (
                            <div className="text-center p-8 text-slate-500">No repositories found.</div>
                        )}
                    </div>
                </div>

                {/* Image List (Detail) */}
                <div className="flex-1 glass-panel flex flex-col overflow-hidden">
                    {selectedRepo ? (
                        <>
                            <div className="p-6 border-b border-[var(--border-color)] bg-slate-900/30">
                                <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
                                    <Database size={16} />
                                    <span>Repository</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white break-all">{selectedRepo.repositoryName}</h3>
                                <p className="text-slate-400 text-sm mt-1 font-mono">{selectedRepo.repositoryUri}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-0">
                                {loadingImages ? (
                                    <div className="p-12 text-center text-slate-500">Loading images...</div>
                                ) : images.length > 0 ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-[var(--bg-app)] shadow-sm z-10">
                                            <tr className="text-slate-400 text-xs uppercase tracking-wider">
                                                <th className="p-4 font-medium">Tags</th>
                                                <th className="p-4 font-medium">Size</th>
                                                <th className="p-4 font-medium">Pushed At</th>
                                                <th className="p-4 font-medium">Digest</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border-color)]">
                                            {images.map((img, idx) => (
                                                <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                                                    <td className="p-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {img.imageTags && img.imageTags.map(tag => (
                                                                <span key={tag} className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            {(!img.imageTags || img.imageTags.length === 0) && (
                                                                <span className="text-slate-600 text-xs italic">untagged</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-slate-300 text-sm font-mono">
                                                        <div className="flex items-center gap-2">
                                                            <HardDrive size={14} className="text-slate-600" />
                                                            {formatBytes(img.imageSizeInBytes)}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-slate-300 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} className="text-slate-600" />
                                                            {new Date(img.imagePushedAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-slate-500 text-xs font-mono truncate max-w-[150px]" title={img.imageDigest}>
                                                        {img.imageDigest.substring(0, 12)}...
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                        <Package size={48} className="mb-4 opacity-20" />
                                        <p>No images found in this repository.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <Database size={64} className="mb-6 opacity-20" />
                            <p className="text-lg">Select a repository to view images</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ECRExplorerPage;
