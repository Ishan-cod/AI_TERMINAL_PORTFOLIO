import FILE_SYSTEM from '@/app/components/filesystem.json'

export const getDirectoryAt = (pathArray) => {
    let current = FILE_SYSTEM['~'];
    for (let i = 1; i < pathArray.length; i++) {
        const dirName = pathArray[i];
        if (current.contents && current.contents[dirName] && current.contents[dirName].type === 'dir') {
            current = current.contents[dirName];
        } else {
            return null;
        }
    }
    return current;
};