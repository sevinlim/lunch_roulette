export const useLocalStorage = <T extends any>(_key: string) => {
    const getItem = (): T | undefined => {
        try {
            const value = window.localStorage.getItem(_key)
            return value ? JSON.parse(value) : undefined;
        } catch (e) {
            console.error(e)
        }
    }

    const setItem = (_value: T) => {
        try {
            window.localStorage.setItem(_key, JSON.stringify(_value))
        } catch (e) {
            console.error(e)
        }
    }

    const clearItem = () => {
        try {
            window.localStorage.removeItem(_key);
        } catch (e) {
            console.error(e)
        }
    }

    return {
        getItem,
        setItem,
        clearItem
    }
}
