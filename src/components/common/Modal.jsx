
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'medium',
    closeOnOverlay = true,
}) => {
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="common-modal-overlay"
            onMouseDown={(event) => {
                if (closeOnOverlay && event.target === event.currentTarget) {
                    onClose?.();
                }
            }}
        >
            <section
                className={`common-modal common-modal--${size}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="common-modal-title"
                aria-describedby={description ? 'common-modal-description' : undefined}
            >
                <header className="common-modal__header">
                    <div>
                        <h2 id="common-modal-title">{title}</h2>
                        {description && (
                            <p id="common-modal-description">{description}</p>
                        )}
                    </div>

                    <button
                        type="button"
                        className="common-modal__close"
                        onClick={onClose}
                        aria-label="Close dialog"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="common-modal__body">
                    {children}
                </div>

                {footer && (
                    <footer className="common-modal__footer">
                        {footer}
                    </footer>
                )}
            </section>
        </div>,
        document.body
    );
};

export default Modal;
