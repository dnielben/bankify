package edu.eci.byteprogramming.bankify.analisis;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

/** Un único endpoint Spring alrededor del quickstart de Gemini. */
@RestController
@RequestMapping("/api/analisis-financiero")
public class FinancialAnalysisController {
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

    /* RETO 2: este es el único bloque que los estudiantes deben cambiar. */
    private static final String FINAL_INSTRUCTIONS = """
            Eres un asistente educativo de un banco ficticio.
            Los datos son ficticios y están expresados en COP.
            No inventes datos, responde en español y no des asesoría financiera profesional.
            """;

    /* RETO 3: aquí se define cuándo el agente debe escoger cada herramienta. */
    private static final String AGENT_INSTRUCTIONS = """
            Actúa como un agente educativo de prevención financiera.

            Puedes usar dos herramientas web:
            - consultar_tasa_usd_cop: solo ante señales de viaje, remesa, dólar,
              moneda extranjera o compra internacional.
            - buscar_alertas_fraude: solo ante urgencia, premio, cripto, enlace
              sospechoso, destinatario nuevo o un monto claramente inusual.
            No uses herramientas si los movimientos no dan evidencia suficiente.
            Indica qué herramienta usaste y por qué. No inventes alertas ni tasas.
            """;

    private final String apiKey;
    private final String model;
    private final ObjectMapper json = new ObjectMapper();
    private final HttpClient http = HttpClient.newHttpClient();

    public FinancialAnalysisController(
            @Value("${gemini.api-key:}") String apiKey,
            @Value("${gemini.model:gemini-2.5-flash-lite}") String model) {
        this.apiKey = apiKey;
        this.model = model;
    }

