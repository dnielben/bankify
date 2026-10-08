# Bankify — Reto de Ingeniería de Sistemas

Este proyecto simula una aplicación bancaria. Contiene una interfaz React y
una API Spring Boot dentro de un único proyecto Maven. Tu misión es investigar
un problema de transferencias y completar un pequeño ejercicio de integración
con inteligencia artificial.

## Antes de empezar

Necesitas Java 21 o superior. No necesitas Docker, MongoDB, Node.js ni iniciar
Vite manualmente.

```bash
./mvnw clean package -DskipTests
java -jar target/bankify-0.0.1-SNAPSHOT.jar
```

Abre:

- Aplicación: `http://localhost:18080/`
- Documentación y pruebas de la API: `http://localhost:18080/swagger-ui/index.html`

Para ingresar a la interfaz puedes usar:

| Usuario | Contraseña |
|---|---|
| `admin@bankify.com` | `admin123` |
| `carlosmendoza@bankify.com` | `carlitos123%&` |

## El proyecto

```
src/main/java/edu/eci/byteprogramming/bankify/
├── transferencias/                 lógica del reto principal
│   └── TransferenciaController.java
└── analisis/
    └── FinancialAnalysisController.java

src/main/frontend/                  interfaz React
src/test/java/                      pruebas automatizadas
```

Los datos viven en memoria. Cada vez que reinicias la aplicación se restauran
dos cuentas ficticias:

| Cuenta | Titular | Saldo inicial |
|---|---|---:|
| `1001` | Ana Perez | $1.000.000 |
| `1002` | Carlos Gomez | $500.000 |

## Parte 1 — Transferencias

La aplicación permite transferir dinero entre las cuentas ficticias, pero hay
un problema en el backend. Tu objetivo es encontrarlo y corregirlo sin cambiar
la interfaz.

### Cómo investigar

1. Consulta las cuentas antes de transferir:
   ```bash
   curl http://localhost:18080/api/cuentas
   ```
2. Haz una transferencia de prueba:
   ```bash
   curl -X POST http://localhost:18080/api/transferencias \
     -H "Content-Type: application/json" \
     -d '{"cuentaOrigen":"1001","cuentaDestino":"1002","monto":100000}'
   ```
3. Consulta otra vez las cuentas y compara los saldos.
4. Prueba también un monto mayor que el saldo disponible.
5. Lee `TransferenciaController.java`, formula una hipótesis y aplica una
   corrección pequeña.

### Criterios de aceptación

Al terminar, una transferencia válida debe:

- descontar exactamente el monto de la cuenta origen;
- acreditar exactamente el monto a la cuenta destino;
- rechazar transferencias sin fondos suficientes;
- devolver una transacción completada con identificador real.

Ejecuta las pruebas para comprobarlo:

```bash
./mvnw test
```

Al inicio algunas pruebas fallan intencionalmente. Tu solución estará lista
cuando todas pasen.

> Para volver a probar desde el mismo saldo inicial, detén la aplicación y
> ejecútala de nuevo.

## Parte 2 — Análisis financiero con IA

En **Mis Transacciones** encontrarás el botón **Analizar con IA**. El modal
envía el prompt escrito y las transacciones visibles a la API, que llama a
Gemini y devuelve un análisis educativo.

### Configurar Gemini

1. Crea una clave de API en [Google AI Studio](https://aistudio.google.com/app/apikey).
2. En la raíz del proyecto crea tu archivo local de configuración:
   ```bash
   cp .env.example .env
   ```
3. Completa `.env`:
   ```properties
   GEMINI_API_KEY=pega_tu_clave_aqui
   GEMINI_MODEL=gemini-2.5-flash-lite
   ```
4. Empaqueta y reinicia la aplicación. El archivo `.env` no se lee de nuevo
   mientras el JAR está ejecutándose.

Nunca subas tu clave a Git ni la escribas en el código del cliente.

### Tu reto de prompt engineering

Abre:

`src/main/java/edu/eci/byteprogramming/bankify/analisis/FinancialAnalysisController.java`

Allí encontrarás `FINAL_INSTRUCTIONS`. Ese bloque es el único que debes
modificar para este ejercicio. Diseña instrucciones que hagan que la IA:

- resuma los movimientos de forma clara;
- identifique patrones o montos llamativos únicamente cuando los datos lo
  permitan;
- entregue recomendaciones educativas, no asesoría financiera profesional;
- responda en español y no invente información.

Prueba varias versiones desde la interfaz y conserva la que produzca una
respuesta útil. No necesitas crear más clases ni modificar React.

Si aparece un error en el modal, léelo: la aplicación muestra el mensaje que
Gemini devolvió. Si un modelo no está disponible para tu cuenta, consulta los
modelos habilitados en AI Studio y actualiza `GEMINI_MODEL` en tu `.env`.

## Parte 3 — Agente con herramientas web

El mismo modal incluye el modo **Agente web**. A diferencia del modo anterior,
el agente puede decidir si necesita consultar información externa antes de
responder. Tiene disponibles dos herramientas web del backend:

- **Consulta de tasa USD/COP**, desde una fuente pública de tasas de cambio.
- **Búsqueda de alertas**, desde una fuente web pública.

El reto sigue concentrado en una sola parte del backend:

`AGENT_INSTRUCTIONS` en `FinancialAnalysisController.java`.

Mejora esas instrucciones para que el agente decida cuál herramienta usar
según el comportamiento observado en las transacciones. Define con claridad:

1. Qué señales justifican una consulta externa.
2. Cuándo debe usar cada herramienta.
3. Cuándo no debe usar ninguna.
4. Cómo debe explicar su decisión sin inventar riesgos ni datos.

Prueba al menos un caso que active una herramienta y otro que no la active.
Las consultas web y su disponibilidad dependen de Gemini y de la red; úsalas
solo con datos ficticios.

### Ejemplo de instrucciones más precisas

Las herramientas son opcionales para la IA. Si quieres que el agente las use
cuando aparezcan señales claras, escribe instrucciones explícitas, por ejemplo:

```text
Antes de responder, revisa todos los mensajes de las transacciones.

Si alguno contiene viaje, dólar, USD, moneda extranjera, remesa o compra internacional,
DEBES llamar a consultar_tasa_usd_cop antes de responder.

Si alguno contiene urgencia, premio, cripto, enlace sospechoso o destinatario nuevo,
DEBES llamar a buscar_alertas_fraude antes de responder.

Solo si no aparece ninguna de esas señales puedes responder sin herramientas.
Indica siempre qué herramienta usaste y por qué.
```

Úsalo como punto de partida y ajusta la política con tus propias pruebas.

## Entrega sugerida

Comparte:

1. El código con la corrección de transferencias.
2. Una captura o breve explicación de las pruebas pasando.
3. El texto final de `FINAL_INSTRUCTIONS` y una captura del análisis generado.
4. El texto final de `AGENT_INSTRUCTIONS`, con evidencia de una decisión de
   herramienta web.
5. Una explicación corta de qué información viaja desde la interfaz hasta la
   IA y por qué la clave no debe ir en React.

No incluyas el archivo `.env` en tu entrega.
