import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { RegistryConfig, PullRequestResult } from '../types';
import { Plus, GitPullRequest, Save, Server } from 'lucide-react';

const ConfigPage: React.FC = () => {
    const [configs, setConfigs] = useState<RegistryConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newConfig, setNewConfig] = useState<RegistryConfig>({ registryUrl: '', ecrRepoName: '' });
    const [prResult, setPrResult] = useState<PullRequestResult | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadConfigs();
    }, []);

    const loadConfigs = async () => {
        try {
            const data = await api.getConfigs();
            setConfigs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.submitConfigChange(newConfig);
            setPrResult(res);
            setShowForm(false);
            setNewConfig({ registryUrl: '', ecrRepoName: '' });
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="heading-lg">Registry Configuration</h2>
                    <p className="text-slate-400">Map external registries to local ECR repositories.</p>
                </div>
                {!showForm && !prResult && (
                    <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        <span>New Mapping</span>
                    </button>
                )}
            </header>

            {prResult && (
                <div className="mb-8 p-6 glass-panel border-l-4 border-green-500 bg-green-500/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                            <GitPullRequest size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-400">Pull Request Created!</h3>
                            <p className="text-slate-300 mt-1">
                                Your configuration change has been submitted.
                                <a href={prResult.prUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 ml-1 underline">
                                    View Pull Request
                                </a>
                            </p>
                        </div>
                        <button onClick={() => setPrResult(null)} className="ml-auto text-slate-400 hover:text-white">
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {showForm && (
                <div className="mb-8 glass-panel p-6 animate-fade-in">
                    <h3 className="text-lg font-bold mb-4">Add New Registry Mapping</h3>
                    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">External Registry URL</label>
                            <input
                                className="input-field"
                                placeholder="e.g. gcr.io/google-containers/busybox"
                                value={newConfig.registryUrl}
                                onChange={e => setNewConfig({ ...newConfig, registryUrl: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Target ECR Repo Name</label>
                            <input
                                className="input-field"
                                placeholder="e.g. mirror/busybox"
                                value={newConfig.ecrRepoName}
                                onChange={e => setNewConfig({ ...newConfig, ecrRepoName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-3 justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary flex items-center gap-2"
                            >
                                {submitting ? 'Submitting...' : <><Save size={18} /> Submit Request</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading configurations...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] text-slate-400 text-sm">
                                <th className="p-4 font-medium">External Registry</th>
                                <th className="p-4 font-medium">Target ECR Repository</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configs.map((config, idx) => (
                                <tr key={idx} className="border-b border-[var(--border-color)] hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <Server size={16} className="text-slate-500" />
                                        {config.registryUrl}
                                    </td>
                                    <td className="p-4 text-slate-300">{config.ecrRepoName}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {configs.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-500">
                                        No mappings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ConfigPage;
