import {get, writable} from 'svelte/store';

const data = writable<Map<string, object>>(new Map<string, object>());

const read = (path: string): object => {
    return get(data).get(path);
}
const write = (path: string, newEntry: object) => {
    data.update((state) => state.set(path, newEntry));
}

export async function getData(path: string,  callback: (data: object) => void): Promise<void> {
    const absolutePath = `${import.meta.env.BASE_URL}/${path}`;
    const val = read(absolutePath);
    if (val === undefined) {
        await fetch(absolutePath)
            .then((r) => r.json())
            .then((jsonData) => {
                write(absolutePath, jsonData);
                callback(jsonData);
            });       
        return;
    }
    callback(val);
}
