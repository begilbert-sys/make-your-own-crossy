import { KeyboardEvent, useState, useRef } from 'react';
import styles from '@/styles/Home.module.css';
import clsx from 'clsx';

interface ISquareProperties {
    index: number,
    focus : number,
    setFocus: (f: number) => void,
}


export default function Square(props : ISquareProperties) {
    const [char, setChar] = useState(' ');
    const inputRef = useRef<HTMLInputElement>(null);

    const getNextFocus = ((currentFocus : number) => {
        return currentFocus + 1;
    });
    
    if (inputRef.current != null && props.focus == props.index) {
        inputRef.current.focus();
    }
    const classList = clsx(styles.square, {"bg-black": false});

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
            setChar(e.key);
        }
        else if (e.key === "Backspace") {
            setChar(' ');
        }
        props.setFocus(getNextFocus(props.index));
    }
    return (
    <input 
        ref = {inputRef}
        type = "text"
        value = {char}
        maxLength = {1}
        className = {classList} 
        onKeyDown = {handleKeyPress}
        onChange = {(e) => {;}} // onChange is required but it does nothing
    />
    )
}