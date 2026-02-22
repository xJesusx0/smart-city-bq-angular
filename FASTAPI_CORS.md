# FastAPI: CORS y cookies para uso con frontend en Vercel / localhost

Instrucciones rápidas para habilitar CORS y enviar cookies de autenticación (jwt) desde un backend FastAPI hacia un frontend servido en `http://localhost:4200` o en `https://tu-frontend.vercel.app`.

## 1) Añadir middleware de CORS

```py
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:4200",
    "https://tu-frontend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # No uses '*'
    allow_credentials=True,          # necesario para cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

## 2) Ejemplo de endpoint de `login` que devuelve cookie `jwt_token`

```py
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta

app = FastAPI()

@app.post('/api/auth/login')
async def login(username: str, password: str):
    # valida credenciales (ej. con DB)
    if username != 'demo' or password != 'secret':
        raise HTTPException(status_code=401, detail='invalid credentials')

    # genera token JWT (ejemplo simplificado)
    token = 'eyJhbGciOi...'

    response = JSONResponse({"access_token": token})

    # Ajusta la expiración según tu política
    expires = datetime.utcnow() + timedelta(days=7)

    response.set_cookie(
        key='jwt_token',
        value=token,
        httponly=True,
        secure=True,        # obligatorio en producción HTTPS
        samesite='none',    # necesario para cookies cross-site
        expires=expires.strftime('%a, %d %b %Y %H:%M:%S GMT'),
        path='/'
    )

    return response
```

Notas:

- `allow_credentials=True` y `samesite='none'` son requeridos si el frontend y el backend están en orígenes distintos y usas `fetch(..., { credentials: 'include' })`.
- En desarrollo puedes usar `secure=False` si no estás en HTTPS, pero en producción usa `secure=True`.

## 3) Manejo de `OPTIONS` preflight

El middleware `CORSMiddleware` de Starlette/FastAPI ya responde correctamente a `OPTIONS` si lo configuras como arriba. Verifica con `curl`:

```bash
curl -i -X OPTIONS 'https://smart-city-bq-traffic-api.vercel.app/api/auth/login' \
  -H 'Origin: http://localhost:4200' \
  -H 'Access-Control-Request-Method: POST'
```

Debes ver en la respuesta cabeceras: `Access-Control-Allow-Origin: http://localhost:4200` y `Access-Control-Allow-Credentials: true`.

## 4) Probar login con curl (ver cookies)

```bash
curl -i -X POST 'https://smart-city-bq-traffic-api.vercel.app/api/auth/login' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Origin: http://localhost:4200' \
  --data 'username=demo&password=secret' \
  -c cookies.txt

# revisa cookies guardadas
cat cookies.txt
```

Si la petición es correcta verás `Set-Cookie` en la respuesta y `cookies.txt` contendrá la cookie `jwt_token`.

## 5) Despliegue en Vercel

- Asegúrate de que la función serverless o el servicio FastAPI expuesto en Vercel incluya la misma configuración de CORS.
- Si tu backend está detrás de un proxy (ej. Gunicorn / Uvicorn), las cabeceras `Set-Cookie` y CORS deben conservarse.

## 6) Verificación en el navegador

- En DevTools → Network, inspecciona la petición `POST /api/auth/login`:
  - Debes ver `Access-Control-Allow-Origin` igual al `Origin` del frontend.
  - Debes ver `Access-Control-Allow-Credentials: true`.
  - En pestaña `Application` → `Cookies` debería aparecer `jwt_token` si todo está bien.

---

Si quieres, puedo:

- Generar un pequeño repositorio de ejemplo FastAPI con endpoints `login` y `me` y CORS listo para desplegar en Vercel, o
- Preparar el fragmento exacto para pegar en tu código actual (si me indicas el archivo donde quieres integrarlo).
