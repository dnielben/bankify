import React from 'react';

export const InputField = ({
    label,
    id,
    type = 'text',
    placeholder,
    value,
    onChange,
    iconLeft: IconLeft,
    iconRight: IconRight,
    onIconRightClick,
    required = false
}) => {
    return (
        <div className="input-group">
            <label htmlFor={id}>{label}</label>
            <div className="input-wrapper">
                {IconLeft && <IconLeft size={20} className="input-icon-left" />}
                <input
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    className={`login-input ${type === 'password' ? 'login-input-password' : ''}`}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
                {IconRight && (
                    <button type="button" className="input-icon-right" onClick={onIconRightClick}>
                        <IconRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputField;