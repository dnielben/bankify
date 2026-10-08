import { useEffect, useRef, useState } from 'react';
import { IconCheck, IconSortDescending } from '@tabler/icons-react';
import './../../assets/css/app/SortDropdown.css';

/**
 * Botón con menú desplegable para ordenar listados (tablas, etc.).
 * Reemplaza al <select> nativo porque su apariencia no se puede
 * personalizar de forma consistente entre navegadores.
 *
 * Reutilizable en cualquier vista con listados (Transferencias, Créditos, ...).
 *
 * @param {{ value: string, label: string }[]} options
 * @param {string} value - Valor seleccionado actualmente.
 * @param {(value: string) => void} onChange
 * @param {string} [label] - Texto fijo del botón (no cambia al seleccionar, igual al diseño).
 */
export const SortDropdown = ({ options, value, onChange, label = 'Ordenar Por' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="sort-dropdown" ref={containerRef}>
            <button
                type="button"
                className="sort-dropdown-trigger"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <IconSortDescending size={18} />
                <span>{label}</span>
            </button>

            {isOpen && (
                <ul className="sort-dropdown-menu" role="listbox">
                    {options.map((opt) => (
                        <li key={opt.value}>
                            <button
                                type="button"
                                className={`sort-dropdown-option${opt.value === value ? ' sort-dropdown-option-active' : ''}`}
                                onClick={() => handleSelect(opt.value)}
                                role="option"
                                aria-selected={opt.value === value}
                            >
                                {opt.label}
                                {opt.value === value && <IconCheck size={16} />}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SortDropdown;
