import React, { useState } from 'react';
import { api } from '../services/api';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const MirrorRequestPage: React.FC = () => {
    const [sourceUrl, setSourceUrl] = useState('');
    const [type, setType] = useState<'image' | 'chart'>('image');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sourceUrl) return;

        setLoading(true);
        setStatus(null);

        try {
            const res = await api.requestMirror({ sourceUrl, type });
            setStatus({ type: 'success', message: res.message });
            setSourceUrl('');
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to submit mirror request. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h2 className="heading-lg">Request Mirror</h2>
                <p className="text-slate-400 max-w-2xl">
                    Enter the source URL of the image or Helm chart you wish to mirror to our private ECR registry.
                    The request will be processed immediately.
                </p>
            </header>

            <div className="glass-panel p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Artifact Type</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setType('image')}
                                className={`flex-1 p-4 rounded-xl border transition-all ${type === 'image'
                                        ? 'border-blue-500 bg-blue-500/10 text-white'
                                        : 'border-[var(--border-color)] hover:bg-slate-800'
                                    }`}
                            >
                                <div className="font-semibold mb-1">Container Image</div>
                                <div className="text-xs text-slate-400">Docker/OCI Image</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('chart')}
                                className={`flex-1 p-4 rounded-xl border transition-all ${type === 'chart'
                                        ? 'border-blue-500 bg-blue-500/10 text-white'
                                        : 'border-[var(--border-color)] hover:bg-slate-800'
                                    }`}
                            >
                                <div className="font-semibold mb-1">Helm Chart</div>
                                <div className="text-xs text-slate-400">Kubernetes Package</div>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="source" className="block text-sm font-medium text-slate-300">
                            Source URL
                        </label>
                        <input
                            id="source"
                            type="text"
                            className="input-field"
                            placeholder={type === 'image' ? 'e.g. docker.io/library/nginx:latest' : 'e.g. https://charts.bitnami.com/bitnami/nginx-1.0.0.tgz'}
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !sourceUrl}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Processing Request...</span>
                            </>
                        ) : (
                            <>
                                <span>Start Mirroring</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {status && (
                    <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                        {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <div>
                            <h4 className="font-medium">{status.type === 'success' ? 'Success' : 'Error'}</h4>
                            <p className="text-sm opacity-90">{status.message}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MirrorRequestPage;
