import fs from 'fs';
import path from 'path';
import { useReduceURL } from '../utils/useReduceURL.js';
import { getDirname } from '../utils/getDirname.js';

const __dirname = getDirname(import.meta.url);

export const getAuditFolders = (site) => {
    const baseURL = useReduceURL(site);
    const domainFolderPath = path.join(__dirname, '..', 'audits', baseURL);

    if (!fs.existsSync(domainFolderPath)) {
        throw new Error('No audit found');
    }

    const auditFolders = fs.readdirSync(domainFolderPath).filter(file => {
        return fs.statSync(path.join(domainFolderPath, file)).isDirectory();
    });

    return { domainFolderPath, auditFolders };
};

export const getAuditDetails = (domainFolderPath, folder) => {
    const folderPath = path.join(domainFolderPath, folder);
    const files = fs.readdirSync(folderPath);

    const auditDetails = files.map(file => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            return {
                file,
                size: stats.size,
                createdAt: stats.birthtime,
            };
        }
        return null;
    }).filter(Boolean); // Filter out null values

    return auditDetails;
};

export const getReportTree = (site, audit) => {
    const baseURL = useReduceURL(site);
    const auditFolderPath = path.join(__dirname, '..', 'audits', baseURL, audit);

    if (!fs.existsSync(auditFolderPath)) {
        throw new Error('Audit not found');
    }

    const readDirectoryRecursive = (dirPath, relativePath = '') => {
        const items = fs.readdirSync(dirPath);
        return items.map(item => {
            const itemPath = path.join(dirPath, item);
            const itemRelativePath = path.join(relativePath, item).replace(/\\/g, '/');
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                return {
                    name: item,
                    type: 'directory',
                    children: readDirectoryRecursive(itemPath, itemRelativePath),
                };
            } else {
                return {
                    name: item,
                    type: 'file',
                    size: stats.size,
                    createdAt: stats.birthtime,
                    relativePath: path.join('audits', site, audit, itemRelativePath).replace(/\\/g, '/'),
                };
            }
        });
    };

    return {
        site,
        audit,
        tree: readDirectoryRecursive(auditFolderPath),
    };
};

export const getSiteTree = (site) => {
    const baseURL = useReduceURL(site);
    const siteFolderPath = path.join(__dirname, '..', 'audits', baseURL);

    if (!fs.existsSync(siteFolderPath)) {
        throw new Error('Site not found');
    }

    const readDirectoryRecursive = (dirPath, relativePath = '') => {
        const items = fs.readdirSync(dirPath);
        return items.map(item => {
            const itemPath = path.join(dirPath, item);
            const itemRelativePath = path.join(relativePath, item).replace(/\\/g, '/');
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                return {
                    name: item,
                    type: 'directory',
                    children: readDirectoryRecursive(itemPath, itemRelativePath),
                };
            } else {
                return {
                    name: item,
                    type: 'file',
                    size: stats.size,
                    createdAt: stats.birthtime,
                    relativePath: path.join('audits', site, itemRelativePath).replace(/\\/g, '/'),
                };
            }
        });
    };

    return {
        site,
        tree: readDirectoryRecursive(siteFolderPath),
    };
};
