import { useState } from "react";
import { IconDatabase, IconLock, IconPhotoScan } from "@tabler/icons-react";
import AdminCard from "../../components/admin/AdminCard";
import SummaryGallery from "../../components/admin/SummaryGallery";
import TopAdmin from "../../components/admin/TopAdmin";

const STORAGE_KEY = "admin-modules-status";
const FILES_KEY = "admin-modules-files";

// Archivos que sirve mod-1 según el estado del bug de seguridad
const USERS_FILE_INSECURE = "/files/users.json";         // passwords en texto plano
const USERS_FILE_SECURE   = "/files/users_hashed.json";  // passwords hasheadas

// El bug de seguridad se considera "corregido" cuando mod-1 está completado
// (sus 2 archivos de corrección fueron subidos)
const isSecurityBugFixed = (statusMap) =>
    statusMap["mod-1"] === "completado";

const MODULES = [
    {
        id: "mod-1",
        title: "Gestión de Seguridad de Credenciales",
        team: "Equipo de Seguridad",
        icon: IconLock,
        // downloadFile se resuelve dinámicamente en el render, no aquí
        downloadText: "Descargar BD de Clientes",
        uploadSlots: [
            { id: 1, label: "Adjunte el archivo correspondiente al módulo de auditoría de vulnerabilidades para su procesamiento y validación." },
            { id: 2, label: "Adjunte el archivo correspondiente al módulo de cifrado de datos para su procesamiento y validación." },
        ],
    },
    {
        id: "mod-2",
        title: "Actualización de Matriz de Usuarios",
        team: "EQUIPO DE ESTADÍSTICA",
        icon: IconDatabase,
        uploadSlots: [
            { id: 1, label: "Carga el archivo con la matriz de usuarios actualizada para sincronizar el sistema." },
        ],
    },
    {
        id: "mod-3",
        title: "Configuración de Verificación Visual con modelo CATPCHA",
        team: "EQUIPO DE inteligencia artificial",
        icon: IconPhotoScan,
        downloadFile: "/files/modelo-ia 1.zip",
        downloadText: "Descargar archivo de configuración",
        uploadSlots: [
            { id: 1, label: "Carga el modelo de verificación visual para actualizar el módulo de autenticación." },
        ],
    },
    {
        id: "mod-4",
        title: "Gestión del Procesamiento de Transacciones Bancarias",
        team: "EQUIPO DE sistemas",
        icon: IconDatabase,
        uploadSlots: [
            { id: 1, label: "Revisa el módulo de transferencias para corregir inconsistencias en el cálculo de saldos y sube la versión actualizada del sistema." },
        ],
    },
];

const getDefaultStatus = () =>
    MODULES.reduce((acc, mod) => {
        acc[mod.id] = "pendiente";
        return acc;
    }, {});

const loadFromStorage = (key, fallback) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
    } catch (err) {
        console.error(`Error leyendo ${key}:`, err);
        return fallback;
    }
};

const AdminView = () => {
    const [statusMap, setStatusMap] = useState(() => loadFromStorage(STORAGE_KEY, getDefaultStatus()));
    const [filesMap, setFilesMap] = useState(() => loadFromStorage(FILES_KEY, {}));

    const persistStatus = (next) => {
        setStatusMap(next);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
        catch (err) { console.error("Error guardando status:", err); }
    };

    const persistFiles = (next) => {
        setFilesMap(next);
        try { localStorage.setItem(FILES_KEY, JSON.stringify(next)); }
        catch (err) { console.error("Error guardando archivos:", err); }
    };

    const handleFileUpload = (moduleId, slotId, file) => {
        const fileName = file.name;

        const nextFiles = {
            ...filesMap,
            [moduleId]: { ...(filesMap[moduleId] ?? {}), [slotId]: fileName },
        };
        persistFiles(nextFiles);

        const module = MODULES.find((m) => m.id === moduleId);
        const allSlotsFilled = module.uploadSlots.every(
            (slot) => Boolean(nextFiles[moduleId]?.[slot.id])
        );

        persistStatus({
            ...statusMap,
            [moduleId]: allSlotsFilled ? "completado" : "pendiente",
        });

        if (moduleId === "mod-2" && allSlotsFilled) {
            localStorage.setItem("bug_correlacion_fixed", "true");
        }
        if (moduleId === "mod-3" && allSlotsFilled) {
            localStorage.setItem("bug_captcha_fixed", "true");
        }
    };

    const handleReset = () => {
        persistStatus(getDefaultStatus());
        persistFiles({});
        localStorage.setItem("bug_correlacion_fixed", "false");
    };

    const summaryItems = MODULES.map((mod) => ({
        id: mod.id,
        team: mod.team,
        title: mod.title,
        status: statusMap[mod.id],
        statusLabel: statusMap[mod.id] === "completado" ? "Completado" : "Pendiente",
    }));

    return (
        <main className="main-content">
            <TopAdmin onReset={handleReset} />
            <SummaryGallery items={summaryItems} />

            {MODULES.map((mod) => {
                const uploadedCount = mod.uploadSlots.filter(
                    (slot) => Boolean(filesMap[mod.id]?.[slot.id])
                ).length;

                // mod-1: el archivo y el texto del botón cambian según si el bug está corregido
                const bugFixed = mod.id === "mod-1" && isSecurityBugFixed(statusMap);
                const resolvedDownloadFile =
                    mod.id === "mod-1"
                        ? bugFixed
                            ? USERS_FILE_SECURE
                            : USERS_FILE_INSECURE
                        : mod.downloadFile;
                const resolvedDownloadText =
                    mod.id === "mod-1"
                        ? bugFixed
                            ? "Descargar DB Corregida"
                            : mod.downloadText
                        : mod.downloadText;

                return (
                    <AdminCard
                        key={mod.id}
                        title={mod.title}
                        team={mod.team}
                        icon={mod.icon}
                        status={statusMap[mod.id]}
                        statusLabel={statusMap[mod.id] === "completado" ? "Completado" : "Pendiente"}
                        progress={{ done: uploadedCount, total: mod.uploadSlots.length }}
                        uploadSlots={mod.uploadSlots.map((slot) => ({
                            ...slot,
                            fileName: filesMap[mod.id]?.[slot.id],
                        }))}
                        onFileUpload={(slotId, file) => handleFileUpload(mod.id, slotId, file)}
                        downloadAction={resolvedDownloadFile ? {
                            label: resolvedDownloadText,
                            onClick: () => {
                                const a = document.createElement('a');
                                a.href = resolvedDownloadFile;
                                a.download = resolvedDownloadFile.split('/').pop();
                                a.click();
                            }
                        } : undefined}
                    />
                );
            })}
        </main>
    );
};

export default AdminView;