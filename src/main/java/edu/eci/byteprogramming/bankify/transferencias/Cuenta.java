package edu.eci.byteprogramming.bankify.transferencias;

public class Cuenta {

    private String id;
    private String numeroCuenta;
    private String titular;
    private double saldo;

    public Cuenta() {
    }

    public Cuenta(String id, String numeroCuenta, String titular, double saldo) {
        this.id = id;
        this.numeroCuenta = numeroCuenta;
        this.titular = titular;
        this.saldo = saldo;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNumeroCuenta() {
        return numeroCuenta;
    }

    public void setNumeroCuenta(String numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }

    public String getTitular() {
        return titular;
    }

    public void setTitular(String titular) {
        this.titular = titular;
    }

    public double getSaldo() {
        return saldo;
    }

    public void setSaldo(double saldo) {
        this.saldo = saldo;
    }
}
