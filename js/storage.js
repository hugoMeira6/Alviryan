export function savePreference(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function loadPreference(key, defaultValue = null) {
    const value = localStorage.getItem(key);

    if (value === null) return defaultValue;

    try {
        return JSON.parse(value);
    } catch {
        return defaultValue;
    }
}