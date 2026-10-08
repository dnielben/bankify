package edu.eci.byteprogramming.bankify;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(
        title = "Bankify - Modulo de transferencias",
        version = "1.0",
        description = "Permite consultar cuentas y realizar transferencias entre ellas"))
public class BankifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankifyApplication.class, args);
	}

}
