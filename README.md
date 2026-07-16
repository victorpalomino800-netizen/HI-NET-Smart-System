# HI-NET Smart System

Versión de frontend completa, pero todavía no final.

## Incluye

- Login responsive
- Inicio de sesión demo por roles
- Dashboard administrativo
- Dashboard técnico
- Dashboard del cliente
- Sitio público
- Sidebar responsive
- Navbar
- Tarjetas KPI
- Tablas
- Estados visuales
- Sesión local temporal
- Estructura preparada para Supabase

## Usuarios demo

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@hinet.com | 123456 |
| Técnico | tecnico@hinet.com | 123456 |
| Cliente | cliente@hinet.com | 123456 |

## Ejecutar

Usa Live Server en VS Code sobre `index.html`.

También puedes ejecutar:

```bash
python -m http.server 5500
```

Después abre:

```text
http://localhost:5500
```

## Importante

Esta versión todavía usa datos locales.  
La base de datos, autenticación real y políticas se conectarán con Supabase en la siguiente fase.
