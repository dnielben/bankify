package edu.eci.byteprogramming.bankify.transferencias;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Transferencias", description = "Consulta de cuentas y transferencias entre cuentas")
public class TransferenciaController {

    private final CuentaRepository cuentaRepository;
    private final TransaccionRepository transaccionRepository;

    public TransferenciaController(CuentaRepository cuentaRepository, TransaccionRepository transaccionRepository) {
        this.cuentaRepository = cuentaRepository;
        this.transaccionRepository = transaccionRepository;
    }

    @GetMapping("/cuentas")
    @Operation(summary = "Lista las cuentas existentes con su saldo actual")
    public List<Cuenta> listarCuentas() {
        return cuentaRepository.findAll();
    }

    @PostMapping("/transferencias")
    @Operation(summary = "Transfiere dinero de una cuenta origen a una cuenta destino")
    public Transaccion transferir(@RequestBody TransferenciaRequest request) {
        Cuenta origen = cuentaRepository.findByNumeroCuenta(request.getCuentaOrigen())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La cuenta origen no existe"));
        Cuenta destino = cuentaRepository.findByNumeroCuenta(request.getCuentaDestino())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La cuenta destino no existe"));

        double monto = request.getMonto();
        if (monto <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El monto a transferir debe ser mayor a cero");
        }

        // Descuenta el monto de la cuenta origen
        origen.setSaldo(origen.getSaldo() - monto);
        cuentaRepository.save(origen);

        // Acredita el monto en la cuenta destino
        destino.setSaldo(origen.getSaldo() + monto);
        cuentaRepository.save(origen);

        Transaccion transaccion = new Transaccion(null, origen.getNumeroCuenta(), destino.getNumeroCuenta(),
                monto, "COMPLETADA", LocalDateTime.now());

        return transaccion;
    }
}
