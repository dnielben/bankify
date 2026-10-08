package edu.eci.byteprogramming.bankify.transferencias;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CuentaSeeder implements CommandLineRunner {

    private final CuentaRepository cuentaRepository;

    public CuentaSeeder(CuentaRepository cuentaRepository) {
        this.cuentaRepository = cuentaRepository;
    }

    @Override
    public void run(String... args) {
        if (cuentaRepository.count() == 0) {
            cuentaRepository.save(new Cuenta(null, "1001", "Ana Perez", 1_000_000));
            cuentaRepository.save(new Cuenta(null, "1002", "Carlos Gomez", 500_000));
        }
    }
}
