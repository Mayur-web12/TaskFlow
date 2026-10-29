

import { LoaderCircle } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    type = 'button',
    loading = false,
    disabled = false,
    className = '',
    onClick,
    ...props
}) => {
    const classes = [
        'common-button',
        `common-button--${variant}`,
        `common-button--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        >
            {loading && (
                <LoaderCircle
                    size={16}
                    className="common-button__spinner"
                    aria-hidden="true"
                />
            )}

            {children}
        </button>
    );
};

export default Button;
