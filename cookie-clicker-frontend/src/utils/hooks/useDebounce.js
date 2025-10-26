import { useState } from "react";

export default function useDebounce() {
    const [typingTimeout, setTypingTimeout] = useState('');

    function debounce(func, wait = 500) {
        clearTimeout(typingTimeout);

        const timeout = setTimeout(() => func(), wait);

        setTypingTimeout(timeout);
    }


    return debounce;
}