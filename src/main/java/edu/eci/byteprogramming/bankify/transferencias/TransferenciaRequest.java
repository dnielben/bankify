package edu.eci.byteprogramming.bankify.transferencias;

import io.swagger.v3.oas.annotations.media.Schema;

public class TransferenciaRequest {

    @Schema(example = "1001", description = "Numero de la cuenta de la que se retira el dinero")
    private String cuentaOrigen;

    @Schema(example = "1002", description = "Numero de la cuenta que recibe el dinero")
    private String cuentaDestino;

    @Schema(example = "100000", description = "Valor a transferir")
    private double monto;

    public TransferenciaRequest() {
    }

    public TransferenciaRequest(String cuentaOrigen, String cuentaDestino, double monto) {
        this.cuentaOrigen = cuentaOrigen;
        this.cuentaDestino = cuentaDestino;
        this.monto = monto;
    }

    public String getCuentaOrigen() {
        return cuentaOrigen;
    }

    public void setCuentaOrigen(String cuentaOrigen) {
        this.cuentaOrigen = cuentaOrigen;
    }

    public String getCuentaDestino() {
        return cuentaDestino;
    }

    public void setCuentaDestino(String cuentaDestino) {
        this.cuentaDestino = cuentaDestino;
    }

    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }
}
