import { useState, useEffect, createContext, useRef } from "react";

// Tạo context bên ngoài component để tránh tạo lại mỗi lần render
export const UseClock = createContext();

export default function ClockBase({ type, duration, semaphore, children, setTimeFinish }) {
    const [clock, setClock] = useState({
        minute: 0,
        second: 0,
        remain: duration
    })

    const intervalRef = useRef(null)
    const initTimeRef = useRef(Date.now()) // Dùng cho chế độ đếm tăng

    function countdown() {
        const endTime = Date.now() + (duration + 1) * 1000;

        intervalRef.current = setInterval(() => {
            const remain = Math.max(endTime - Date.now(), 0);
            const minute = Math.floor(remain / 60000);
            const second = Math.floor(remain / 1000) % 60;

            setClock(prevState => {
                // Chỉ cập nhật nếu giá trị thay đổi
                if (prevState.minute === minute && prevState.second === second) {
                    return prevState;
                }
                return { remain, minute, second };
            });

            if (remain <= 0) {
                clearInterval(intervalRef.current);
                setClock(prevState => ({ ...prevState, remain: 0 }));
                setTimeFinish({
                    minute: 0,
                    second: 0,
                    remain: 0
                })
            }
        }, 1000);
    }

    function count() {
        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - initTimeRef.current;
            const minute = Math.floor(elapsed / 60000);
            const second = Math.floor(elapsed / 1000) % 60;

            setClock(prevState => {
                // Chỉ cập nhật nếu giá trị thay đổi
                if (prevState.minute === minute && prevState.second === second) {
                    return prevState;
                }
                return { minute, second, remain: elapsed };
            });
        }, 1000);
    }

    useEffect(() => {
        setClock(prevState => ({
            ...prevState,
            minute: Math.floor(duration / 60),
            second: Math.floor(duration) % 60
        }))

        // Dừng đồng hồ nếu có cờ hiệu
        if (semaphore) {
            clearInterval(intervalRef.current);
            setTimeFinish(clock)
            return;
        }

        // Xóa interval cũ trước khi tạo mới
        clearInterval(intervalRef.current);

        if (type === 'countdown') {
            countdown();
        } else if (type === 'count') {
            initTimeRef.current = Date.now(); // Reset thời gian bắt đầu
            count();
        }

        return () => clearInterval(intervalRef.current);
    }, [type, duration, semaphore])

    return (
        <UseClock.Provider value={clock}>
            {children}
        </UseClock.Provider>
    );
}