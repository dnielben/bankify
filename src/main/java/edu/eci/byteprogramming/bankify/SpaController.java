package edu.eci.byteprogramming.bankify;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Sirve la aplicacion React cuando se navega o se recarga una ruta del cliente.
 * Las rutas de la API y de Swagger no coinciden con estos prefijos.
 */
@Controller
public class SpaController {

    @GetMapping({"/", "/auth/**", "/app/**"})
    public String index() {
        return "forward:/index.html";
    }
}
