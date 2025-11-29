// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
    // Lấy giá trị ban đầu từ localStorage hoặc initialValue
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Lắng nghe sự thay đổi của localStorage
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    const newValue = JSON.parse(e.newValue);
                    setValue(newValue);
                } catch (error) {
                    console.error(`Error parsing localStorage value for key "${key}":`, error);
                }
            } else if (e.key === key && e.newValue === null) {
                setValue(initialValue);
            }
        };

        // Lắng nghe sự thay đổi từ các tab khác
        window.addEventListener('storage', handleStorageChange);

        // Lắng nghe custom event từ cùng tab
        window.addEventListener('localStorageChange', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageChange', handleStorageChange);
        };
    }, [key, initialValue]);

    // Hàm để cập nhật cả localStorage và state
    const setStoredValue = (newValue) => {
        try {
            setValue(newValue);
            window.localStorage.setItem(key, JSON.stringify(newValue));

            // Trigger custom event để các component cùng tab biết
            window.dispatchEvent(new CustomEvent('localStorageChange', {
                detail: { key, newValue }
            }));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [value, setStoredValue];
}