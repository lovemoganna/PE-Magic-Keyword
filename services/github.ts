
export interface GithubConfig {
    token: string;
    owner: string;
    repo: string;
    path: string;
}

const STORAGE_KEY = 'github_sync_config';

export const getGithubConfig = (): GithubConfig | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
};

export const saveGithubConfig = (config: GithubConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const syncToGithub = async (content: string): Promise<void> => {
    const config = getGithubConfig();
    if (!config || !config.token || !config.owner || !config.repo) {
        throw new Error("GitHub configuration missing. Please check settings.");
    }

    const { token, owner, repo, path } = config;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    // 1. Get current SHA
    const getResponse = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!getResponse.ok) {
        if (getResponse.status === 404) {
            throw new Error("File not found in repository. Please check path.");
        }
        throw new Error(`Failed to fetch file info: ${getResponse.statusText}`);
    }

    const getData = await getResponse.json();
    const sha = getData.sha;

    // 2. Update file
    // GitHub requires content to be Base64 encoded
    // Using simple btoa for now (works for ASCII/UTF-8 mostly, but proper encoding is safer)
    // For proper UTF-8 handling in browser:
    const base64Content = btoa(unescape(encodeURIComponent(content)));

    const putResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            message: `chore: update keywords data via Admin UI [${new Date().toISOString()}]`,
            content: base64Content,
            sha: sha
        })
    });

    if (!putResponse.ok) {
        const errorData = await putResponse.json();
        throw new Error(`GitHub Sync Failed: ${errorData.message}`);
    }
};