    @PostMapping
    public Map<String, Object> analyze(@RequestBody Map<String, Object> data) {
        String userPrompt = String.valueOf(data.get("prompt"));
        if (userPrompt.isBlank() || userPrompt.equals("null")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El prompt es obligatorio");
        }
        if (apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Configura GEMINI_API_KEY en .env");
        }

        try {
            boolean agentMode = "AGENT".equals(data.get("mode"));
            String instructions = agentMode ? AGENT_INSTRUCTIONS : FINAL_INSTRUCTIONS;
            String finalPrompt = instructions + "\nSolicitud del usuario:\n" + userPrompt
                    + "\n\nTransacciones visibles:\n" + json.writeValueAsString(data.get("transactions"));

            ObjectNode firstRequest = requestFor(finalPrompt, agentMode);
            JsonNode firstResponse = callGemini(firstRequest);
            JsonNode modelContent = firstResponse.path("candidates").path(0).path("content");
            JsonNode functionCall = findFunctionCall(modelContent);

            if (!agentMode || functionCall.isMissingNode()) {
                return Map.of("analysis", readAnswer(firstResponse), "toolsUsed", List.of());
            }

            String toolName = functionCall.path("name").asText();
            String toolResult = runTool(toolName, functionCall.path("args"));
            JsonNode finalResponse = callGemini(requestWithToolResult(finalPrompt, modelContent, functionCall, toolResult));
            return Map.of("analysis", readAnswer(finalResponse), "toolsUsed", List.of(toolName));
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "No fue posible conectar con Gemini", exception);
        }
    }

    private ObjectNode requestFor(String prompt, boolean includeTools) {
        ObjectNode request = json.createObjectNode();
        request.putArray("contents").addObject().putArray("parts").addObject().put("text", prompt);
        if (includeTools) {
            ArrayNode declarations = json.createArrayNode();
            ObjectNode rateDeclaration = declarations.addObject();
            rateDeclaration.put("name", "consultar_tasa_usd_cop");
            rateDeclaration.put("description", "Consulta una tasa de cambio actual USD a COP desde una fuente web pública.");
            rateDeclaration.putObject("parameters").put("type", "OBJECT").putObject("properties");

            ObjectNode fraudDeclaration = declarations.addObject();
            fraudDeclaration.put("name", "buscar_alertas_fraude");
            fraudDeclaration.put("description", "Busca alertas públicas relacionadas con fraude financiero en Colombia.");
            ObjectNode fraudParameters = fraudDeclaration.putObject("parameters");
            fraudParameters.put("type", "OBJECT");
            fraudParameters.putObject("properties").putObject("query")
                    .put("type", "STRING").put("description", "Términos breves para buscar alertas.");
            request.putArray("tools").addObject().set("functionDeclarations", declarations);
        }
        return request;
    }

    private ObjectNode requestWithToolResult(String prompt, JsonNode modelContent, JsonNode functionCall, String toolResult) {
        ObjectNode request = requestFor(prompt, true);
        ArrayNode history = (ArrayNode) request.path("contents");
        history.add(modelContent);
        ObjectNode functionResponse = json.createObjectNode();
        functionResponse.put("name", functionCall.path("name").asText());
        if (functionCall.hasNonNull("id")) {
            functionResponse.put("id", functionCall.path("id").asText());
        }
        functionResponse.putObject("response").put("result", toolResult);
        history.addObject().put("role", "user").putArray("parts")
                .addObject().set("functionResponse", functionResponse);
        return request;
    }

    private JsonNode callGemini(ObjectNode payload) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GEMINI_URL + model + ":generateContent?key=" + apiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(payload)))
                .build();
        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini respondió: " + response.body());
        }
        return json.readTree(response.body());
    }

    private JsonNode findFunctionCall(JsonNode content) {
        for (JsonNode part : content.path("parts")) {
            if (part.has("functionCall")) {
                return part.path("functionCall");
            }
        }
        return com.fasterxml.jackson.databind.node.MissingNode.getInstance();
    }

    private String runTool(String toolName, JsonNode args) throws Exception {
        return switch (toolName) {
            case "consultar_tasa_usd_cop" -> consultarTasaUsdCop();
            case "buscar_alertas_fraude" -> buscarAlertasFraude(args.path("query").asText("alertas fraude financiero Colombia"));
            default -> "La herramienta solicitada no está disponible.";
        };
    }

    private String consultarTasaUsdCop() throws Exception {
        JsonNode rates = getWebJson("https://open.er-api.com/v6/latest/USD");
        return "Fuente: ExchangeRate-API. 1 USD equivale a " + rates.path("rates").path("COP").asDouble()
                + " COP. Fecha de actualización: " + rates.path("time_last_update_utc").asText("no indicada") + ".";
    }

    private String buscarAlertasFraude(String query) throws Exception {
        String url = "https://api.duckduckgo.com/?format=json&no_html=1&q="
                + URLEncoder.encode(query, StandardCharsets.UTF_8);
        JsonNode result = getWebJson(url);
        String summary = result.path("AbstractText").asText();
        if (summary.isBlank()) {
            summary = "La búsqueda no devolvió un resumen verificable. No afirmes que existe una alerta específica.";
        }
        return "Fuente: DuckDuckGo Instant Answer API. " + summary;
    }

    private JsonNode getWebJson(String url) throws Exception {
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            return json.createObjectNode().put("error", "La fuente web no respondió correctamente.");
        }
        return json.readTree(response.body());
    }

    private String readAnswer(JsonNode response) {
        List<String> partTypes = new ArrayList<>();
        for (JsonNode part : response.path("candidates").path(0).path("content").path("parts")) {
            String answer = part.path("text").asText();
            if (!answer.isBlank()) {
                return answer;
            }
            part.fieldNames().forEachRemaining(partTypes::add);
        }
        String details = partTypes.isEmpty() ? "sin partes de contenido" : String.join(", ", partTypes);
        throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "Gemini no devolvió texto para el análisis. Partes recibidas: " + details);
    }

    /** Devuelve el detalle de Gemini al modal, sin depender de la página de error de Spring. */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> showError(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatusCode())
                .body(Map.of("detail", exception.getReason()));
    }
}
