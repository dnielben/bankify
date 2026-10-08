package edu.eci.byteprogramming.bankify.transferencias;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.UUID;

/**
 * Almacenamiento local para el reto. Los datos existen mientras la API esta
 * encendida; al reiniciarla, CuentaSeeder vuelve a cargar las cuentas de prueba.
 */
@Repository
public class CuentaRepository {

    private final ConcurrentMap<String, Cuenta> cuentas = new ConcurrentHashMap<>();

    public List<Cuenta> findAll() {
        return new ArrayList<>(cuentas.values());
    }

    public Optional<Cuenta> findByNumeroCuenta(String numeroCuenta) {
        return cuentas.values().stream()
                .filter(cuenta -> cuenta.getNumeroCuenta().equals(numeroCuenta))
                .findFirst();
    }

    public Cuenta save(Cuenta cuenta) {
        if (cuenta.getId() == null) {
            cuenta.setId(UUID.randomUUID().toString());
        }
        cuentas.put(cuenta.getId(), cuenta);
        return cuenta;
    }

    public long count() {
        return cuentas.size();
    }
}
