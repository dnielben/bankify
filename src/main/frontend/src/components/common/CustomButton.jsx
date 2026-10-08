import "./../../assets/css/common/CustomButton.css"

export const CustomButton = ({ children, variant = 'solid', onClick, ...props }) => {
    const variantClasses = {
        solid: 'bankify-btn-solid',
        outline: 'bankify-btn-outline',
        warning: 'bankify-btn-warning',
        success: 'bankify-btn-success',
        'neutral-outline': 'bankify-btn-neutral-outline'
    };

    const buttonClass = variantClasses[variant] || 'bankify-btn-solid';

    return (
        <button
            className={`bankify-btn ${buttonClass}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default CustomButton;