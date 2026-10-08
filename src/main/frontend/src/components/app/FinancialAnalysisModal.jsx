import { useEffect, useState } from 'react';
import { IconBrain, IconSend } from '@tabler/icons-react';
import { toast } from 'sonner';
import Modal from '../common/Modal';

const DEFAULT_PROMPT = 'Analiza estas transacciones ficticias en COP. Identifica patrones, gastos inusuales y brinda una recomendación breve. No inventes datos ni des asesoría financiera profesional.';

const FinancialAnalysisModal = ({ isOpen, onClose, transactions }) => {
    const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
    const [mode, setMode] = useState('PROMPT');
    const [analysis, setAnalysis] = useState('');
    const [toolsUsed, setToolsUsed] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setAnalysis('');
            setToolsUsed([]);
            setErrorMessage('');
        }
    }, [isOpen]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setAnalysis('');
        setToolsUsed([]);
        setErrorMessage('');

        try {
            const response = await fetch('/api/analisis-financiero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, transactions, mode }),
            });
            const responseText = await response.text();
            let data = {};
            try {
                data = JSON.parse(responseText);
            } catch {
                // Si el servidor respondió texto plano, se muestra tal como llegó.
            }
            if (!response.ok) {
                throw new Error(data.detail || data.message || responseText || 'No fue posible generar el análisis.');
            }
            if (!data.analysis) {
                throw new Error('Gemini respondió, pero no entregó un texto de análisis.');
            }
            setAnalysis(data.analysis);
            setToolsUsed(data.toolsUsed || []);
        } catch (error) {
            const message = error.message || 'No fue posible conectar con el servicio de IA.';
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="720px">
            <h2 className="modal-title">Análisis financiero con IA</h2>
            <p className="modal-subtitle">
                Gemini analiza únicamente las transacciones ficticias que se ven actualmente en la tabla.
            </p>

            <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-field">
                    <label htmlFor="analysis-prompt">Prompt</label>
                    <textarea
                        id="analysis-prompt"
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        required
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="analysis-mode">Modo</label>
                    <select id="analysis-mode" value={mode} onChange={(event) => setMode(event.target.value)}>
                        <option value="PROMPT">Prompt engineering</option>
                        <option value="AGENT">Agente web</option>
                    </select>
                </div>

                <button type="submit" className="modal-submit" disabled={isLoading}>
                    <IconSend size={16} />
                    {isLoading ? 'Analizando...' : 'Enviar al API'}
                </button>
            </form>

            {analysis && (
                <div className="analysis-result" aria-live="polite">
                    <div className="analysis-result-title"><IconBrain size={18} /> Respuesta de Gemini</div>
                    <p>{analysis}</p>
                    {toolsUsed.length > 0 && <small>Herramienta usada: {toolsUsed.join(', ')}</small>}
                </div>
            )}

            {errorMessage && (
                <div className="analysis-error" role="alert">
                    <strong>Error del análisis:</strong> {errorMessage}
                </div>
            )}
        </Modal>
    );
};

export default FinancialAnalysisModal;
