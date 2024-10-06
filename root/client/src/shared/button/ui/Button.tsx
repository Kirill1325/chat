import React from 'react'
import cl from './Button.module.scss'

export enum ButtonVariants {
    contained = 'contained',
    outlined = 'outlined',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: ButtonVariants,
}

export const Button = ({ type, variant, children, onClick }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${cl.button} ${cl[variant]}`}
        >
            {children}
        </button>
    )
}
