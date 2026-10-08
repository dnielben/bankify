package edu.eci.byteprogramming.bankify.transferencias;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Estas pruebas describen el criterio de aceptacion de la transferencia:
 * la cuenta origen debe quedar debitada, la cuenta destino acreditada
 * y la operacion debe quedar registrada. Mientras el modulo tenga el
 * error de logica es normal que varias de ellas fallen: eso es la
 * evidencia automatizada del bug. Tras corregir TransferenciaController
 * todas deben pasar.
 */
@ExtendWith(MockitoExtension.class)
class TransferenciaControllerTest {

    @Mock
    private CuentaRepository cuentaRepository;

    @Mock
    private TransaccionRepository transaccionRepository;

    private TransferenciaController controller;

    private Cuenta origen;
    private Cuenta destino;

    @BeforeEach
    void setUp() {
        controller = new TransferenciaController(cuentaRepository, transaccionRepository);
        origen = new Cuenta("1", "1001", "Ana Perez", 1_000_000);
        destino = new Cuenta("2", "1002", "Carlos Gomez", 500_000);
    }

    private void mockCuentas() {
        when(cuentaRepository.findByNumeroCuenta("1001")).thenReturn(Optional.of(origen));
        when(cuentaRepository.findByNumeroCuenta("1002")).thenReturn(Optional.of(destino));
    }

    @Test
    void listarCuentas_debeRetornarLasCuentasDelRepositorio() {
        when(cuentaRepository.findAll()).thenReturn(List.of(origen, destino));

        List<Cuenta> resultado = controller.listarCuentas();

        assertEquals(2, resultado.size());
    }

    @Test
    void transferir_debeRechazarMontosMenoresOIgualesACero() {
        mockCuentas();
        TransferenciaRequest request = new TransferenciaRequest("1001", "1002", 0);

        assertThrows(ResponseStatusException.class, () -> controller.transferir(request));
    }

    @Test
    void transferir_debeRechazarCuentaOrigenInexistente() {
        when(cuentaRepository.findByNumeroCuenta("9999")).thenReturn(Optional.empty());
        TransferenciaRequest request = new TransferenciaRequest("9999", "1002", 100_000);

        assertThrows(ResponseStatusException.class, () -> controller.transferir(request));
    }

    @Test
    void transferir_debeDescontarElMontoDeLaCuentaOrigen() {
        mockCuentas();
        TransferenciaRequest request = new TransferenciaRequest("1001", "1002", 100_000);

        controller.transferir(request);

        assertEquals(900_000, origen.getSaldo(), 0.001,
                "La cuenta origen deberia quedar con el saldo descontado");
    }

    @Test
    void transferir_debeAcreditarElMontoEnLaCuentaDestino() {
        mockCuentas();
        TransferenciaRequest request = new TransferenciaRequest("1001", "1002", 100_000);

        controller.transferir(request);

        assertEquals(600_000, destino.getSaldo(), 0.001,
                "La cuenta destino deberia recibir el monto transferido");
    }

    @Test
    void transferir_debeRechazarSiNoHayFondosSuficientes() {
        mockCuentas();
        TransferenciaRequest request = new TransferenciaRequest("1001", "1002", 5_000_000);

        assertThrows(ResponseStatusException.class, () -> controller.transferir(request));
        assertEquals(1_000_000, origen.getSaldo(), 0.001,
                "Si no hay fondos suficientes el saldo origen no debe modificarse");
    }

    @Test
    void transferir_debeRegistrarLaTransaccionComoCompletada() {
        mockCuentas();
        TransferenciaRequest request = new TransferenciaRequest("1001", "1002", 100_000);

        Transaccion resultado = controller.transferir(request);

        ArgumentCaptor<Transaccion> captor = ArgumentCaptor.forClass(Transaccion.class);
        verify(transaccionRepository).save(captor.capture());

        Transaccion registrada = captor.getValue();
        assertEquals("1001", registrada.getCuentaOrigen());
        assertEquals("1002", registrada.getCuentaDestino());
        assertEquals(100_000, registrada.getMonto(), 0.001);
        assertEquals("COMPLETADA", registrada.getEstado());
        assertEquals("COMPLETADA", resultado.getEstado());
    }
}
