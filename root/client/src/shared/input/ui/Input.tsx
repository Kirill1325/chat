import React from 'react'
import cl from './Input.module.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined
}

export const Input = ({ type, placeholder, value, onChange, onBlur, id, name }: InputProps) => {
  return (
    <input
      className={cl.input}
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}
