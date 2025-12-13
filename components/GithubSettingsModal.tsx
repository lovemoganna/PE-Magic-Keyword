
import React, { useState, useEffect } from 'react';
import { X, Github, Save } from 'lucide-react';
import { GithubConfig, getGithubConfig, saveGithubConfig } from '../services/github';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const GithubSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [config, setConfig] = useState<GithubConfig>({
        token: '',
        owner: 'lovemoganna',
        repo: 'PE-Magic-Keyword',
        path: 'src/data.ts'
    });

    useEffect(() => {
        if (isOpen) {
            const saved = getGithubConfig();
            if (saved) setConfig(saved);
        }
    }, [isOpen]);

    const handleSave = () => {
        saveGithubConfig(config);
        onClose();
        alert('配置已保存！');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <Github size={24} />
                        GitHub 同步设置
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Personal Access Token</label>
                        <input
                            type="password"
                            placeholder="ghp_..."
                            className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={config.token}
                            onChange={e => setConfig({ ...config, token: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">需具备 Repo 读写权限 (Contents permission)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Owner</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                                value={config.owner}
                                onChange={e => setConfig({ ...config, owner: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Repo</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                                value={config.repo}
                                onChange={e => setConfig({ ...config, repo: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">File Path</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={config.path}
                            onChange={e => setConfig({ ...config, path: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700">取消</button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2"
                    >
                        <Save size={18} />
                        保存配置
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GithubSettingsModal;
