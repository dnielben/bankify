# Guía privada del instructor — Bankify

> **No compartir con estudiantes.** Antes de entregar el repositorio, compartir
> todo excepto este archivo y cualquier `.env` local.

## Propósito del ejercicio

El reto está pensado para estudiantes de colegio que exploran Ingeniería de
Sistemas. Tiene dos momentos cortos:

1. Diagnosticar y corregir una transferencia inconsistente en un backend
   Spring Boot.
2. Configurar una clave de Gemini y mejorar un prompt en un único controlador
   Java, viendo la respuesta en una interfaz ya preparada.

La dificultad está deliberadamente concentrada en una clase por reto. No se
espera que los estudiantes creen arquitectura nueva, conecten bases de datos o
modifiquen el frontend.

## Preparación del demo

1. Usa Java 21 o superior.
2. Desde la raíz del proyecto, ejecuta:
   ```bash
   ./mvnw clean package -DskipTests
   java -jar target/bankify-0.0.1-SNAPSHOT.jar
   ```
3. Confirma `http://localhost:18080/` y Swagger.
4. Para el demo de IA, crea `.env` desde `.env.example`, añade una clave propia
   y reinicia el JAR. La clave solo se carga al iniciar Spring Boot.

El modelo predeterminado es `gemini-2.5-flash-lite`, elegido por ser ligero y
apto para function calling. Las herramientas web del reto se ejecutan desde
Bankify, no mediante Google Search grounding. La disponibilidad depende de la
cuenta y las cuotas de Google; si falla, revisar el mensaje del modal y los
modelos disponibles en AI Studio.

## Reto 1: solución esperada

Archivo: `src/main/java/.../transferencias/TransferenciaController.java`.

La implementación inicial contiene tres fallas:

1. Después de descontar el origen, acredita el monto usando el saldo de
   `origen` y vuelve a guardar `origen`, en vez de actualizar `destino`.
2. No valida fondos suficientes antes de operar.
3. Construye una transacción pero no la guarda en `transaccionRepository`.

La corrección esperada dentro de `transferir(...)` es conceptualmente:

```java
if (origen.getSaldo() < monto) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fondos insuficientes en la cuenta origen");
}

origen.setSaldo(origen.getSaldo() - monto);
cuentaRepository.save(origen);

destino.setSaldo(destino.getSaldo() + monto);
cuentaRepository.save(destino);

Transaccion transaccion = new Transaccion(null, origen.getNumeroCuenta(), destino.getNumeroCuenta(),
        monto, "COMPLETADA", LocalDateTime.now());
transaccionRepository.save(transaccion);
return transaccion;
```

Las pruebas unitarias traducen esos criterios. En el estado inicial, algunas
pruebas fallan a propósito; tras la corrección, todas deben pasar.

## Reto 2: guía de IA

Archivo: `src/main/java/.../analisis/FinancialAnalysisController.java`.

El controlador es una adaptación muy pequeña del quickstart de Gemini:

- recibe `prompt` y `transactions` como JSON;
- concatena ambos con `FINAL_INSTRUCTIONS`;
- hace un `POST` REST con `HttpClient`;
- extrae el texto de la respuesta y lo devuelve al modal.

El estudiante solo debe cambiar `FINAL_INSTRUCTIONS`. Ejemplos de mejoras que
pueden proponer: usar secciones, solicitar una conclusión breve, prohibir
inferencias no sustentadas y pedir que cite los montos concretos usados en la
respuesta. No es necesario explicar agentes, function calling ni herramientas.

## Reto 3: agente web

El selector **Agente web** usa dos funciones del backend que consultan fuentes
web públicas:

- `consultar_tasa_usd_cop`, que consulta una tasa USD/COP.
- `buscar_alertas_fraude`, que solicita un resumen de una búsqueda pública.

Gemini selecciona la función, el backend la ejecuta y entrega el resultado a
Gemini para redactar la respuesta final. No se necesitan claves adicionales ni
cuota de Google Search. El estudiante modifica exclusivamente
`AGENT_INSTRUCTIONS` dentro del mismo controlador. La instrucción inicial da
un ejemplo de selección: buscar alertas de fraude ante comportamientos
sospechosos y consultar tasa de cambio ante referencias a operaciones
internacionales.

Lo importante de la explicación del estudiante no es que fuerce ambas
herramientas: debe justificar cuándo una consulta externa aporta valor y cuándo
no hay evidencia suficiente para usarla. Gemini puede decidir no invocarlas;
esto también es un resultado correcto si las instrucciones y los datos no lo
justifican.

Si se desea que una demostración active una herramienta de forma confiable, el
estudiante puede sustituir `AGENT_INSTRUCTIONS` por esta política explícita:

```text
Antes de responder, revisa todos los mensajes de las transacciones.

Si alguno contiene viaje, dólar, USD, moneda extranjera, remesa o compra internacional,
DEBES llamar a consultar_tasa_usd_cop antes de responder.

Si alguno contiene urgencia, premio, cripto, enlace sospechoso o destinatario nuevo,
DEBES llamar a buscar_alertas_fraude antes de responder.

Solo si no aparece ninguna de esas señales puedes responder sin herramientas.
Indica siempre qué herramienta usaste y por qué.
```

Con las transacciones de prueba que incluyen “viaje”, “dólar” o “USD”, se debe
observar `consultar_tasa_usd_cop` en el modal. La implementación no fuerza una
herramienta desde Java: la selección sigue siendo una decisión explicada por el
agente.

### Problemas comunes de IA

| Mensaje | Causa probable | Acción |
|---|---|---|
| `Configura GEMINI_API_KEY en .env` | Falta clave o no se reinició la app | Revisar `.env`, reconstruir e iniciar de nuevo. |
| `404 ... model ... no longer available` | Modelo no disponible para cuentas nuevas | Cambiar `GEMINI_MODEL` en `.env` por un modelo habilitado en AI Studio. |
| `503 ... high demand` | Saturación temporal del proveedor | Reintentar; usar `gemini-3.5-flash-lite` si está disponible. |
| `401` o `403` | Clave inválida, restringida o sin permiso | Crear/revisar la clave en AI Studio. |

La interfaz muestra los errores de Gemini intencionalmente para hacer el demo
diagnosticable. No usar esta exposición de detalle en un sistema real.

## Propuesta de evaluación

| Aspecto | Evidencia |
|---|---|
| Diagnóstico | Explica qué observó antes de cambiar el código. |
| Corrección | Todas las pruebas de transferencias pasan. |
| Prueba manual | Saldos y respuesta HTTP coherentes. |
| IA | Configura la clave sin exponerla y modifica `FINAL_INSTRUCTIONS`. |
| Comunicación | Explica el recorrido: navegador → API Spring → Gemini → navegador. |

## Entrega del repositorio

Antes de compartir con estudiantes:

1. Elimina o excluye `README-INSTRUCTOR.md`.
2. Verifica que no exista `.env` ni una clave en ningún archivo compartido.
3. Mantén `.env.example`, `README.md`, el código fuente y las pruebas.
4. Ejecuta `./mvnw clean package -DskipTests` como verificación final.
