package edu.eci.byteprogramming.bankify.transferencias;

import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/** Almacenamiento local de transacciones durante la ejecucion de la API. */
@Repository
public class TransaccionRepository {

    private final ConcurrentMap<String, Transaccion> transacciones = new ConcurrentHashMap<>();

    public Transaccion save(Transaccion transaccion) {
        if (transaccion.getId() == null) {
            transaccion.setId(UUID.randomUUID().toString());
        }
        transacciones.put(transaccion.getId(), transaccion);
        return transaccion;
    }
}
